const mqtt = require('mqtt');

class MqttPublisher {


    constructor(brokerUrl, topic) {
        this.client  = mqtt.connect(brokerUrl);
        this.topic = topic;
    }

 sendRandomJson(message) {

        this.client.publish(this.topic, JSON.stringify(message), { qos: 0, retain: true },  (error) => {
            if (error) {
                console.log(error)
            }
        });
    }

    closeConnection() {
        this.client.end(true);
    }
}

module.exports = MqttPublisher;
