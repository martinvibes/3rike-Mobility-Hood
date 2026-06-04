// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC4626} from "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title  ThreeRikeVault
/// @notice ERC-4626 USDC savings vault for 3rike. Users deposit the platform
///         stablecoin (USDC) and receive shares whose value grows as yield is
///         distributed into the vault.
/// @dev    Stablecoin-agnostic: the underlying asset is fixed once at
///         deployment, so the same contract retargets to mainnet Circle USDC
///         simply by deploying with a different asset address. The vault holds
///         no special knowledge of USDC beyond it being an ERC-20.
contract ThreeRikeVault is ERC4626, Ownable {
    using SafeERC20 for IERC20;

    /// @param from   The treasury account that funded the distribution.
    /// @param amount Amount of the underlying asset added to the vault.
    event YieldDistributed(address indexed from, uint256 amount);

    /// @param asset_ The underlying stablecoin (USDC) this vault accepts.
    /// @param owner_ The platform treasury/admin allowed to distribute yield.
    constructor(IERC20 asset_, address owner_)
        ERC20("3rike Yield USDC", "3yUSDC")
        ERC4626(asset_)
        Ownable(owner_)
    {}

    /// @notice Distribute yield into the vault, raising the value of every
    ///         outstanding share. Pulls `amount` of the underlying asset from
    ///         the caller, so the caller must `approve` the vault first. Funded
    ///         by the platform treasury with real on-chain USDC.
    /// @param amount Amount of the underlying asset to add as yield.
    function distributeYield(uint256 amount) external onlyOwner {
        IERC20(asset()).safeTransferFrom(msg.sender, address(this), amount);
        emit YieldDistributed(msg.sender, amount);
    }
}
