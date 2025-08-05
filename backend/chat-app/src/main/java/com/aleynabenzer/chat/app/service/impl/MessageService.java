package com.aleynabenzer.chat.app.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.aleynabenzer.chat.app.model.MessageEntity;
import com.aleynabenzer.chat.app.repos.MessageRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MessageService{
	private final MessageRepository messageRepo;
	private final ChatRoomService chatRoomService;

	public List<MessageEntity> getMessages(Integer senderId,Integer recipientId) {
		var chatId = chatRoomService.getChatRoomId(senderId, recipientId, false);
        return chatId.map(messageRepo::findByChatId).orElse(new ArrayList<>());
	}


	public MessageEntity addMessage(MessageEntity msg) {
        String chatId = chatRoomService
                .getChatRoomId(msg.getSenderId(), msg.getRecipientId(), true);
        msg.setChatId(chatId);
        messageRepo.save(msg);
		return msg;
	}

}
