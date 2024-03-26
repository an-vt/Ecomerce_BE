const redis = require("redis");
const { RedisErrorResponse } = require("../core/error.response");

let client = {},
  statusConnectRedis = {
    CONNECT: "connect",
    END: "end",
    RECONNECT: "reconnecting",
    ERROR: "error",
  },
  connectionTimeout;

const REDIS_CONNECT_TIMEOUT = 10000,
  REDIS_CONNECT_MESSAGE = {
    code: -99,
    message: {
      vn: "Redis loi roi huhu",
      en: "Redis connection error",
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
  connectionRedis.on(statusConnectRedis.CONNECT, () => {
    console.log(`statusConnectRedis - Connection status: connected`);
    clearTimeout(connectionTimeout);
  });

  connectionRedis.on(statusConnectRedis.END, () => {
    console.log(`statusConnectRedis - Connection status: disconnected`);
    // connection retry
    handleTimeoutError();
  });

  connectionRedis.on(statusConnectRedis.RECONNECT, () => {
    console.log(`statusConnectRedis - Connection status: reconnecting`);
    clearTimeout(connectionTimeout);
  });

  connectionRedis.on(statusConnectRedis.ERROR, (err) => {
    console.log(`statusConnectRedis - Connection status: error`);
    // connection retry
    handleTimeoutError();
  });
};

const initRedis = () => {
  const instanceRedis = redis.createClient();
  client.instanceConnect = instanceRedis;
  handleEventConnection({ connectionRedis: instanceRedis });
};

const getRedis = () => client;

const closeRedis = () => {};

module.exports = {
  initRedis,
  getRedis,
  closeRedis,
};
