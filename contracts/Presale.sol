//SPDX-License-Identifier: UNLICENSED

// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
// import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "./Token.sol";

// This is the main building block for smart contracts.
contract Presale is Ownable, Pausable {
    Token public atn;
    uint256 public rate;
    uint256 public constant denominator = 100;

    event TokenPurchase(address sender, uint256 amount);

    constructor(uint256 _rate, address _atn) {
        require(_atn != address(0x0), "Invalid address");
        require(_rate > 0, "Invalid rate");
        atn = Token(_atn);
        rate = _rate;
    }

    function purchase() payable whenNotPaused external {
        require(msg.value > 0, "Invalid input payment");
        uint256 tokenAmount = msg.value * rate  / denominator;
        atn.transfer(msg.sender, tokenAmount);

        emit TokenPurchase(msg.sender, tokenAmount);
    }

}