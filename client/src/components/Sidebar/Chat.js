import React from 'react';
import { Box, Typography } from '@material-ui/core';
import { BadgeAvatar, ChatContent } from '../Sidebar';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: '0 2px 10px 0 rgba(88,133,196,0.05)',
    marginBottom: 10,
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
      cursor: 'grab',
    },
  },
  unread: {
    padding: '2px 8px',
    backgroundImage: 'linear-gradient(225deg, #6CC1FF 0%, #3A8DFF 100%)',
    borderRadius: '50%',
    fontSize: '12px',
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginRight:'10px',
  }
}));

const Chat = ({ conversation, setActiveChat, userId, readMessages }) => {
  const classes = useStyles();
  const { otherUser } = conversation;
  const unread = conversation.messages.filter(message=>message.read === false && message.senderId !== userId).length || undefined;

  const handleClick = async (conversation) => {
    await setActiveChat(conversation.otherUser.username, conversation.id);
    await readMessages(conversation.id)
  };
  
  return (
    <Box onClick={() => handleClick(conversation)} className={classes.root}>
      <BadgeAvatar
        photoUrl={otherUser.photoUrl}
        username={otherUser.username}
        online={otherUser.online}
        sidebar={true}
      />
      <ChatContent conversation={conversation} unread={unread}/>
      {unread &&
        <Typography className={classes.unread}>{unread}</Typography>
      }
    </Box>
  );
};

export default Chat;
