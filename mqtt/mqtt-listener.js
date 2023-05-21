const mqtt = require('mqtt');

class MqttListener {
    constructor(brokerUrl, topic) {

        this.client  = mqtt.connect(brokerUrl);
        this.topic = topic;
    }

    startListening() {
        this.client.on('connect', () => {
            this.client.subscribe(this.topic, (err) => {
                if (err) {
                    console.error(`Error subscribing to topic: ${err}`);
                } else {
                    console.log(`Subscribed to topic ${this.topic}`);
                }
            });
        });

        this.client.on('message', (topic, message) => {
            console.log(`Received message on ${topic}: ${message.toString()}`);
        });
    }

    stopListening() {
        this.client.unsubscribe(this.topic, (err) => {
            if (err) {
                console.error(`Error unsubscribing from topic: ${err}`);
            }
        });
    }
}

module.exports = MqttListener;
