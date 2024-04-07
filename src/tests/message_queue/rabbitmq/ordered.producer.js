const amqp = require("amqplib");

const runProducerOrderService = async () => {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const queueName = "ordered-queue-message";
  await channel.assertExchange(queueName, "direct", {
    durable: true,
  });

  for (let i = 0; i < 10; i++) {
    const message = `Message :: ${i}`;
    console.log(`Sending message: ${message}`);
    channel.sendToQueue(queueName, Buffer.from(message), {
      persistent: true,
    });
  }

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
};

runProducerOrderService()
  .then((res) => console.log(res))
  .catch(console.error);
