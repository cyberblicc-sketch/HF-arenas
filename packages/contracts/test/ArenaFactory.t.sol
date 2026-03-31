// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Test} from "forge-std/Test.sol";
import {ArenaFactory} from "../src/ArenaFactory.sol";
import {ArenaRegistry} from "../src/ArenaRegistry.sol";
import {ArenaMarket} from "../src/ArenaMarket.sol";
import {MockUSDC} from "./ArenaMarketEIP712.t.sol";

contract ArenaFactoryTest is Test {
    ArenaRegistry internal registry;
    ArenaFactory internal factory;
    ArenaMarket internal implementation;
    MockUSDC internal usdc;

    address internal admin = address(0xA11CE);
    address internal creator = address(0xC0FFEE);

    bytes32 internal constant OUTCOME_YES = keccak256("YES");
    bytes32 internal constant OUTCOME_NO = keccak256("NO");

    function setUp() public {
        usdc = new MockUSDC();

        vm.startPrank(admin);
        registry = new ArenaRegistry(address(usdc), admin);

        // Grant OPERATOR_ROLE to factory (added later) — pre-approve creator
        registry.setCreatorStatus(creator, true);

        implementation = new ArenaMarket();

        factory = new ArenaFactory(address(registry), address(implementation));

        // Factory needs OPERATOR_ROLE to call registerMarket
        registry.grantRole(registry.OPERATOR_ROLE(), address(factory));

        // Grant ORACLE_ROLE to admin so approveMarket works
        registry.grantRole(registry.ORACLE_ROLE(), admin);

        vm.stopPrank();
    }

    // ── Constructor ──────────────────────────────────────────────────────────

    function testConstructorSetsRegistry() public view {
        assertEq(address(factory.registry()), address(registry));
    }

    function testConstructorDeploysBeacon() public view {
        assertTrue(address(factory.beacon()) != address(0));
    }

    function testConstructorGrantsAdminRole() public view {
        assertTrue(factory.hasRole(factory.DEFAULT_ADMIN_ROLE(), admin));
    }

    // ── createMarket ─────────────────────────────────────────────────────────

    function _defaultParams() internal view returns (ArenaMarket.MarketParams memory) {
        return ArenaMarket.MarketParams({
            marketId: "test-market-1",
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

    function testCreateMarketDeploysProxy() public {
        vm.prank(creator);
        address proxy = factory.createMarket(_defaultParams(), _defaultOutcomes(), address(0), 0);
        assertTrue(proxy != address(0));
    }

    function testCreateMarketRegistersInRegistry() public {
        vm.prank(creator);
        address proxy = factory.createMarket(_defaultParams(), _defaultOutcomes(), address(0), 0);
        assertTrue(registry.isMarket(proxy));
    }

    function testCreateMarketEmitsEvent() public {
        vm.prank(creator);
        vm.expectEmit(false, true, true, false);
        emit ArenaFactory.MarketCreated(address(0), "test-market-1", creator, address(0));
        factory.createMarket(_defaultParams(), _defaultOutcomes(), address(0), 0);
    }

    function testCreateMarketSetsMarketById() public {
        vm.prank(creator);
        address proxy = factory.createMarket(_defaultParams(), _defaultOutcomes(), address(0), 0);
        assertEq(registry.marketById("test-market-1"), proxy);
    }

    function testCreateMarketRevertsForUnauthorizedCreator() public {
        address stranger = address(0xDEAD);
        vm.prank(stranger);
        vm.expectRevert("Factory: bond");
        factory.createMarket(_defaultParams(), _defaultOutcomes(), address(0), 0);
    }

    function testCreateMarketWithReferrer() public {
        address referrer = address(0xFEED);
        vm.prank(creator);
        address proxy = factory.createMarket(_defaultParams(), _defaultOutcomes(), referrer, 0);
        ArenaMarket market = ArenaMarket(proxy);
        assertEq(market.referrer(), referrer);
    }

    // ── upgradeBeacon ─────────────────────────────────────────────────────────

    function testUpgradeBeaconSucceedsForAdmin() public {
        ArenaMarket newImpl = new ArenaMarket();
        vm.prank(admin);
        factory.upgradeBeacon(address(newImpl));
        assertEq(factory.beacon().implementation(), address(newImpl));
    }

    function testUpgradeBeaconRevertsForNonAdmin() public {
        ArenaMarket newImpl = new ArenaMarket();
        vm.prank(creator);
        vm.expectRevert();
        factory.upgradeBeacon(address(newImpl));
    }
}
