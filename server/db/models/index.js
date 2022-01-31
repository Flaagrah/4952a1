const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");
const UserToConvo = require("./userToConvo");
// associations

Conversation.belongsToMany(User, {through: UserToConvo});
Message.belongsTo(Conversation);
Conversation.hasMany(Message);

module.exports = {
  User,
  Conversation,
  Message
};
