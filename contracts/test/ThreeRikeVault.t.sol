// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ThreeRikeVault} from "../src/ThreeRikeVault.sol";

/// @dev Test-only 6-decimal stablecoin standing in for USDC.
contract TestUSDC is ERC20 {
    constructor() ERC20("Test USDC", "USDC") {}

    function decimals() public pure override returns (uint8) {
        return 6;
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract ThreeRikeVaultTest is Test {
    TestUSDC usdc;
    ThreeRikeVault vault;

    address treasury;
    address alice;
    address bob;

    uint256 constant ONE = 1e6; // 1 USDC (6 decimals)

    function setUp() public {
        treasury = makeAddr("treasury");
        alice = makeAddr("alice");
        bob = makeAddr("bob");

        usdc = new TestUSDC();
        vault = new ThreeRikeVault(IERC20(address(usdc)), treasury);

        usdc.mint(alice, 1_000 * ONE);
        usdc.mint(bob, 1_000 * ONE);
        usdc.mint(treasury, 1_000 * ONE);
    }

    function _deposit(address who, uint256 amount) internal returns (uint256 shares) {
        vm.startPrank(who);
        usdc.approve(address(vault), amount);
        shares = vault.deposit(amount, who);
        vm.stopPrank();
    }

    function test_AssetAndMetadata() public view {
        assertEq(vault.asset(), address(usdc));
        assertEq(vault.decimals(), 6);
        assertEq(vault.symbol(), "3yUSDC");
        assertEq(vault.owner(), treasury);
    }

    function test_DepositMintsShares() public {
        uint256 shares = _deposit(alice, 100 * ONE);
        assertEq(shares, 100 * ONE, "1:1 shares on first deposit");
        assertEq(vault.balanceOf(alice), 100 * ONE);
        assertEq(vault.totalAssets(), 100 * ONE);
        assertEq(usdc.balanceOf(alice), 900 * ONE);
    }

    function test_WithdrawReturnsAssets() public {
        _deposit(alice, 100 * ONE);
        vm.prank(alice);
        vault.withdraw(40 * ONE, alice, alice);
        assertEq(usdc.balanceOf(alice), 940 * ONE);
        assertEq(vault.maxWithdraw(alice), 60 * ONE);
    }

    function test_YieldDistributionRaisesShareValue() public {
        _deposit(alice, 100 * ONE); // alice holds 100 shares

        // Treasury distributes 20 USDC of yield into the vault.
        vm.startPrank(treasury);
        usdc.approve(address(vault), 20 * ONE);
        vault.distributeYield(20 * ONE);
        vm.stopPrank();

        // Alice's shares are now worth 120 USDC (she's the only depositor).
        assertEq(vault.totalAssets(), 120 * ONE);
        assertApproxEqAbs(vault.maxWithdraw(alice), 120 * ONE, 1);
    }

    function test_YieldSharedProRataBetweenDepositors() public {
        _deposit(alice, 100 * ONE);
        _deposit(bob, 100 * ONE);

        vm.startPrank(treasury);
        usdc.approve(address(vault), 100 * ONE);
        vault.distributeYield(100 * ONE); // +50% to each
        vm.stopPrank();

        assertApproxEqAbs(vault.maxWithdraw(alice), 150 * ONE, 1);
        assertApproxEqAbs(vault.maxWithdraw(bob), 150 * ONE, 1);
    }

    function test_OnlyOwnerCanDistribute() public {
        vm.startPrank(alice);
        usdc.approve(address(vault), 10 * ONE);
        vm.expectRevert();
        vault.distributeYield(10 * ONE);
        vm.stopPrank();
    }

    function test_RedeemBurnsSharesForAssets() public {
        uint256 shares = _deposit(alice, 100 * ONE);
        vm.prank(alice);
        uint256 assets = vault.redeem(shares, alice, alice);
        assertApproxEqAbs(assets, 100 * ONE, 1);
        assertEq(vault.balanceOf(alice), 0);
    }
}
