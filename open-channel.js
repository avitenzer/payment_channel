
const ethers = require('ethers');
const { generateMessage, messageToHex, getProvider } = require('./utility');
require('dotenv').config();


const paymentChannelABI = require('./build/contracts/PaymentChannel.json').abi;
const tokenContractABI = require('./build/contracts/Token.json').abi;

async function main() {

    console.log('Creating channel and generating off-chain payment messages');

    const senderWallet = new ethers.Wallet(process.env.SENDER_PRIVATE_KEY, getProvider());

    const paymentChannel = new ethers.Contract(process.env.PAYMENT_CHANNEL_ADDRESS, paymentChannelABI, senderWallet);
    const tokenContract = new ethers.Contract(process.env.TOKEN_CONTRACT_ADDRESS, tokenContractABI, senderWallet);

    const duration = 60 * 60 * 24; // 24 hours

    // Open the channel
    await paymentChannel.openChannel(process.env.CHANNEL_RECIPIENT_ADDRESS, duration);

    //fund account with 1000 tokens
    const channelAmount = ethers.utils.parseUnits('1000', 'wei');

    const gasPrice = await getProvider().getGasPrice();
    const tx = await tokenContract.transfer(process.env.PAYMENT_CHANNEL_ADDRESS, channelAmount, {
        gasPrice: gasPrice,
    });

    console.log(`Transfer Transaction hash: ${tx.hash}`);

    const receipt = await tx.wait();

    console.log(`Transaction was mined in block ${receipt.blockNumber}`);

    await tokenContract.approve(process.env.PAYMENT_CHANNEL_ADDRESS, channelAmount);


}



main();
