const amqp = require('amqplib');

const runProducerEmail = async (data) => {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  const emailQueue = 'emailQueueProcess';
  const emailExchange = 'emailEx';
  const emailExchangeDLX = 'emailExDLX';
  const emailRoutingKeyDLX = 'emailRoutingKeyDLX';

  //1. Create Exchange
  await channel.assertExchange(emailExchange, 'direct', {
    durable: true,
  });

  //2. Create Queue
  const resultQueue = await channel.assertQueue(emailQueue, {
    exclusive: false, // cho phep cac ket noi truy cap vao cung 1 luc
    deadLetterExchange: emailExchangeDLX,
    deadLetterRoutingKey: emailRoutingKeyDLX,
  });

  //3. Bind Queue to Exchange
  await channel.bindQueue(resultQueue.queue, emailExchange);

  //4. Send message
  await channel.sendToQueue(
    resultQueue.queue,
    Buffer.from(JSON.stringify(data)),
    {
      expiration: '10000', // TTL
    }
  );

  setTimeout(() => {
    connection.close();
  }, 500);
};

module.exports = { runProducerEmail };
