import axios from "axios";
import socket from "../../socket";
import {
  gotConversations,
  addConversation,
  setNewMessage,
  setSearchedUsers,
  setReadUpdate
} from "../conversations";
import { gotUser, setFetchingStatus } from "../user";

axios.interceptors.request.use(async function (config) {
  const token = await localStorage.getItem("messenger-token");
  config.headers["x-access-token"] = token;

  return config;
});

// USER THUNK CREATORS

export const fetchUser = () => async (dispatch) => {
  dispatch(setFetchingStatus(true));
  try {
    const { data } = await axios.get("/auth/user");
    dispatch(gotUser(data));
    if (data.id) {
      socket.emit("go-online", data.id);
    }
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(setFetchingStatus(false));
  }
};

export const register = (credentials) => async (dispatch) => {
  try {
    const { data } = await axios.post("/auth/register", credentials);
    await localStorage.setItem("messenger-token", data.token);
    dispatch(gotUser(data));
    socket.emit("go-online", data.id);
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || "Server Error" }));
  }
};

export const login = (credentials) => async (dispatch) => {
  try {
    const { data } = await axios.post("/auth/login", credentials);
    await localStorage.setItem("messenger-token", data.token);
    dispatch(gotUser(data));
    socket.emit("go-online", data.id);
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || "Server Error" }));
  }
};

export const logout = (id) => async (dispatch) => {
  try {
    await axios.delete("/auth/logout");
    await localStorage.removeItem("messenger-token");
    dispatch(gotUser({}));
    socket.emit("logout", id);
  } catch (error) {
    console.error(error);
  }
};

// CONVERSATIONS THUNK CREATORS

export const fetchConversations = () => async (dispatch) => {
  try {
    const { data } = await axios.get("/api/conversations");
    dispatch(gotConversations(data));
  } catch (error) {
    console.error(error);
  }
};

const readUpdate = async (body) => {
  const { data } = await axios.patch("/api/messages/readupdate", body);
  return data;
};

const sendReadUpdate = (data, body) => {
  socket.emit("read-last", {
    numRead: data.numRead,
    senderId: body.senderId,
    conversationId: body.conversationId
  });
};

const saveMessage = async (body) => {
  const { data } = await axios.post("/api/messages", body);
  return data;
};

const sendMessage = (data, body) => {
  socket.emit("new-message", {
    message: data.message,
    recipientId: body.recipientId,
    sender: data.sender,
  });
};

export const patchNumRead = (body) => async (dispatch) => {
  try {
    const data = await readUpdate(body);

    if (body.conversationId) {
      dispatch(setReadUpdate(data.numRead, body.senderId, body.conversationId));
    }

    sendReadUpdate(data, body);
  } catch (error) {
    console.error(error);
  }
};

// message format to send: {recipientId, text, conversationId}
// conversationId will be set to null if its a brand new conversation
export const postMessage = (body) => async (dispatch) => {
  try {
    const data = await saveMessage(body);

    if (!body.conversationId) {
      dispatch(addConversation(body.recipientId, data.message));
    } else {
      dispatch(setNewMessage(data.message, undefined, body.activeConversation));
    }

    sendMessage(data, body);
    return data
  } catch (error) {
    console.error(error);
  }
};

export const sendReadLastMessage = (state, data, readUpdateMessage)=> async (dispatch) => {
  const convoId = data.message.conversationId
  state.conversations.forEach((convo)=>{
    if (convo.id != convoId) {
      return
    }
    //THIS SHOULD BE COMPARING ID INSTEAD OF USERNAME BUT I'M FOLLOWING WHAT'S DONE IN THE CODE BASE
    if (convo.otherUser.username == state.activeConversation) {
      const readUpdate = readUpdateMessage({conversation: convo, user: state.user})
      dispatch(patchNumRead(readUpdate))
    }
  })
}

export const searchUsers = (searchTerm) => async (dispatch) => {
  try {
    const { data } = await axios.get(`/api/users/${searchTerm}`);
    dispatch(setSearchedUsers(data));
  } catch (error) {
    console.error(error);
  }
};
