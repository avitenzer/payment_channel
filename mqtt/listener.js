const MqttListener = require('./mqtt-listener');
const path = require('path');
require('dotenv').config({path: path.join(__dirname, '../.env')})

async function main() {


    const listener = new MqttListener(process.env.BROKER_URL, process.env.MQT_TOPIC);
    listener.startListening();

    // To stop listening, call:
    // listener.stopListening();
}

main();