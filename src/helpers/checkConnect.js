'use strict'

const mongoose = require('mongoose');
const os = require('os');
const process = require('process');

const SECONDS = 5000;

//count Connect
const countConnect = () => {
    const numConnection = mongoose.connections.length;

    console.log(`Number of connections: ${numConnection}`);
}

//check over load
const checkOverload = () => {
    setInterval(() => {
        const numConnection = mongoose.connect.length;
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;
        // Exampl maximum number connections based on number of osf cores
        const maxConnections = numCores * 5;

        console.log(`Memory uasage:: ${memoryUsage/1024/1024} MB`);

        if(numConnection > maxConnections) {
            console.log(`Connection overload detected!`);
        }

    }, SECONDS) // Monitor every 5 seconds
}

module.exports = {
    countConnect,
    checkOverload
}