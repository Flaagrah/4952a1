import io from "socket.io-client";
import { readUpdateMessage } from "./components/ActiveChat/utils/Utils";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
  setReadUpdate
} from "./store/conversations";
import { patchNumRead } from "./store/utils/thunkCreators";

const socket = io(window.location.origin);

socket.on("connect", () => {
  console.log("connected to server");

  socket.on("add-online-user", (id) => {
    store.dispatch(addOnlineUser(id));
  });

  socket.on("remove-offline-user", (id) => {
    store.dispatch(removeOfflineUser(id));
  });
  socket.on("new-message", (data) => {
    let state = store.getState()
    store.dispatch(setNewMessage(data.message, data.sender, state.activeConversation));
    state = store.getState()
    const convoId = data.message.conversationId
    state.conversations.forEach((convo)=>{
      if (convo.id != convoId) {
        return
      }
      //THIS SHOULD BE COMPARING ID INSTEAD OF USERNAME BUT I'M FOLLOWING WHAT'S DONE IN THE CODE BASE
      if (convo.otherUser.username == state.activeConversation) {
        console.log(convo, state.user)
        const readUpdate = readUpdateMessage({conversation: convo, user: state.user})
        store.dispatch(patchNumRead(readUpdate))
      }
    })
  });
  socket.on("read-last", (data) => {
    console.log(data)
    store.dispatch(setReadUpdate(data.numRead, data.senderId, data.conversationId));
  });
});

export default socket;
