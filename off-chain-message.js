const {generateMessage, getProvider} = require("./utility");
const ethers = require("ethers");
require('dotenv').config();

class OffChainMessage {
    constructor(amount, nonce) {
        this.validateEnvironmentVariables();

        this.amount = amount;
        this.nonce = nonce;
        this.message = '';
        this.signature = '';
    }

    validateEnvironmentVariables() {
        if (!process.env.PAYMENT_CHANNEL_ADDRESS || !process.env.SENDER_PRIVATE_KEY) {
            throw new Error("Required environment variables are missing");
        }
    }

    generateUnsignedMessage() {
        this.message = generateMessage(this.amount, process.env.PAYMENT_CHANNEL_ADDRESS, this.nonce);
    }

    async signMessage() {

        const senderWallet = new ethers.Wallet(process.env.SENDER_PRIVATE_KEY, getProvider());

        console.log(`Signing Message: ${this.message}`);
        try {
            const signature = await senderWallet.signMessage(ethers.utils.arrayify(this.message));
            console.log(`Signature: ${signature}`);
            this.setSignature(signature);
        } catch (error) {
            console.error(`Error while signing: ${error.message}`);
        }

    }

    setSignature(signature) {
        this.signature = signature;
    }

    async getSignedMessage() {

        console.log(`Signature: ${this.signature}`);

        let message = {};
        message.nonce = this.nonce;
        message.signature = this.signature;
        message.amount = this.amount;

        return JSON.stringify(message);
    }

}

module.exports = OffChainMessage;