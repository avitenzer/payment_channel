##  Mac

to start development server, run the following command:

```truffle develop --log```

to deploy contracts, run the following command:

```truffle migrate --reset```

create an .env file with the following variables

TOKEN_CONTRACT_ADDRESS=   
PAYMENT_CHANNEL_ADDRESS=   
SENDER_PRIVATE_KEY=  
CHANNEL_RECIPIENT_ADDRESS=  
BROKER_URL=mqtt://localhost:1883  
MQT_TOPIC=payment-channel  

To open the channel, run the following command: 
`node open-channel.js`

To generate an off-chain payment message, run the following command: 
`node generateOffChainMessage.js`

Copy the signature and paste it in the offChainMessage variable in the close-channel.js file in line 23  

To close the channel and settle the payment, run the following command:
`node close-channel.js`

**Note:** The amount and nonce in the close-channel.js file should be the same as the amount and nonce in the generateOffChainMessage.js file


install mosquitto

```brew install mosquitto```

start mosquitto

```brew services start mosquitto```
or

/usr/local/opt/mosquitto/sbin/mosquitto -c /usr/local/etc/mosquitto/mosquitto.conf

To start the listener, run the following command:

```node listener.js```

To start the publisher, run the following command:

```node publisher.js```

Update the close channel 

** nonce
** amount
** signature

Close the channel

```node close-channel.js```








