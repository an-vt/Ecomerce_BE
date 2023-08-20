'use strict'
const mongoose = require('mongoose');
const {countConnect} = require("../helpers/checkConnect")

const connectString = 'mongodb://localhost:27017/shopDEV'

class Database {
    constructor() {
        this.connect();
    }

    //connect
    connect(type = "mongodb") {
        if(1 === 1){
            mongoose.set('debug', true)
            mongoose.set('debug', {color: true})
            mongoose.connect(connectString).then(_ => console.log("Connected Mongodb Success", countConnect())).catch(err => console.log("Error Connect!"))
        }
    }
    static getInstance() {
        if(!Database.instance) { 
            Database.instance = new Database();
        }

        return Database.instance;
    }
}

const insanceMongodb = Database.getInstance();
module.exports = insanceMongodb;