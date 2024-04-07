const amqp = require("amqplib");

const runConsumerOrderService = async () => {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const queueName = "ordered-queue-message";
  await channel.assertQueue(queueName, {
    durable: true,
  });

  // set prefetch to 1 to ensure that the message is processed in order
  channel.prefetch(1);

  channel.consume(queueName, (msg) => {
    setTimeout(() => {
      console.log(`Processed message: ${msg.content.toString()}`);
      // channel.ack(msg);
    }, Math.random() * 1000);
  });
};

runConsumerOrderService()
  .then((res) => console.log(res))
  .catch(console.error);
