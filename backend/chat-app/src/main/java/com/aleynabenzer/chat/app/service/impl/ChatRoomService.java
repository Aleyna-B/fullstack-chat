package com.aleynabenzer.chat.app.service.impl;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.aleynabenzer.chat.app.model.ChatRoomEntity;
import com.aleynabenzer.chat.app.repos.ChatRoomRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatRoomService{

	private final ChatRoomRepository roomRepo;

	public String addChatRoom(Integer senderId,Integer recipientId) {
		var chatId = String.format("%s_%s", senderId, recipientId);

        ChatRoomEntity senderRecipient = ChatRoomEntity
                .builder()
                .chatId(chatId)
                .senderId(senderId)
                .recipientId(recipientId)
                .build();

        ChatRoomEntity recipientSender = ChatRoomEntity
                .builder()
                .chatId(chatId)
                .senderId(recipientId)
                .recipientId(senderId)
                .build();

        roomRepo.save(senderRecipient);
        roomRepo.save(recipientSender);

        return chatId;		
	}

    public String getChatRoomId(Integer senderId,Integer recipientId,
            boolean createNewRoomIfNotExists
    ) {
        return roomRepo
                .findBySenderIdAndRecipientId(senderId, recipientId)
                .map(ChatRoomEntity::getChatId)
                .or(() -> {
                    if(createNewRoomIfNotExists) {
                        var chatId = addChatRoom(senderId, recipientId);
                        return Optional.of(chatId);
                    }

                    return  Optional.empty();
                });
    }

}
