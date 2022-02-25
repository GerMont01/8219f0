import React from 'react';
import { Box } from '@material-ui/core';
import { SenderBubble, OtherUserBubble } from '.';
import moment from 'moment';

const Messages = (props) => {
  const { messages, otherUser, userId } = props;

  return (
    <Box>
      {messages.map((_,index,array) => {
        const time = moment(array[array.length-1-index].createdAt).format('h:mm');

        return array[array.length-1-index].senderId === userId ? (
          <SenderBubble key={array[array.length-1-index].id} text={array[array.length-1-index].text} time={time} />
        ) : (
          <OtherUserBubble
            key={array[array.length-1-index].id}
            text={array[array.length-1-index].text}
            time={time}
            otherUser={otherUser}
          />
        );
      })}
    </Box>
  );
};

export default Messages;
