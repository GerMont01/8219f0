const router = require("express").Router();
const { Message, Conversation } = require("../../db/models");
const { Op } = require("sequelize");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.body.conversationId) return console.log("not found");
    if (!req.user) return res.sendStatus(401);
    const userId = req.user.id;
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

module.exports = router;