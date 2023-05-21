const ethers = require("ethers");
const {generateMessage, getProvider} = require("./utility");
require('dotenv').config();

async function main() {

    const senderWallet = new ethers.Wallet(process.env.SENDER_PRIVATE_KEY, getProvider());

    // Generate the first off-chain message
    let amount = ethers.utils.parseUnits('300', 'wei');
    let nonce = 1;
    let message = generateMessage(amount, process.env.PAYMENT_CHANNEL_ADDRESS, nonce);

    senderWallet.signMessage(ethers.utils.arrayify(message)).then((signature) => {
        console.log(`Signature: ${signature}`);
    }).catch((error) => {
        console.error(`Error while signing: ${error.message}`);
    });

}

main();