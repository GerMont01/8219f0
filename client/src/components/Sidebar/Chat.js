import React, { useEffect, useState } from 'react';
import { Badge, Box, Typography } from '@material-ui/core';
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
    marginRight:'15px',
  }
}));

const Chat = ({ conversation, setActiveChat, readMessages,getUnRead }) => {
  const classes = useStyles();
  const { otherUser } = conversation;
  const [unread, setUnread] = useState();

  const fetchUnread = async (conversation) => {
    const data = await getUnRead(conversation.id)
    if (data) {
      setUnread(data.data)
    }
  }

  useEffect(()=>{
    if (conversation) fetchUnread(conversation);
  },[conversation])

  const handleClick = async (conversation) => {
    await readMessages(conversation.id)
    await setActiveChat(conversation.otherUser.username, conversation.id);
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
        <Badge badgeContent={unread} color="primary" className={classes.unread}></Badge>
      }
    </Box>
  );
};

export default Chat;
