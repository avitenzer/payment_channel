// Import the required library
const ethUtil = require('ethereumjs-util');
const { ethers } = require("ethers");
require('dotenv').config();

const generateMessage = (amount, address, nonce) => {

    console.log(`Amount: ${amount}`)
    console.log(`Address: ${address}`)
    console.log(`Nonce: ${nonce}`)

    const hash = ethers.utils.solidityKeccak256(["uint256", "address", "uint256"], [amount, address, nonce]);

    console.log(`Hash: ${messageToHex(hash)}`)

    return hash;
}

const messageToHex = (message) => {
    return message.toString('hex');
}

const getProvider = () => {
    return new ethers.providers.JsonRpcProvider('http://localhost:9545');
}



module.exports = {
    generateMessage,
    messageToHex,
    getProvider,

};
