export const readUpdateMessage = (props, numMessages = -1) =>{
    console.log(props)
    const { conversation, user } = props;
    console.log(conversation, user)
    return {
        conversationId: conversation.id,
        numRead: numMessages >= 0 ? numMessages : conversation.messages.length,
        senderId: user.id
    }
}