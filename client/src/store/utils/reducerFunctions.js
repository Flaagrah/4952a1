const addMessage = (convo, message)=>{
  const newMessages = [...convo.messages, message]
  const newConvo = {...convo, messages: newMessages}
  newConvo.latestMessageText = message.text;
  return newConvo
}

export const addMessageToStore = (state, payload) => {
  const { message, sender, activeConversation } = payload;
  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
    };
    newConvo.latestMessageText = message.text;
    return [newConvo, ...state];
  }

  return state.map((convo) => {
    if (convo.id === message.conversationId) {
      const newConvo = addMessage(convo, message)
      if (activeConversation == newConvo.otherUser.username) {
        newConvo.thisUserNumRead = newConvo.messages.length
      }
      return newConvo
    } else {
      return convo
    }
  });
};

export const updateReadValue = (state, payload) => {
  const { numRead, senderId, conversationId } = payload
  return state.map((convo)=>{
    if (conversationId != convo.id) {
      return convo
    }
    if (convo.otherUser.id === senderId) {
      return {...convo, otherUserNumRead: numRead}
    } else {
      return {...convo, thisUserNumRead: numRead}
    }
  })
} 

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser = { ...convoCopy.otherUser, online: true };
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser = { ...convoCopy.otherUser, online: false };
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [] };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      const newConvo = addMessage(convo, message)
      newConvo.id = message.conversationId;
      return newConvo;
    } else {
      return convo;
    }
  });
};
