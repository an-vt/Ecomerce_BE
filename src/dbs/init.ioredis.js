const Redis = require('ioredis');
const { RedisErrorResponse } = require('../core/error.response');

let clients = {},
  statusConnectIORedis = {
    CONNECT: 'connect',
    END: 'end',
    RECONNECT: 'reconnecting',
    ERROR: 'error',
  },
  connectionTimeout;

const REDIS_CONNECT_TIMEOUT = 10000,
  REDIS_CONNECT_MESSAGE = {
    code: -99,
    message: {
      vn: 'Redis loi roi huhu',
      en: 'Redis connection error',
    },
  };

const handleTimeoutError = () => {
  connectionTimeout = setTimeout(() => {
    throw new RedisErrorResponse(
      REDIS_CONNECT_MESSAGE.message.vn,
      REDIS_CONNECT_MESSAGE.code
    );
  }, REDIS_CONNECT_TIMEOUT);
};

const handleEventConnection = ({ connectionRedis }) => {
  // check if connection is null
  connectionRedis.on(statusConnectIORedis.CONNECT, () => {
    console.log(`statusConnectIORedis - Connection status: connected`);
    clearTimeout(connectionTimeout);
  });

  connectionRedis.on(statusConnectIORedis.END, () => {
    console.log(`statusConnectIORedis - Connection status: disconnected`);
    // connection retry
    handleTimeoutError();
  });

  connectionRedis.on(statusConnectIORedis.RECONNECT, () => {
    console.log(`statusConnectIORedis - Connection status: reconnecting`);
    clearTimeout(connectionTimeout);
  });

  connectionRedis.on(statusConnectIORedis.ERROR, (err) => {
    console.log(`statusConnectIORedis - Connection status: error`);
    // connection retry
    handleTimeoutError();
  });
};

const initIORedis = ({
  IOREDIS_IS_ENABLED,
  IOREDIS_HOST = process.env.REDIS_CACHE_HOST,
  IOREDIS_PORT = 6379,
}) => {
  if (IOREDIS_IS_ENABLED) {
    const instanceRedis = new Redis({
      host: IOREDIS_HOST,
      port: IOREDIS_PORT,
    });
    clients.instanceConnect = instanceRedis;
    handleEventConnection({ connectionRedis: instanceRedis });
  }
};

const getIORedis = () => clients;

const closeIORedis = () => {};

module.exports = {
  initIORedis,
  getIORedis,
  closeIORedis,
};
