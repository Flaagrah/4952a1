import React from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";
import { connect } from "react-redux";

const Messages = (props) => {
  const { messages, otherUser, userId } = props;
  messages.sort(function(a,b){
    return new Date(a.createdAt) - new Date(b.createdAt)
  })
  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format("h:mm");

        return message.senderId === userId ? (
          <SenderBubble key={message.id} text={message.text} time={time} />
        ) : (
          <OtherUserBubble key={message.id} text={message.text} time={time} otherUser={otherUser} />
        );
      })}
    </Box>
  );
};

const mapStateToProps = (state) => {
  return JSON.parse(JSON.stringify(state))
};

export default connect(mapStateToProps, null)(Messages);
