package com.aleynabenzer.chat.app.controller;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.aleynabenzer.chat.app.dto.MessageNotifDto;
import com.aleynabenzer.chat.app.model.MessageEntity;
import com.aleynabenzer.chat.app.service.impl.MessageService;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class MessageController {
	private final SimpMessagingTemplate messagingTemplate;
    private final MessageService chatMessageService;
    private final ModelMapper modelMapper;

    @MessageMapping("/chat")
    public void processMessage(@Payload MessageEntity message) {
        MessageEntity savedMsg = chatMessageService.addMessage(message);
        
        messagingTemplate.convertAndSendToUser(
        		String.valueOf(message.getRecipientId()), "/queue/messages",
                modelMapper.map(savedMsg, MessageNotifDto.class)
        );
    }

    @GetMapping("/messages/{senderId}/{recipientId}") ///chat/v1/messages/{senderId}/{recipientId}
    public ResponseEntity<List<MessageEntity>> findChatMessages(@PathVariable("senderId") Integer senderId,
                                                 @PathVariable("recipientId") Integer recipientId) {
        return ResponseEntity
                .ok(chatMessageService.findChatMessages(senderId, recipientId));
    }

}
