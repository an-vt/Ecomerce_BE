const amqp = require("amqplib");

const messages = "Send email from provider";

const runProducerEmail = async () => {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const queueName = "send_mail";
  await channel.assertQueue(queueName, {
    durable: true,
  });

  // send message to consumer channel
  channel.sendToQueue(queueName, Buffer.from(messages));
  console.log(`message sent: `, messages);
  setTimeout(() => {
    connection.close();
  }, 0);
};

runProducerEmail().catch(console.error);

module.exports = { runProducerEmail };
