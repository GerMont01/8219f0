import React from 'react';
import { Box } from '@material-ui/core';
import { SenderBubble, OtherUserBubble } from '.';
import moment from 'moment';

const Messages = (props) => {
  const { messages, otherUser, userId } = props;

  return (
    <Box>
      {messages.map((_,i,m) => {
        const time = moment(m[m.length-1-i].createdAt).format('h:mm');

        return m[m.length-1-i].senderId === userId ? (
          <SenderBubble key={m[m.length-1-i].id} text={m[m.length-1-i].text} time={time} />
        ) : (
          <OtherUserBubble
            key={m[m.length-1-i].id}
            text={m[m.length-1-i].text}
            time={time}
            otherUser={otherUser}
          />
        );
      })}
    </Box>
  );
};

export default Messages;
