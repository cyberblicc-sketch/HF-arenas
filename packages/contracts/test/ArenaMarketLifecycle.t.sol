// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Test} from "forge-std/Test.sol";
import {BeaconProxy} from "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";
import {UpgradeableBeacon} from "@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol";
import {ArenaRegistry} from "../src/ArenaRegistry.sol";
import {ArenaMarket} from "../src/ArenaMarket.sol";
import {MockUSDC} from "./helpers/MockUSDC.sol";

contract ArenaMarketLifecycleTest is Test {
    ArenaRegistry internal registry;
    ArenaMarket internal market;
    UpgradeableBeacon internal beacon;
    MockUSDC internal usdc;

    address internal admin = address(0xA11CE);
    address internal creator = address(0xC0DE);
    address internal user1 = address(0xBEEF1);
    address internal user2 = address(0xBEEF2);
    address internal challenger = address(0xBAD1);
    uint256 internal oraclePk = 0xA0B0C0;
    address internal oracle;

    bytes32 internal constant OUTCOME_YES = keccak256("YES");
    bytes32 internal constant OUTCOME_NO = keccak256("NO");

    function setUp() public {
        oracle = vm.addr(oraclePk);
        usdc = new MockUSDC();

        vm.startPrank(admin);
        registry = new ArenaRegistry(address(usdc), admin);
        registry.grantRole(registry.ORACLE_ROLE(), oracle);

        ArenaMarket implementation = new ArenaMarket();
        beacon = new UpgradeableBeacon(address(implementation), address(this));

        bytes32[] memory outcomes = new bytes32[](2);
        outcomes[0] = OUTCOME_YES;
        outcomes[1] = OUTCOME_NO;

        ArenaMarket.MarketParams memory params = ArenaMarket.MarketParams({
            marketId: "lifecycle-test",
            ipfsHash: "ipfs://test",
            sourcePrimary: bytes32("hf"),
            sourceFallback: bytes32("mirror"),
            tieRule: bytes32("void"),
            voidRule: bytes32("void"),
            openTime: block.timestamp,
            closeTime: block.timestamp + 1 days,
            resolveTime: block.timestamp + 2 days,
            challengeWindowSeconds: 1 days
        });

        BeaconProxy proxy = new BeaconProxy(
            address(beacon),
            abi.encodeWithSelector(ArenaMarket.initialize.selector, address(registry), params, outcomes, creator, address(0))
        );
        market = ArenaMarket(address(proxy));
        vm.stopPrank();

        vm.prank(oracle);
        market.approveMarket();
    }

    function testPlaceBetUpdatesStakeAndPools() public {
        uint256 amount = 5 * 10 ** 6;
        uint256 nonce = 1;
        uint256 deadline = block.timestamp + 250;
        _placeBet(user1, OUTCOME_YES, amount, nonce, deadline);

        assertEq(market.totalPool(), amount);
        assertEq(market.outcomePools(OUTCOME_YES), amount);
        assertEq(market.userStakes(user1, OUTCOME_YES), amount);
        assertTrue(market.nonceUsed(user1, nonce));
    }

    function testCreatorCapEnforcedAfterExistingLiquidity() public {
        uint256 initialPool = 10 * 10 ** 6;
        _placeBet(user1, OUTCOME_YES, initialPool, 10, block.timestamp + 250);

        uint256 creatorAmount = 2 * 10 ** 6; // cap is totalPool/10 = 1e6
        usdc.mint(creator, creatorAmount);
        vm.prank(creator);
        usdc.approve(address(market), creatorAmount);
        bytes memory sig = _signBet(address(market), creator, OUTCOME_YES, creatorAmount, 11, block.timestamp + 250);

        vm.prank(creator);
        vm.expectRevert("Market: creator cap");
        market.placeBet(OUTCOME_YES, creatorAmount, 11, block.timestamp + 250, sig);
    }

    function testChallengedFinalizeRequiresOperatorAndSlashesBond() public {
        vm.warp(block.timestamp + 1 days);
        vm.prank(creator);
        market.closeMarket();

        vm.warp(block.timestamp + 1 days);
        vm.prank(oracle);
        market.proposeResolution(OUTCOME_YES, keccak256("evidence"));

        uint256 bond = registry.challengeBondAmount();
        usdc.mint(challenger, bond);
        vm.prank(challenger);
        usdc.approve(address(market), bond);

        vm.prank(challenger);
        market.challengeResolution(keccak256("reason"));

        vm.prank(oracle);
        vm.expectRevert("Market: challenged requires operator");
        market.finalizeResolution();

        vm.prank(admin);
        registry.grantRole(registry.OPERATOR_ROLE(), oracle);

        uint256 treasuryBefore = usdc.balanceOf(admin);
        vm.prank(oracle);
        market.finalizeResolution();
        uint256 treasuryAfter = usdc.balanceOf(admin);

        assertEq(treasuryAfter - treasuryBefore, bond);
        assertEq(market.challengeBond(), 0);
        assertEq(uint256(market.getCurrentState()), uint256(ArenaMarket.MarketState.FINALIZED));
    }

    function testVoidMarketRefundsChallengeBondAndUserCanRefundStake() public {
        uint256 amount = 3 * 10 ** 6;
        _placeBet(user1, OUTCOME_YES, amount, 21, block.timestamp + 250);

        vm.warp(block.timestamp + 1 days);
        vm.prank(creator);
        market.closeMarket();

        vm.warp(block.timestamp + 1 days);
        vm.prank(oracle);
        market.proposeResolution(OUTCOME_YES, keccak256("evidence"));

        uint256 bond = registry.challengeBondAmount();
        usdc.mint(challenger, bond);
        vm.prank(challenger);
        usdc.approve(address(market), bond);
        vm.prank(challenger);
        market.challengeResolution(keccak256("reason"));

        uint256 challengerBeforeVoid = usdc.balanceOf(challenger);
        vm.prank(oracle);
        market.voidMarket("oracle void");
        assertEq(usdc.balanceOf(challenger) - challengerBeforeVoid, bond);

        uint256 userBeforeRefund = usdc.balanceOf(user1);
        vm.prank(user1);
        market.refund();
        assertEq(usdc.balanceOf(user1) - userBeforeRefund, amount);
    }

    function testClaimDistributionAndLastClaimerReceivesDust() public {
        _placeBet(user1, OUTCOME_YES, 2 * 10 ** 6, 31, block.timestamp + 250);
        _placeBet(user2, OUTCOME_YES, 1 * 10 ** 6, 32, block.timestamp + 250);
        _placeBet(challenger, OUTCOME_NO, 1 * 10 ** 6, 33, block.timestamp + 250);

        vm.warp(block.timestamp + 1 days);
        vm.prank(creator);
        market.closeMarket();

        vm.warp(block.timestamp + 1 days);
        vm.prank(oracle);
        market.proposeResolution(OUTCOME_YES, keccak256("evidence"));
        vm.prank(oracle);
        market.finalizeResolution();

        uint256 distributable = market.distributablePool();
        uint256 user1Before = usdc.balanceOf(user1);
        vm.prank(user1);
        market.claim();
        uint256 user1Payout = usdc.balanceOf(user1) - user1Before;

        uint256 user2Before = usdc.balanceOf(user2);
        vm.prank(user2);
        market.claim();
        uint256 user2Payout = usdc.balanceOf(user2) - user2Before;

        assertEq(user1Payout + user2Payout, distributable);
        assertEq(market.totalClaimed(), distributable);

        vm.prank(challenger);
        vm.expectRevert("Market: no stake");
        market.claim();
    }

    function _placeBet(address bettor, bytes32 outcome, uint256 amount, uint256 nonce, uint256 deadline) internal {
        usdc.mint(bettor, amount);
        vm.prank(bettor);
        usdc.approve(address(market), amount);
        bytes memory sig = _signBet(address(market), bettor, outcome, amount, nonce, deadline);
        vm.prank(bettor);
        market.placeBet(outcome, amount, nonce, deadline, sig);
    }

    function _signBet(
        address marketAddr,
        address betUser,
        bytes32 outcome,
        uint256 amount,
        uint256 nonce,
        uint256 deadline
    ) internal view returns (bytes memory) {
        bytes32 domainSeparator = keccak256(abi.encode(
            keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
            keccak256("ArenaMarket"),
            keccak256("1"),
            block.chainid,
            marketAddr
        ));
        bytes32 structHash = keccak256(abi.encode(
            keccak256("Bet(address market,address user,bytes32 outcome,uint256 amount,uint256 nonce,uint256 deadline)"),
            marketAddr,
            betUser,
            outcome,
            amount,
            nonce,
            deadline
        ));
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", domainSeparator, structHash));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(oraclePk, digest);
        return abi.encodePacked(r, s, v);
    }
}
