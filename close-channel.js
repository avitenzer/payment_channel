
const ethers = require('ethers');
const {getProvider} = require("./utility");

const paymentChannelABI = require('./build/contracts/PaymentChannel.json').abi;
const tokenContractABI = require('./build/contracts/Token.json').abi;
require('dotenv').config();

async function main() {

    console.log('Closing channel');

    const senderWallet = new ethers.Wallet(process.env.SENDER_PRIVATE_KEY, getProvider());

    const tokenContractAddress = process.env.TOKEN_CONTRACT_ADDRESS;
    const paymentChannelAddress = process.env.PAYMENT_CHANNEL_ADDRESS

    const paymentChannel = new ethers.Contract(paymentChannelAddress, paymentChannelABI, senderWallet);
    const tokenContract = new ethers.Contract(tokenContractAddress, tokenContractABI, senderWallet);

    const amount = ethers.utils.parseUnits('199', 'wei'); // Amount for the last off-chain message
    const nonce = 199; // Nonce for the last off-chain message
    const sig = '0x6410590b7a4a846baaf569770e037f452751e77c9a9c12976a8e973abdc968465be90393e40d2534c81a71b63ddee0a8720e944e7ea7338af61ac49f479eea5e1b'; // Signature for the last off-chain message

    // Call the closeChannel function
    const tx = await paymentChannel.closeChannel(amount, nonce, sig);
    const receipt = await tx.wait();
    console.log(`Closing Channel Transaction hash: ${receipt.transactionHash}`);

}

main();
