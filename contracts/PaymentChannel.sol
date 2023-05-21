// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";


contract ReentrancyGuard {
    bool private _notEntered;

    constructor () {
        // Initially not entered
        _notEntered = true;
    }

    modifier nonReentrant() {
        // On the first call to nonReentrant, _notEntered will be true
        require(_notEntered, "ReentrancyGuard: reentrant call");

        // Any calls made from within this call chain will fail
        _notEntered = false;

        _;

        // By storing the original state before any call, we ensure that
        // even if there is a reentrancy attack, the guard will be
        // reset and will keep working as expected
        _notEntered = true;
    }
}

contract PaymentChannel is ReentrancyGuard{
    enum State {
        Inactive,
        Active,
        Closed
    }

    State public state = State.Inactive;
    address public sender;
    address public recipient;
    uint256 public expiration;
    IERC20 public token;
    bytes32 public channelId;

    modifier onlySender() {
        require(msg.sender == sender, "Only sender can call this function.");
        _;
    }

    modifier onlySenderOrRecipient() {
        require(msg.sender == sender || msg.sender == recipient, "Not authorized");
        _;
    }

    modifier inState(State _state) {
        require(state == _state, "Invalid state.");
        _;
    }

    event Message(bytes32 message);

    event Signature(bytes32 signature);

    event Closed(uint balance);

    event ChannelOpened(bytes32 channelId);

    constructor(address _token) {
        token = IERC20(_token);
        sender = msg.sender;
    }

    function openChannel(address _recipient, uint256 duration) public onlySender inState(State.Inactive) {
        recipient = _recipient;
        expiration = block.timestamp + duration;
        state = State.Active;
        channelId = generateChannelId(sender, recipient);
        emit ChannelOpened(channelId);
    }

    function closeChannel(uint256 amount, uint256 nonce, bytes memory signature ) public nonReentrant onlySenderOrRecipient inState(State.Active) {
        require(block.timestamp <= expiration, "Channel expired.");

        bytes32 hash = keccak256(abi.encodePacked(amount, address(this), nonce));

        emit Message(hash);

        bytes32 message = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));

        require(recoverSigner(message, signature) == sender, "Invalid signature");

        emit Closed(amount);

        uint256 contractBalance = token.balanceOf(address(this));

        require(token.transfer(recipient, amount), "Token transfer to recipient failed");

        if (contractBalance > amount) {
            require(token.transfer(sender, contractBalance - amount), "Token transfer to sender failed");
        }

        state = State.Closed;
    }

    function extend(uint256 duration) public onlySender inState(State.Active) {
        expiration += duration;
    }

    function generateChannelId(address _sender, address _recipient) private view returns (bytes32) {
        return keccak256(abi.encodePacked(_sender, _recipient, block.timestamp));
    }

    function recoverSigner(bytes32 message, bytes memory sig) internal pure returns (address)
    {
        (uint8 v, bytes32 r, bytes32 s) = splitSignature(sig);
        return ecrecover(message, v, r, s);
    }

    function splitSignature(bytes memory sig) internal pure returns (uint8 v, bytes32 r, bytes32 s)
    {
        require(sig.length == 65, "Invalid signature length.");

        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }

        return (v, r, s);
    }

    function prefixed(bytes32 hash) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
    }
}



