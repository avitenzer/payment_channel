const MqttPublisher = require('./mqtt-publisher');
const ethers = require("ethers");
const path = require('path');
require('dotenv').config({path: path.join(__dirname, '../.env')})
const offChainMessage = require('../off-chain-message');

const publisher = new MqttPublisher(process.env.BROKER_URL, process.env.MQT_TOPIC);

async function main() {

    for (let i = 0; i < 200; i++) {
        let amount = String(i );
        let msg = new offChainMessage(ethers.utils.parseUnits(amount, 'wei').toString(), i);
        msg.generateUnsignedMessage();
        await msg.signMessage();
        const message = await msg.getSignedMessage();
        console.log(`message ${i} is ${message}` );
        publisher.sendRandomJson(message);
    }

}

main();

//publisher.sendRandomJson(message);
//publisher.closeConnection();



