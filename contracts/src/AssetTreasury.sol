// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title AssetTreasury
 * @notice Manages funds for a specific Real-World Asset
 * @dev Handles income collection, expense payments, and fund allocation
 */
contract AssetTreasury is AccessControl, ReentrancyGuard {
    bytes32 public constant AGENT_ROLE = keccak256("AGENT_ROLE");
    bytes32 public constant OWNER_ROLE = keccak256("OWNER_ROLE");

    // Transaction Types
    enum TransactionType {
        Income,         // Rent, lease payments, revenue
        Expense,        // Bills, maintenance, taxes
        Dividend,       // Distribution to token holders
        Deposit,        // External deposit
        Withdrawal      // External withdrawal
    }

    // Transaction Structure
    struct Transaction {
        uint256 id;
        TransactionType txType;
        uint256 amount;
        address from;
        address to;
        string description;
        uint256 timestamp;
        bytes32 referenceId;    // External reference (e.g., invoice ID)
    }

    // State Variables
    uint256 public assetId;
    uint256 private _nextTxId;
    uint256 public totalIncome;
    uint256 public totalExpenses;
    uint256 public totalDividends;
    uint256 public currentBalance;

    mapping(uint256 => Transaction) public transactions;
    mapping(bytes32 => bool) public processedReferences;

    // Events
    event IncomeReceived(
        uint256 indexed txId,
        address indexed from,
        uint256 amount,
        string description,
        bytes32 referenceId
    );

    event ExpensePaid(
        uint256 indexed txId,
        address indexed to,
        uint256 amount,
        string description,
        bytes32 referenceId
    );

    event DividendDistributed(
        uint256 indexed txId,
        uint256 totalAmount,
        uint256 recipientCount
    );

    event FundsDeposited(
        uint256 indexed txId,
        address indexed from,
        uint256 amount
    );

    event FundsWithdrawn(
        uint256 indexed txId,
        address indexed to,
        uint256 amount
    );

    constructor(uint256 _assetId, address owner) {
        assetId = _assetId;
        _nextTxId = 1;

        _grantRole(DEFAULT_ADMIN_ROLE, owner);
        _grantRole(OWNER_ROLE, owner);
    }

    /**
     * @notice Record income received (rent, lease, etc.)
     */
    function recordIncome(
        uint256 amount,
        address from,
        string memory description,
        bytes32 referenceId
    ) external onlyRole(AGENT_ROLE) nonReentrant returns (uint256) {
        require(amount > 0, "Amount must be positive");
        require(!processedReferences[referenceId], "Reference already processed");

        uint256 txId = _nextTxId++;

        transactions[txId] = Transaction({
            id: txId,
            txType: TransactionType.Income,
            amount: amount,
            from: from,
            to: address(this),
            description: description,
            timestamp: block.timestamp,
            referenceId: referenceId
        });

        totalIncome += amount;
        currentBalance += amount;
        processedReferences[referenceId] = true;

        emit IncomeReceived(txId, from, amount, description, referenceId);

        return txId;
    }

    /**
     * @notice Pay an expense (bills, maintenance, etc.)
     */
    function payExpense(
        address payable to,
        uint256 amount,
        string memory description,
        bytes32 referenceId
    ) external onlyRole(AGENT_ROLE) nonReentrant returns (uint256) {
        require(amount > 0, "Amount must be positive");
        require(to != address(0), "Invalid recipient");
        require(currentBalance >= amount, "Insufficient balance");
        require(!processedReferences[referenceId], "Reference already processed");

        uint256 txId = _nextTxId++;

        transactions[txId] = Transaction({
            id: txId,
            txType: TransactionType.Expense,
            amount: amount,
            from: address(this),
            to: to,
            description: description,
            timestamp: block.timestamp,
            referenceId: referenceId
        });

        totalExpenses += amount;
        currentBalance -= amount;
        processedReferences[referenceId] = true;

        // Transfer funds
        (bool success, ) = to.call{value: amount}("");
        require(success, "Transfer failed");

        emit ExpensePaid(txId, to, amount, description, referenceId);

        return txId;
    }

    /**
     * @notice Record dividend distribution
     * @dev This just records the distribution; actual payments handled by DividendDistribution contract
     */
    function recordDividendDistribution(
        uint256 totalAmount,
        uint256 recipientCount,
        bytes32 referenceId
    ) external onlyRole(AGENT_ROLE) returns (uint256) {
        require(totalAmount > 0, "Amount must be positive");
        require(currentBalance >= totalAmount, "Insufficient balance");
        require(!processedReferences[referenceId], "Reference already processed");

        uint256 txId = _nextTxId++;

        transactions[txId] = Transaction({
            id: txId,
            txType: TransactionType.Dividend,
            amount: totalAmount,
            from: address(this),
            to: address(0),
            description: "Dividend distribution",
            timestamp: block.timestamp,
            referenceId: referenceId
        });

        totalDividends += totalAmount;
        currentBalance -= totalAmount;
        processedReferences[referenceId] = true;

        emit DividendDistributed(txId, totalAmount, recipientCount);

        return txId;
    }

    /**
     * @notice Deposit funds to treasury
     */
    function deposit() external payable nonReentrant returns (uint256) {
        require(msg.value > 0, "Deposit amount must be positive");

        uint256 txId = _nextTxId++;

        transactions[txId] = Transaction({
            id: txId,
            txType: TransactionType.Deposit,
            amount: msg.value,
            from: msg.sender,
            to: address(this),
            description: "External deposit",
            timestamp: block.timestamp,
            referenceId: bytes32(0)
        });

        currentBalance += msg.value;

        emit FundsDeposited(txId, msg.sender, msg.value);

        return txId;
    }

    /**
     * @notice Withdraw funds from treasury (owner only)
     */
    function withdraw(address payable to, uint256 amount)
        external
        onlyRole(OWNER_ROLE)
        nonReentrant
        returns (uint256)
    {
        require(amount > 0, "Amount must be positive");
        require(to != address(0), "Invalid recipient");
        require(currentBalance >= amount, "Insufficient balance");

        uint256 txId = _nextTxId++;

        transactions[txId] = Transaction({
            id: txId,
            txType: TransactionType.Withdrawal,
            amount: amount,
            from: address(this),
            to: to,
            description: "Owner withdrawal",
            timestamp: block.timestamp,
            referenceId: bytes32(0)
        });

        currentBalance -= amount;

        // Transfer funds
        (bool success, ) = to.call{value: amount}("");
        require(success, "Transfer failed");

        emit FundsWithdrawn(txId, to, amount);

        return txId;
    }

    /**
     * @notice Get net income (total income - expenses - dividends)
     */
    function getNetIncome() external view returns (uint256) {
        if (totalIncome >= (totalExpenses + totalDividends)) {
            return totalIncome - totalExpenses - totalDividends;
        }
        return 0;
    }

    /**
     * @notice Get transaction details
     */
    function getTransaction(uint256 txId) external view returns (Transaction memory) {
        require(txId > 0 && txId < _nextTxId, "Invalid transaction ID");
        return transactions[txId];
    }

    /**
     * @notice Get total transaction count
     */
    function getTotalTransactions() external view returns (uint256) {
        return _nextTxId - 1;
    }

    /**
     * @notice Grant agent role to address
     */
    function grantAgentRole(address agent) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(AGENT_ROLE, agent);
    }

    /**
     * @notice Revoke agent role from address
     */
    function revokeAgentRole(address agent) external onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(AGENT_ROLE, agent);
    }

    // Allow contract to receive CRO
    receive() external payable {
        currentBalance += msg.value;
    }
}
