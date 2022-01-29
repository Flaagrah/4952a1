import React, { useState } from "react";
import { FormControl, FilledInput } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { postMessage, patchNumRead } from "../../store/utils/thunkCreators";
import { readUpdateMessage } from "./utils/Utils";

const useStyles = makeStyles(() => ({
  root: {
    justifySelf: "flex-end",
    marginTop: 15
  },
  input: {
    height: 70,
    backgroundColor: "#F4F6FA",
    borderRadius: 8,
    marginBottom: 20
  }
}));

const Input = (props) => {
  const classes = useStyles();
  const [text, setText] = useState("");
  const { postMessage, otherUser, conversation, user } = props;
  const conversationId = conversation.id

  const handleChange = (event) => {
    setText(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // add sender user info if posting to a brand new convo, so that the other user will have access to username, profile pic, etc.
    console.log(props)
    const reqBody = {
      text: event.target.text.value,
      recipientId: otherUser.id,
      conversationId,
      sender: conversationId ? null : user
    };
    const numMessages = conversation.messages.length + 1
    try {
      await postMessage(reqBody);
    } catch (error) {
      console.error("Error Sending Message")
      return
    }
    setText("");
    const readUpdate = readUpdateMessage(props, numMessages)
    console.log(readUpdate)
    await props.patchNumRead(readUpdate)
  };

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <FormControl fullWidth hiddenLabel>
        <FilledInput
          classes={{ root: classes.input }}
          disableUnderline
          placeholder="Type something..."
          value={text}
          name="text"
          onChange={handleChange}
        />
      </FormControl>
    </form>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    postMessage: (message) => {
      dispatch(postMessage(message));
    },
    patchNumRead: (numRead, senderId) => {
      dispatch(patchNumRead(numRead, senderId))
    }
  };
};

export default connect(null, mapDispatchToProps)(Input);
