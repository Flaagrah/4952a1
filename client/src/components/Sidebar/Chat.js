import React from "react";
import { Box } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { makeStyles } from "@material-ui/core/styles";
import { setActiveChat } from "../../store/activeConversation";
import { patchNumRead } from "../../store/utils/thunkCreators";
import { connect } from "react-redux";
import { readUpdateMessage } from "../ActiveChat/utils/Utils";
import { gotConversations } from "../../store/conversations";
import { withThemeCreator } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: "0 2px 10px 0 rgba(88,133,196,0.05)",
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    "&:hover": {
      cursor: "grab"
    }
  },
  unread: {
    color: "white",
    backgroundColor: "blue",
    borderRadius: "1em",
    padding: "0.2em 0.65em",
    fontSize: "0.8em",
    fontWeight: "bold"
  } 
}));

const Chat = (props) => {
  const classes = useStyles();
  const { conversation, user } = props;
  const { otherUser } = conversation;
  const numMessages = conversation.messages ? conversation.messages.length : 0
  const numRead = conversation.thisUserNumRead
  let unRead = numMessages - numRead

  const handleClick = async (conversation) => {
    await props.setActiveChat(conversation.otherUser.username);
    console.log(conversation)
    const readUpdate = readUpdateMessage(props)
    await props.patchNumRead(readUpdate)
  }

  return (
    <Box onClick={() => handleClick(conversation)} className={classes.root}>
      <BadgeAvatar
        photoUrl={otherUser.photoUrl}
        username={otherUser.username}
        online={otherUser.online}
        sidebar={true}
      />
      <ChatContent conversation={conversation} />
      {
        unRead > 0 ?
        <div className={classes.unread}>
          {unRead ? unRead : ''}
        </div> : ''
      }
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveChat: (id) => {
      dispatch(setActiveChat(id));
    },
    patchNumRead: (readUpdate) => {
      dispatch(patchNumRead(readUpdate))
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
