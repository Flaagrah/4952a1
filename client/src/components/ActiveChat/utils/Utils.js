export const readUpdateMessage = (props, numMessages = -1) =>{
    const { conversation, user } = props;
    return {
        conversationId: conversation ? conversation.id : undefined,
        numRead: numMessages >= 0 ? numMessages : conversation.messages.length,
        senderId: user ? user.id : undefined
    }
}