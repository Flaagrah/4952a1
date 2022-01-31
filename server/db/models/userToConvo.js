const { Op, DataTypes } = require("sequelize");
const db = require("../db");

const UserToConvo = db.define("userToConvo", {
  numMessagesRead: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
});

module.exports = UserToConvo;