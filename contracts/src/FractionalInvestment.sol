// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {TricycleNFT} from "./TricycleNFT.sol";

/// @title  FractionalInvestment
/// @notice Fractional ownership of tricycles. ONE contract serves every
///         tricycle: each pool's id == the TricycleNFT tokenId, and shares are
///         ERC-1155 tokens (tokenId == tricycleId) that investors hold.
///         Investors buy shares with USDC; yield (from rider repayments, funded
///         by the platform treasury) is distributed pro-rata via an accumulator
///         (`accYieldPerShare`) so distribution is O(1) no matter how many
///         investors hold a pool.
/// @dev    Stablecoin-agnostic: the payment/yield token is set once at
///         deployment. Shares are transferable; yield is settled on every
///         balance change so holders always keep what they earned.
contract FractionalInvestment is ERC1155, Ownable {
    using SafeERC20 for IERC20;

    uint256 private constant ACC_PRECISION = 1e12;

    struct Pool {
        uint256 pricePerShare; // USDC (6dp) per share
        uint256 totalShares; // shares available for the asset
        uint256 sharesSold; // shares bought so far
        uint256 accYieldPerShare; // cumulative yield per share, scaled by ACC_PRECISION
        bool active;
    }

    IERC20 public immutable usdc;
    TricycleNFT public immutable tricycles;

    /// @dev tricycleId => pool.
    mapping(uint256 => Pool) public pools;
    /// @dev tricycleId => investor => yield already accounted against their shares.
    mapping(uint256 => mapping(address => uint256)) public rewardDebt;
    /// @dev tricycleId => investor => settled-but-unclaimed yield (USDC).
    mapping(uint256 => mapping(address => uint256)) public claimable;

    event PoolOpened(uint256 indexed tricycleId, uint256 pricePerShare, uint256 totalShares);
    event Invested(uint256 indexed tricycleId, address indexed investor, uint256 shares, uint256 cost);
    event YieldDistributed(uint256 indexed tricycleId, uint256 amount);
    event YieldClaimed(uint256 indexed tricycleId, address indexed investor, uint256 amount);

    constructor(IERC20 usdc_, TricycleNFT tricycles_, address owner_)
        ERC1155("")
        Ownable(owner_)
    {
        usdc = usdc_;
        tricycles = tricycles_;
    }

    // ---------------------------------------------------------------------
    // Admin
    // ---------------------------------------------------------------------

    /// @notice Open a tricycle for fractional investment.
    function openPool(uint256 tricycleId, uint256 pricePerShare, uint256 totalShares)
        external
        onlyOwner
    {
        require(tricycles.exists(tricycleId), "tricycle missing");
        require(!pools[tricycleId].active, "already open");
        require(pricePerShare > 0 && totalShares > 0, "bad params");
        pools[tricycleId] =
            Pool({pricePerShare: pricePerShare, totalShares: totalShares, sharesSold: 0, accYieldPerShare: 0, active: true});
        emit PoolOpened(tricycleId, pricePerShare, totalShares);
    }

    /// @notice Distribute USDC yield to a pool's shareholders (pro-rata).
    ///         Caller must approve `amount` of USDC first.
    function distributeYield(uint256 tricycleId, uint256 amount) external onlyOwner {
        Pool storage p = pools[tricycleId];
        require(p.sharesSold > 0, "no shareholders");
        usdc.safeTransferFrom(msg.sender, address(this), amount);
        p.accYieldPerShare += (amount * ACC_PRECISION) / p.sharesSold;
        emit YieldDistributed(tricycleId, amount);
    }

    // ---------------------------------------------------------------------
    // Investor
    // ---------------------------------------------------------------------

    /// @notice Buy `shares` of a tricycle. Caller must approve USDC first.
    ///         The USDC goes to the platform treasury (owner) to fund the asset.
    function invest(uint256 tricycleId, uint256 shares) external {
        Pool storage p = pools[tricycleId];
        require(p.active, "not open");
        require(shares > 0, "zero");
        require(p.sharesSold + shares <= p.totalShares, "sold out");

        uint256 cost = shares * p.pricePerShare;
        usdc.safeTransferFrom(msg.sender, owner(), cost);
        p.sharesSold += shares;
        _mint(msg.sender, tricycleId, shares, ""); // _update settles yield accounting
        emit Invested(tricycleId, msg.sender, shares, cost);
    }

    /// @notice Claim accrued USDC yield for a pool.
    function claimYield(uint256 tricycleId) external {
        _accrue(tricycleId, msg.sender);
        _resetDebt(tricycleId, msg.sender);
        uint256 amount = claimable[tricycleId][msg.sender];
        if (amount > 0) {
            claimable[tricycleId][msg.sender] = 0;
            usdc.safeTransfer(msg.sender, amount);
            emit YieldClaimed(tricycleId, msg.sender, amount);
        }
    }

    // ---------------------------------------------------------------------
    // Views
    // ---------------------------------------------------------------------

    /// @notice Total claimable yield (settled + pending) for an investor.
    function pendingYield(uint256 tricycleId, address account) external view returns (uint256) {
        return claimable[tricycleId][account] + _pending(tricycleId, account);
    }

    // ---------------------------------------------------------------------
    // Internal yield accounting (accumulator pattern)
    // ---------------------------------------------------------------------

    function _pending(uint256 id, address account) internal view returns (uint256) {
        uint256 accrued = (balanceOf(account, id) * pools[id].accYieldPerShare) / ACC_PRECISION;
        return accrued - rewardDebt[id][account];
    }

    function _accrue(uint256 id, address account) internal {
        if (account == address(0)) return;
        claimable[id][account] += _pending(id, account);
    }

    function _resetDebt(uint256 id, address account) internal {
        if (account == address(0)) return;
        rewardDebt[id][account] = (balanceOf(account, id) * pools[id].accYieldPerShare) / ACC_PRECISION;
    }

    /// @dev Settle yield for both parties before/after every balance change so
    ///      transfers never lose or duplicate earned yield.
    function _update(address from, address to, uint256[] memory ids, uint256[] memory values)
        internal
        override
    {
        for (uint256 i = 0; i < ids.length; i++) {
            _accrue(ids[i], from);
            _accrue(ids[i], to);
        }
        super._update(from, to, ids, values);
        for (uint256 i = 0; i < ids.length; i++) {
            _resetDebt(ids[i], from);
            _resetDebt(ids[i], to);
        }
    }
}
