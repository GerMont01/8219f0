import React from 'react';
import { Avatar, Box } from '@material-ui/core';
import { SenderBubble, OtherUserBubble } from '.';
import moment from 'moment';


import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  profilePic: {
    height: 20,
    width: 20,
    display: 'inline-flex',
    margin: '5px',
  },
  alignRight: {
    textAlign: 'right',
  }
}));

const Messages = (props) => {
  const { messages, otherUser, userId } = props;
  const classes = useStyles();

  return (
    <Box>
      {messages.map((message, index, self) => {
        const time = moment(message.createdAt).format('h:mm');

        return message.senderId === userId ? (
          <Box key={message.id} className={classes.alignRight}>
            <SenderBubble 
              text={message.text} 
              time={time} 
              read={message.read}
            />
            { //If the message is read and it is the last one OR message is read and there is a message afterwards that is not read THEN display avatar
              ((message.read && index === self.length - 1) || (message.read && self[index+1] && !self[index+1].read)) &&
                <Avatar alt={otherUser.username} src={otherUser.photoUrl} className={classes.profilePic} />  
            }
          </Box> 
        ) : (
          <OtherUserBubble
            key={message.id}
            text={message.text}
            time={time}
            otherUser={otherUser}
          />
        );
      })}
    </Box>
  );
};

export default Messages;
