const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");

router.patch("/readupdate", async (req, res, next)=>{
  try {
    const senderId = req.user.id
    const { conversationId, numRead } = req.body
    // const conversation = await Conversation.findConversation({
    //   id: conversationId
    // })
    const conversationObj = await Conversation.findOne({ where: {id: conversationId} })
    if (conversationObj) {
      console.log(conversationObj.dataValues)
      const conversation = conversationObj.dataValues
      let key = undefined
      if (senderId==conversation.user1Id) {
        key = "user1NumRead"
      } else if (senderId==conversation.user2Id) {
        key = "user2NumRead"
      }
      if (key) {
        const keyValue = {}
        keyValue[key] = numRead
        await conversationObj.update(keyValue)
        await conversationObj.save()
      }
      res.json({ numRead })
    } else {
      throw exception
    }
  } catch (error) {
    next(error)
  }
})

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender } = req.body;

    // if we already know conversation id, we can save time and just add it to message and return
    if (conversationId) {
      const message = await Message.create({ senderId, text, conversationId });
      return res.json({ message, sender });
    }
    // if we don't have conversation id, find a conversation to make sure it doesn't already exist
    let conversation = await Conversation.findConversation(
      senderId,
      recipientId
    );

    if (!conversation) {
      // create conversation
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId
      });
      if (onlineUsers.includes(sender.id)) {
        sender.online = true;
      }
    }
    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id,
    });
    res.json({ message, sender });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
