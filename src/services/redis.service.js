"use strict";
const redis = require("redis");
const { promisify } = require("util");
const {
  reservationInventory,
} = require("../models/repositories/inventory.repo");
const { getRedis } = require("../dbs/init.redis");
const { instanceConnect: redisClient } = getRedis();

const pExpire = promisify(redisClient.pexpire).bind(redisClient);
const setNXAsync = promisify(redisClient.setnx).bind(redisClient);

const acquireLock = async (productId, quantity, cartId) => {
  const key = `lock_v2023_${productId}`;
  // 10 times retry
  const retryTimes = 10;
  const expireTime = 3000; // 3s

  for (let i = 0; i < retryTimes; i++) {
    // tao mot key, thang nao nam giu duoc vao thanh toan
    const result = await setNXAsync(key, expireTime);

    console.log(`result ::::: ${result}`);

    if (result === 1) {
      // thao tac voi inventory

      const isReservation = await reservationInventory({
        productId,
        quantity,
        cartId,
      });

      if (isReservation.modifiedCount) {
        await pExpire(key, expireTime);
        return key;
      }

      return null;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
};

const releaseLock = async (keyLock) => {
  const delAsyncKey = promisify(redisClient.del).bind(redisClient);
  return await delAsyncKey(keyLock);
};

module.exports = {
  acquireLock,
  releaseLock,
};
