package com.aleynabenzer.chat.app.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aleynabenzer.chat.app.dto.MassMessageDto;
import com.aleynabenzer.chat.app.model.MessageEntity;
import com.aleynabenzer.chat.app.repos.MessageRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MessageService{
	private final MessageRepository messageRepository;
    private final ChatRoomService chatRoomService;

    public MessageEntity addMessage(MessageEntity chatMessage,Integer loggedInUserId) {
        var chatId = chatRoomService
                .getChatRoomId(loggedInUserId, chatMessage.getRecipientId(), true)
                .orElseThrow(); // You can create your own dedicated exception
        chatMessage.setChatId(chatId);
        messageRepository.save(chatMessage);
        return chatMessage;
    }

    public List<MessageEntity> findChatMessages(Integer senderId, Integer recipientId) {
        var chatId = chatRoomService.getChatRoomId(senderId, recipientId, false);
        return chatId.map(messageRepository::findByChatId).orElse(new ArrayList<>());
    }
    
    @Transactional
    public List<MessageEntity> sendMassMessage(MassMessageDto massMessage) {

        List<MessageEntity> messages = new ArrayList<>();

        for (Integer recipientId : massMessage.getRecipientIds()) {
            MessageEntity newMessage = new MessageEntity();
            Integer senderId = massMessage.getSenderId();
            newMessage.setContent(massMessage.getContent());
            newMessage.setSenderId(senderId);
            newMessage.setTimestamp(massMessage.getTimestamp());
            
            var chatId = chatRoomService
                    .getChatRoomId(senderId, recipientId, true).orElseThrow();;
            newMessage.setChatId(chatId);
            newMessage.setRecipientId(recipientId);
            messages.add(newMessage);
        }

        return messageRepository.saveAll(messages);
    }

}
