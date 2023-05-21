const Token = artifacts.require("Token");
const PaymentChannel = artifacts.require("PaymentChannel");

module.exports = async function (deployer) {
  await deployer.deploy(Token);
  const token = await Token.deployed();

  await  deployer.deploy(PaymentChannel, token.address);

  const paymentChannel = await PaymentChannel.deployed();

  console.log('Token was deployed to address: ', token.address);
  console.log('PaymentChannel was deployed to address: ', paymentChannel.address);

};
