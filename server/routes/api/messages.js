const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");
const { Op } = require("sequelize");

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
      const message = await Message.create({ 
        senderId, 
        text, 
        conversationId
      });
      return res.json({ message, sender });
    }
    // if we don't have conversation id, find a conversation to make sure it doesn't already exist

    //We would need to change or remove this part to only find conversation by id.
    let conversation = await Conversation.findConversation(
      senderId,
      recipientId
    );
    // We would need to change this part too to create the conversation with all the users involved
    if (!conversation) {
      // create conversation
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId,
      });
      if (onlineUsers.includes(sender.id)) {
        sender.online = true;
      }
    }
    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id
    });
    res.json({ message, sender });
  } catch (error) {
    next(error);
  }
});

// read messages
router.put("/read", async (req, res, next) => {
  try {

    if (!req.user) return res.sendStatus(401);

    const userId = req.user.id;

    const myConversation = await Conversation.findOne({
      where: {
        id: req.body.conversationId
      }
    });

    if (!myConversation) return res.sendStatus(404);
    if (myConversation.user1Id !== userId && myConversation.user2Id !== userId) return res.sendStatus(403);
    
    await Message.update({ read: true }, {
        where: {
            conversationId: req.body.conversationId,
            senderId: {
                [Op.ne]:userId
            }
        }
    });
    const conversation = await Conversation.findOne({
        where: {
            id: req.body.conversationId
        },
        order: [[Message, "createdAt", "ASC"]],
        include: [
            { model: Message }
          ]
    })
    return res.json(conversation);
  } catch (error) {
    next(error)
  }
});

router.get("/read", async (req, res, next) => {
  try {
    if (!req.query.conversationId) return res.sendStatus(404);
    if (!req.user) return res.sendStatus(401);
    
    const userId = req.user.id;

    const myConversation = await Conversation.findOne({
      where: {
        id: req.query.conversationId
      },
      include: [
        { 
          model: Message,
          where: {
            read: false,
            senderId: {
              [Op.ne]:userId
            }
          }
        },
      ],
    });

    if (!myConversation) return res.json(null);

    if (myConversation.user1Id !== userId && myConversation.user2Id !== userId) return res.sendStatus(403);

    res.json(myConversation.messages.length);

  } catch (error) {
    next(error);
  }
});

module.exports = router;
