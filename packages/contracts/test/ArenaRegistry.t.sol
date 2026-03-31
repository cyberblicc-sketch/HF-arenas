// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Test} from "forge-std/Test.sol";
import {ArenaRegistry} from "../src/ArenaRegistry.sol";
import {MockUSDC} from "./ArenaMarketEIP712.t.sol";

contract ArenaRegistryTest is Test {
    ArenaRegistry internal registry;
    MockUSDC internal usdc;

    address internal admin = address(0xA11CE);
    address internal operator = address(0x0123);
    address internal creator = address(0xC0FFEE);
    address internal user = address(0xBEEF);

    function setUp() public {
        usdc = new MockUSDC();
        vm.startPrank(admin);
        registry = new ArenaRegistry(address(usdc), admin);
        registry.grantRole(registry.OPERATOR_ROLE(), operator);
        vm.stopPrank();
    }

    // ── Constructor ──────────────────────────────────────────────────────────

    function testConstructorSetsCollateral() public view {
        assertEq(address(registry.collateral()), address(usdc));
    }

    function testConstructorSetsTreasury() public view {
        assertEq(registry.treasury(), admin);
    }

    function testConstructorGrantsAdminRole() public view {
        assertTrue(registry.hasRole(registry.DEFAULT_ADMIN_ROLE(), admin));
    }

    function testConstructorGrantsOperatorRole() public view {
        assertTrue(registry.hasRole(registry.OPERATOR_ROLE(), admin));
    }

    function testConstructorRejectsZeroCollateral() public {
        vm.expectRevert("Registry: zero collateral");
        new ArenaRegistry(address(0), admin);
    }

    // ── Fees ─────────────────────────────────────────────────────────────────

    function testDefaultFeesAddUpToFivePercent() public view {
        assertEq(registry.totalFeeBps(), 500);
    }

    function testSetFeesUpdatesValues() public {
        vm.prank(admin);
        registry.setFees(300, 50, 25, 125);
        assertEq(registry.protocolFeeBps(), 300);
        assertEq(registry.creatorFeeBps(), 50);
        assertEq(registry.referralFeeBps(), 25);
        assertEq(registry.disputeReserveBps(), 125);
        assertEq(registry.totalFeeBps(), 500);
    }

    function testSetFeesEmitsEvent() public {
        vm.prank(admin);
        vm.expectEmit(false, false, false, true);
        emit ArenaRegistry.FeesUpdated(100, 50, 25, 75);
        registry.setFees(100, 50, 25, 75);
    }

    function testSetFeesRevertsIfExceedsMax() public {
        vm.prank(admin);
        vm.expectRevert("Registry: max fee");
        registry.setFees(3000, 1000, 500, 501); // 5001 bps
    }

    function testSetFeesRevertsForNonAdmin() public {
        vm.prank(user);
        vm.expectRevert();
        registry.setFees(100, 50, 25, 75);
    }

    // ── Treasury ─────────────────────────────────────────────────────────────

    function testSetTreasuryUpdatesAddress() public {
        vm.prank(admin);
        registry.setTreasury(user);
        assertEq(registry.treasury(), user);
    }

    function testSetTreasuryEmitsEvent() public {
        vm.prank(admin);
        vm.expectEmit(false, false, false, true);
        emit ArenaRegistry.TreasuryUpdated(user);
        registry.setTreasury(user);
    }

    function testSetTreasuryRevertsOnZeroAddress() public {
        vm.prank(admin);
        vm.expectRevert("Registry: zero treasury");
        registry.setTreasury(address(0));
    }

    // ── Beacon / OracleModule ─────────────────────────────────────────────────

    function testSetBeaconUpdatesAddress() public {
        vm.prank(admin);
        registry.setBeacon(user);
        assertEq(registry.beacon(), user);
    }

    function testSetBeaconRevertsOnZeroAddress() public {
        vm.prank(admin);
        vm.expectRevert("Registry: zero beacon");
        registry.setBeacon(address(0));
    }

    function testSetOracleModuleUpdatesAddress() public {
        vm.prank(admin);
        registry.setOracleModule(user);
        assertEq(registry.oracleModule(), user);
    }

    // ── Market Registration ───────────────────────────────────────────────────

    function testRegisterMarketSetsIsMarket() public {
        vm.prank(operator);
        registry.registerMarket(address(0xDEAD), "market-1");
        assertTrue(registry.isMarket(address(0xDEAD)));
    }

    function testRegisterMarketSetsMarketById() public {
        vm.prank(operator);
        registry.registerMarket(address(0xDEAD), "market-1");
        assertEq(registry.marketById("market-1"), address(0xDEAD));
    }

    function testRegisterMarketEmitsEvent() public {
        vm.prank(operator);
        vm.expectEmit(true, true, false, false);
        emit ArenaRegistry.MarketRegistered(address(0xDEAD), "market-1");
        registry.registerMarket(address(0xDEAD), "market-1");
    }

    function testRegisterMarketRevertsIfAlreadyExists() public {
        vm.startPrank(operator);
        registry.registerMarket(address(0xDEAD), "market-1");
        vm.expectRevert("Registry: exists");
        registry.registerMarket(address(0xDEAD), "market-1");
        vm.stopPrank();
    }

    function testRegisterMarketRevertsForNonOperator() public {
        vm.prank(user);
        vm.expectRevert();
        registry.registerMarket(address(0xDEAD), "market-1");
    }

    // ── Creator Status ────────────────────────────────────────────────────────

    function testSetCreatorStatusToTrue() public {
        vm.prank(operator);
        registry.setCreatorStatus(creator, true);
        assertTrue(registry.isCreator(creator));
    }

    function testSetCreatorStatusToFalse() public {
        vm.startPrank(operator);
        registry.setCreatorStatus(creator, true);
        registry.setCreatorStatus(creator, false);
        vm.stopPrank();
        assertFalse(registry.isCreator(creator));
    }

    // ── Sanction ──────────────────────────────────────────────────────────────

    function testSetSanctionStatusAndCheck() public {
        vm.prank(operator);
        registry.setSanctionStatus(user, true);
        assertTrue(registry.checkSanction(user));
    }

    function testUnsanctionedAddressReturnsFalse() public view {
        assertFalse(registry.checkSanction(user));
    }

    // ── Pause / Unpause ───────────────────────────────────────────────────────

    function testPauseAndUnpause() public {
        vm.startPrank(admin);
        registry.pause();
        assertTrue(registry.paused());
        registry.unpause();
        assertFalse(registry.paused());
        vm.stopPrank();
    }

    function testPauseRevertsForNonAdmin() public {
        vm.prank(user);
        vm.expectRevert();
        registry.pause();
    }
}
