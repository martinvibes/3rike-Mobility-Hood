// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {TricycleNFT} from "../src/TricycleNFT.sol";
import {FractionalInvestment} from "../src/FractionalInvestment.sol";

contract TestUSDC is ERC20 {
    constructor() ERC20("Test USDC", "USDC") {}
    function decimals() public pure override returns (uint8) {
        return 6;
    }
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract InvestmentTest is Test {
    TestUSDC usdc;
    TricycleNFT nft;
    FractionalInvestment inv;

    address platform; // owner (receives investment USDC, funds yield)
    address alice;
    address bob;

    uint256 constant ONE = 1e6; // 1 USDC
    uint256 constant PRICE = 10 * ONE; // 10 USDC per share
    uint256 tid; // tricycle id

    function setUp() public {
        platform = makeAddr("platform");
        alice = makeAddr("alice");
        bob = makeAddr("bob");

        usdc = new TestUSDC();
        nft = new TricycleNFT(platform);
        inv = new FractionalInvestment(IERC20(address(usdc)), nft, platform);

        // platform mints a tricycle + opens a 100-share pool
        vm.startPrank(platform);
        tid = nft.mintTricycle(platform, TricycleNFT.Meta("EV-001", "Bajaj", "RE", true, 3000, 120));
        inv.openPool(tid, PRICE, 100);
        vm.stopPrank();

        usdc.mint(alice, 1_000 * ONE);
        usdc.mint(bob, 1_000 * ONE);
        usdc.mint(platform, 1_000 * ONE);
    }

    function _invest(address who, uint256 shares) internal {
        vm.startPrank(who);
        usdc.approve(address(inv), shares * PRICE);
        inv.invest(tid, shares);
        vm.stopPrank();
    }

    function _distribute(uint256 amount) internal {
        vm.startPrank(platform);
        usdc.approve(address(inv), amount);
        inv.distributeYield(tid, amount);
        vm.stopPrank();
    }

    function test_InvestMintsSharesAndTakesUsdc() public {
        _invest(alice, 60);
        assertEq(inv.balanceOf(alice, tid), 60);
        assertEq(usdc.balanceOf(alice), 1_000 * ONE - 60 * PRICE);
        // investment USDC goes to the platform (owner)
        assertEq(usdc.balanceOf(platform), 1_000 * ONE + 60 * PRICE);
        (, , uint256 sold, , bool active) = inv.pools(tid);
        assertEq(sold, 60);
        assertTrue(active);
    }

    function test_SoldOutReverts() public {
        _invest(alice, 100);
        vm.startPrank(bob);
        usdc.approve(address(inv), PRICE);
        vm.expectRevert(bytes("sold out"));
        inv.invest(tid, 1);
        vm.stopPrank();
    }

    function test_YieldDistributesProRata() public {
        _invest(alice, 60);
        _invest(bob, 40);
        _distribute(100 * ONE); // 100 USDC across 100 shares

        assertEq(inv.pendingYield(tid, alice), 60 * ONE);
        assertEq(inv.pendingYield(tid, bob), 40 * ONE);
    }

    function test_ClaimYieldPaysOut() public {
        _invest(alice, 60);
        _invest(bob, 40);
        _distribute(100 * ONE);

        uint256 before = usdc.balanceOf(alice);
        vm.prank(alice);
        inv.claimYield(tid);
        assertEq(usdc.balanceOf(alice), before + 60 * ONE);
        assertEq(inv.pendingYield(tid, alice), 0);
    }

    function test_TransferCarriesFutureYieldNotPast() public {
        _invest(alice, 100);
        _distribute(100 * ONE); // alice earns 100

        // alice sends half her shares to bob
        vm.prank(alice);
        inv.safeTransferFrom(alice, bob, tid, 50, "");

        // past yield stayed with alice; bob starts fresh
        assertEq(inv.pendingYield(tid, alice), 100 * ONE);
        assertEq(inv.pendingYield(tid, bob), 0);

        _distribute(100 * ONE); // now 50/50 -> +50 each
        assertEq(inv.pendingYield(tid, alice), 150 * ONE);
        assertEq(inv.pendingYield(tid, bob), 50 * ONE);
    }
}
