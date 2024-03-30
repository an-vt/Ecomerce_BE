const amqp = require("amqplib");

const messages = "Hello from RabbitMQ provider";

const runProducer = async () => {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const queueName = "test-topic";
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

runProducer().catch(console.error);
