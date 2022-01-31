import React from "react";
import { Box, Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";

const useStyles = makeStyles(() => ({
  avatar: {
    height: 20,
    width: 20,
    marginRight: 11,
    marginTop: 6
  },
  iconRoot: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end"
  }
}))
const Messages = (props) => {
  const { messages, otherUser, userId, otherUserNumRead } = props;
  const classes = useStyles()

  let placedIcon = false;
  let maxIndex = -1
  //This is used to place the icon above recent messages posted by the other user
  for (let i = otherUserNumRead-1;i>=0;i--) {
    if (messages[i].senderId==userId) {
      maxIndex = i
      break
    }
  }
  const getIcon = (index)=>{
    if (!placedIcon && (index == otherUserNumRead-1 || maxIndex==index)) {
      placedIcon = true
      return (
      <Box className={classes.iconRoot}>
        <Avatar alt={otherUser.username} src={otherUser.photoUrl} className={classes.avatar}></Avatar>
      </Box>
      )
    } else {
      return ''
    }
    
  }
  return (
    <Box>
      {messages.map((message, index) => {
        const time = moment(message.createdAt).format("h:mm");

        return message.senderId === userId ? (
          <React.Fragment>
            <SenderBubble key={message.id} text={message.text} time={time} />
            {getIcon(index)}
          </React.Fragment>
        ) : (
          <React.Fragment>
            <OtherUserBubble key={message.id} text={message.text} time={time} otherUser={otherUser} />
            {getIcon(index)}
          </React.Fragment>
        );
      })}
    </Box>
  );
};

export default Messages;
