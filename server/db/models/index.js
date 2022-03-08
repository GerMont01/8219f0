const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");

// associations
// Many to many association between User and Conversation through a new table "User_Conversation"
User.belongsToMany(Conversation, { through: 'User_Conversation' });
Conversation.belongsToMany(User, { through: 'User_Conversation' });
Message.belongsTo(Conversation);
Conversation.hasMany(Message);

module.exports = {
  User,
  Conversation,
  Message
};
