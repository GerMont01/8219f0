const db = require("../db");

const Conversation = db.define("conversation", {});

// Conversation would now be only found by Id

module.exports = Conversation;
