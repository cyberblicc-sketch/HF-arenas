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
    uint256 internal oraclePk = 0xA0B0C0;
    address internal oracle;
    address internal creator = address(0xC0DE);
    address internal referrer = address(0xFEED);
    address internal user1 = address(0xBEEF);
    address internal user2 = address(0xCAFE);
    address internal challenger = address(0xDADA);

    bytes32 internal constant OUTCOME_YES = keccak256("YES");
    bytes32 internal constant OUTCOME_NO = keccak256("NO");

    function setUp() public {
        oracle = vm.addr(oraclePk);
        usdc = new MockUSDC();

        vm.startPrank(admin);
        registry = new ArenaRegistry(address(usdc), admin);
        registry.grantRole(registry.ORACLE_ROLE(), oracle);
        registry.grantRole(registry.OPERATOR_ROLE(), admin);
        ArenaMarket implementation = new ArenaMarket();
        beacon = new UpgradeableBeacon(address(implementation), address(this));
        vm.stopPrank();
    }

    function _defaultParams(string memory marketId) internal view returns (ArenaMarket.MarketParams memory) {
        return ArenaMarket.MarketParams({
            marketId: marketId,
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
    }

    function _defaultOutcomes() internal pure returns (bytes32[] memory outcomes) {
        outcomes = new bytes32[](2);
        outcomes[0] = OUTCOME_YES;
        outcomes[1] = OUTCOME_NO;
    }

    function _deployAndApproveMarket(string memory marketId) internal returns (ArenaMarket deployed) {
        BeaconProxy proxy = new BeaconProxy(
            address(beacon),
            abi.encodeWithSelector(
                ArenaMarket.initialize.selector, address(registry), _defaultParams(marketId), _defaultOutcomes(), creator, referrer
            )
        );
        deployed = ArenaMarket(address(proxy));
        vm.prank(oracle);
        deployed.approveMarket();
    }

    function _signBet(
        address marketAddr,
        address betUser,
        bytes32 outcome,
        uint256 amount,
        uint256 nonce,
        uint256 deadline
    ) internal view returns (bytes memory) {
        bytes32 domainSeparator = keccak256(
            abi.encode(
                keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                keccak256("ArenaMarket"),
                keccak256("1"),
                block.chainid,
                marketAddr
            )
        );
        bytes32 structHash = keccak256(
            abi.encode(
                keccak256("Bet(address market,address user,bytes32 outcome,uint256 amount,uint256 nonce,uint256 deadline)"),
                marketAddr,
                betUser,
                outcome,
                amount,
                nonce,
                deadline
            )
        );
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", domainSeparator, structHash));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(oraclePk, digest);
        return abi.encodePacked(r, s, v);
    }

    function _fundAndApprove(address user, uint256 amount, address spender) internal {
        usdc.mint(user, amount);
        vm.prank(user);
        usdc.approve(spender, amount);
    }

    function _placeBet(ArenaMarket m, address user, bytes32 outcome, uint256 amount, uint256 nonce) internal {
        _fundAndApprove(user, amount, address(m));
        uint256 deadline = block.timestamp + 60;
        bytes memory sig = _signBet(address(m), user, outcome, amount, nonce, deadline);
        vm.prank(user);
        m.placeBet(outcome, amount, nonce, deadline, sig);
    }

    function testInitializeRevertsOnBadParams() public {
        ArenaMarket implementation = new ArenaMarket();
        bytes32[] memory outcomes = _defaultOutcomes();

        ArenaMarket.MarketParams memory badOpenClose = _defaultParams("bad-open-close");
        badOpenClose.closeTime = badOpenClose.openTime;
        vm.expectRevert("Market: bad open/close");
        new BeaconProxy(
            address(beacon),
            abi.encodeWithSelector(
                implementation.initialize.selector, address(registry), badOpenClose, outcomes, creator, referrer
            )
        );

        ArenaMarket.MarketParams memory badCloseResolve = _defaultParams("bad-close-resolve");
        badCloseResolve.resolveTime = badCloseResolve.closeTime - 1;
        vm.expectRevert("Market: bad close/resolve");
        new BeaconProxy(
            address(beacon),
            abi.encodeWithSelector(
                implementation.initialize.selector, address(registry), badCloseResolve, outcomes, creator, referrer
            )
        );
    }

    function testInitializeRevertsOnInvalidOutcomes() public {
        ArenaMarket implementation = new ArenaMarket();
        bytes32[] memory oneOutcome = new bytes32[](1);
        oneOutcome[0] = OUTCOME_YES;

        vm.expectRevert("Market: outcomes");
        new BeaconProxy(
            address(beacon),
            abi.encodeWithSelector(
                implementation.initialize.selector, address(registry), _defaultParams("one-outcome"), oneOutcome, creator, referrer
            )
        );

        bytes32[] memory outcomes = _defaultOutcomes();
        outcomes[1] = bytes32(0);
        vm.expectRevert("Market: zero outcome");
        new BeaconProxy(
            address(beacon),
            abi.encodeWithSelector(
                implementation.initialize.selector, address(registry), _defaultParams("zero-outcome"), outcomes, creator, referrer
            )
        );
    }

    function testApproveMarketRevertsForNonOracle() public {
        BeaconProxy proxy = new BeaconProxy(
            address(beacon),
            abi.encodeWithSelector(
                ArenaMarket.initialize.selector, address(registry), _defaultParams("approve-auth"), _defaultOutcomes(), creator, referrer
            )
        );
        ArenaMarket pending = ArenaMarket(address(proxy));
        vm.prank(user1);
        vm.expectRevert("Market: not oracle");
        pending.approveMarket();
    }

    function testPlaceBetRevertsWhenRegistryPaused() public {
        market = _deployAndApproveMarket("registry-paused");
        vm.prank(admin);
        registry.pause();
        uint256 amount = registry.minBet();
        _fundAndApprove(user1, amount, address(market));
        uint256 deadline = block.timestamp + 60;
        bytes memory sig = _signBet(address(market), user1, OUTCOME_YES, amount, 1, deadline);
        vm.prank(user1);
        vm.expectRevert("Market: registry paused");
        market.placeBet(OUTCOME_YES, amount, 1, deadline, sig);
    }

    function testPlaceBetRevertsForInvalidOutcome() public {
        market = _deployAndApproveMarket("invalid-outcome");
        uint256 amount = registry.minBet();
        _fundAndApprove(user1, amount, address(market));
        uint256 deadline = block.timestamp + 60;
        bytes32 invalidOutcome = keccak256("MAYBE");
        bytes memory sig = _signBet(address(market), user1, invalidOutcome, amount, 1, deadline);
        vm.prank(user1);
        vm.expectRevert("Market: invalid outcome");
        market.placeBet(invalidOutcome, amount, 1, deadline, sig);
    }

    function testPlaceBetRevertsForOutOfRangeAmount() public {
        market = _deployAndApproveMarket("amount-range");
        uint256 amount = registry.minBet() - 1;
        _fundAndApprove(user1, registry.minBet(), address(market));
        uint256 deadline = block.timestamp + 60;
        bytes memory sig = _signBet(address(market), user1, OUTCOME_YES, amount, 1, deadline);
        vm.prank(user1);
        vm.expectRevert("Market: amount out of range");
        market.placeBet(OUTCOME_YES, amount, 1, deadline, sig);
    }

    function testPlaceBetRevertsForSanctionedUser() public {
        market = _deployAndApproveMarket("sanctioned");
        vm.prank(admin);
        registry.setSanctionStatus(user1, true);
        uint256 amount = registry.minBet();
        _fundAndApprove(user1, amount, address(market));
        uint256 deadline = block.timestamp + 60;
        bytes memory sig = _signBet(address(market), user1, OUTCOME_YES, amount, 1, deadline);
        vm.prank(user1);
        vm.expectRevert("Market: sanctioned");
        market.placeBet(OUTCOME_YES, amount, 1, deadline, sig);
    }

    function testPlaceBetRevertsWhenDeadlineTooFar() public {
        market = _deployAndApproveMarket("deadline-too-far");
        uint256 amount = registry.minBet();
        _fundAndApprove(user1, amount, address(market));
        uint256 deadline = block.timestamp + 301;
        bytes memory sig = _signBet(address(market), user1, OUTCOME_YES, amount, 1, deadline);
        vm.prank(user1);
        vm.expectRevert("Market: deadline too far");
        market.placeBet(OUTCOME_YES, amount, 1, deadline, sig);
    }

    function testPlaceBetRevertsForInvalidOracleSignature() public {
        market = _deployAndApproveMarket("invalid-sig");
        uint256 amount = registry.minBet();
        _fundAndApprove(user1, amount, address(market));
        uint256 deadline = block.timestamp + 60;
        bytes memory sig = _signBet(address(market), user1, OUTCOME_YES, amount, 1, deadline);
        sig[64] = bytes1(uint8(sig[64]) ^ 0x01);
        vm.prank(user1);
        vm.expectRevert("Market: invalid sig");
        market.placeBet(OUTCOME_YES, amount, 1, deadline, sig);
    }

    function testCreatorCapEnforcedAfterInitialPool() public {
        market = _deployAndApproveMarket("creator-cap");
        uint256 amount = 10 * 10 ** 6;
        _placeBet(market, user1, OUTCOME_NO, amount, 1); // totalPool=10m
        _placeBet(market, creator, OUTCOME_YES, 1 * 10 ** 6, 1); // allowed (10%)

        _fundAndApprove(creator, 1, address(market));
        uint256 deadline = block.timestamp + 60;
        bytes memory sig = _signBet(address(market), creator, OUTCOME_YES, 1, 2, deadline);
        vm.prank(creator);
        vm.expectRevert("Market: creator cap");
        market.placeBet(OUTCOME_YES, 1, 2, deadline, sig);
    }

    function testCloseMarketAuthAndTiming() public {
        market = _deployAndApproveMarket("close-auth");
        vm.prank(user1);
        vm.expectRevert("Market: auth");
        market.closeMarket();

        vm.prank(creator);
        vm.expectRevert("Market: early");
        market.closeMarket();

        vm.prank(admin); // operator can close early
        market.closeMarket();
        assertEq(uint256(market.getCurrentState()), uint256(ArenaMarket.MarketState.CLOSED));
    }

    function testProposeResolutionRevertsForInvalidOutcomeAndEarly() public {
        market = _deployAndApproveMarket("propose");
        vm.prank(admin);
        market.closeMarket();

        vm.warp(block.timestamp + 2 days - 1);
        vm.prank(oracle);
        vm.expectRevert("Market: early");
        market.proposeResolution(OUTCOME_YES, keccak256("evidence"));

        vm.warp(block.timestamp + 1);
        vm.prank(oracle);
        vm.expectRevert("Market: invalid outcome");
        market.proposeResolution(keccak256("MAYBE"), keccak256("evidence"));
    }

    function testFinalizeRevertsWhenNotReady() public {
        market = _deployAndApproveMarket("finalize-not-ready");
        vm.prank(oracle);
        vm.expectRevert("Market: not ready");
        market.finalizeResolution();
    }

    function testFinalizeFromProposedDistributesFeesAndClaims() public {
        market = _deployAndApproveMarket("finalize-proposed");

        uint256 amount = 100 * 10 ** 6;
        _placeBet(market, user1, OUTCOME_YES, amount, 1);
        _placeBet(market, user2, OUTCOME_NO, amount, 1);

        vm.prank(admin);
        market.closeMarket();
        vm.warp(block.timestamp + 2 days);
        vm.prank(oracle);
        market.proposeResolution(OUTCOME_YES, keccak256("evidence"));

        uint256 treasuryBefore = usdc.balanceOf(admin);
        uint256 creatorBefore = usdc.balanceOf(creator);
        uint256 referrerBefore = usdc.balanceOf(referrer);

        vm.prank(oracle);
        market.finalizeResolution();

        assertTrue(market.feesCollected());
        assertEq(uint256(market.getCurrentState()), uint256(ArenaMarket.MarketState.FINALIZED));
        assertEq(usdc.balanceOf(admin) - treasuryBefore, 7 * 10 ** 6); // protocol+reserve
        assertEq(usdc.balanceOf(creator) - creatorBefore, 2 * 10 ** 6); // creator fee
        assertEq(usdc.balanceOf(referrer) - referrerBefore, 1 * 10 ** 6); // referral fee

        uint256 user1Before = usdc.balanceOf(user1);
        vm.prank(user1);
        market.claim();
        assertEq(usdc.balanceOf(user1) - user1Before, 190 * 10 ** 6); // distributable pool

        vm.prank(user1);
        vm.expectRevert("Market: claimed");
        market.claim();

        vm.prank(user2);
        vm.expectRevert("Market: no stake");
        market.claim();
    }

    function testVoidMarketBeforeFinalizeEnablesRefund() public {
        market = _deployAndApproveMarket("void-before-finalize");
        uint256 amount = 50 * 10 ** 6;
        _placeBet(market, user1, OUTCOME_YES, amount, 1);
        _placeBet(market, user2, OUTCOME_NO, amount, 1);

        vm.prank(admin);
        market.closeMarket();

        vm.prank(oracle);
        market.voidMarket("bad data");
        assertEq(uint256(market.getCurrentState()), uint256(ArenaMarket.MarketState.VOIDED));

        uint256 before = usdc.balanceOf(user1);
        vm.prank(user1);
        market.refund();
        assertEq(usdc.balanceOf(user1) - before, amount);

        vm.prank(user1);
        vm.expectRevert("Market: no stake");
        market.refund();
    }

    function testVoidMarketRefundsChallengeBondAndPreventsFinalize() public {
        market = _deployAndApproveMarket("void-with-challenge");
        uint256 amount = 20 * 10 ** 6;
        _placeBet(market, user1, OUTCOME_YES, amount, 1);
        _placeBet(market, user2, OUTCOME_NO, amount, 1);

        vm.prank(admin);
        market.closeMarket();
        vm.warp(block.timestamp + 2 days);
        vm.prank(oracle);
        market.proposeResolution(OUTCOME_YES, keccak256("evidence"));

        uint256 bond = registry.challengeBondAmount();
        _fundAndApprove(challenger, bond, address(market));
        uint256 challengerBefore = usdc.balanceOf(challenger);
        vm.prank(challenger);
        market.challengeResolution(bytes32("wrong data"));

        vm.prank(oracle);
        market.voidMarket("challenged");
        assertEq(usdc.balanceOf(challenger) - challengerBefore, bond);

        vm.prank(oracle);
        vm.expectRevert("Market: not ready");
        market.finalizeResolution();
    }

    function testFinalizeFromChallengedRequiresOperatorAndSlashesBond() public {
        market = _deployAndApproveMarket("finalize-challenged");
        uint256 amount = 25 * 10 ** 6;
        _placeBet(market, user1, OUTCOME_YES, amount, 1);
        _placeBet(market, user2, OUTCOME_NO, amount, 1);

        vm.prank(admin);
        market.closeMarket();
        vm.warp(block.timestamp + 2 days);
        vm.prank(oracle);
        market.proposeResolution(OUTCOME_YES, keccak256("evidence"));

        uint256 bond = registry.challengeBondAmount();
        _fundAndApprove(challenger, bond, address(market));
        vm.prank(challenger);
        market.challengeResolution(bytes32("reason"));

        vm.prank(oracle);
        vm.expectRevert("Market: challenged requires operator");
        market.finalizeResolution();

        vm.prank(admin);
        registry.grantRole(registry.OPERATOR_ROLE(), oracle);
        vm.prank(oracle);
        market.finalizeResolution();
        assertEq(market.challengeBond(), 0);
        assertEq(uint256(market.getCurrentState()), uint256(ArenaMarket.MarketState.FINALIZED));
    }

    function testChallengeResolutionRevertsForCreatorAndAfterWindow() public {
        market = _deployAndApproveMarket("challenge-reverts");
        uint256 amount = 20 * 10 ** 6;
        _placeBet(market, user1, OUTCOME_YES, amount, 1);
        _placeBet(market, user2, OUTCOME_NO, amount, 1);

        vm.prank(admin);
        market.closeMarket();
        vm.warp(block.timestamp + 2 days);
        vm.prank(oracle);
        market.proposeResolution(OUTCOME_YES, keccak256("evidence"));

        _fundAndApprove(creator, registry.challengeBondAmount(), address(market));
        vm.prank(creator);
        vm.expectRevert("Market: creator cannot challenge");
        market.challengeResolution(bytes32("self"));

        vm.warp(block.timestamp + 1 days + 1);
        _fundAndApprove(challenger, registry.challengeBondAmount(), address(market));
        vm.prank(challenger);
        vm.expectRevert("Market: challenge window closed");
        market.challengeResolution(bytes32("late"));
    }
}
