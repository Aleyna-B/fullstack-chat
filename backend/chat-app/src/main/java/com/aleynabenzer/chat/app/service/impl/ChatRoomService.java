package com.aleynabenzer.chat.app.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.aleynabenzer.chat.app.model.ChatRoomEntity;
import com.aleynabenzer.chat.app.model.UserEntity;
import com.aleynabenzer.chat.app.repos.ChatRoomRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatRoomService{

	private final ChatRoomRepository chatRoomRepository;
	private final UserService userServ;

    public Optional<String> getChatRoomId(Integer senderId,Integer recipientId,
            boolean createNewRoomIfNotExists
    ) {
        return chatRoomRepository
                .findBySenderIdAndRecipientId(senderId, recipientId)
                .map(ChatRoomEntity::getChatId)
                .or(() -> {
                    if(createNewRoomIfNotExists) {
                        var chatId = createChatId(senderId, recipientId);
                        return Optional.of(chatId);
                    }

                    return  Optional.empty();
                });
    }

    private String createChatId(Integer senderId, Integer recipientId) {
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

        chatRoomRepository.save(senderRecipient);
        chatRoomRepository.save(recipientSender);

        return chatId;
    }
    
    public List<UserEntity> findPreviousChats(Integer senderId){
    	List<Integer> recipientIds = chatRoomRepository.findBySenderId(senderId).stream()
                .map(ChatRoomEntity::getRecipientId)
                .collect(Collectors.toList());

        return recipientIds.stream()
                .map(userServ::getById)
                .collect(Collectors.toList());
    	
    }
}
