const router = require("express").Router();
const { Message, Conversation, User } = require("../../db/models");
const { Op } = require("sequelize");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.put("/", async (req, res, next) => {
  try {
    if (!req.body.conversationId) return res.sendStatus(404);
    if (!req.user) return res.sendStatus(401);

    const userId = req.user.id;

    const myconversation = await Conversation.findOne({
      where: {
        id: req.body.conversationId
      }
    });
    if (myconversation.user1Id !== userId && myconversation.user2Id !== userId) return res.sendStatus(403);
    
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

router.get("/", async (req, res, next) => {
  try {
    if (!req.query.conversationId) return res.sendStatus(404);
    if (!req.user) return res.sendStatus(401);
    
    const userId = req.user.id;

    const myconversation = await Conversation.findOne({
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
    if (!myconversation) return res.json(null);

    if (myconversation.user1Id !== userId && myconversation.user2Id !== userId) return res.sendStatus(403);

    res.json(myconversation.messages.length);

  } catch (error) {
    next(error);
  }
});

module.exports = router;