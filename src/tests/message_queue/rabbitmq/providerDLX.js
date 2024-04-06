const amqp = require("amqplib");

const log = console.log;
console.log = function () {
  log.apply(console, [new Date()].concat(arguments));
};

const runProducer = async () => {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const notificationExchange = "notificationEx";
  const notificationQueue = "notificationQueueProcess";
  const notificationExchangeDLX = "notificationExDLX";
  const notificationRoutingKeyDLX = "notificationRoutingKeyDLX";

  //1. Create Exchange
  await channel.assertExchange(notificationExchange, "direct", {
    durable: true,
  });

  //2. Create Queue
  const resultQueue = await channel.assertQueue(notificationQueue, {
    exclusive: false, // cho phep cac ket noi truy cap vao cung 1 luc
    deadLetterExchange: notificationExchangeDLX,
    deadLetterRoutingKey: notificationRoutingKeyDLX,
  });

  //3. Bind Queue to Exchange
  await channel.bindQueue(resultQueue.queue, notificationExchange);

  const msg = "a new product publish";
  console.log(`Queue ::: ${resultQueue.queue} => sending message: ${msg}`);

  //4. Send message
  await channel.sendToQueue(resultQueue.queue, Buffer.from(msg), {
    expiration: "10000", // TTL
  });

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
};

runProducer()
  .then((res) => console.log(res))
  .catch(console.error);
