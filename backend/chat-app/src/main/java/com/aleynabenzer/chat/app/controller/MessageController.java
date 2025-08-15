package com.aleynabenzer.chat.app.controller;

import java.security.Principal;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.aleynabenzer.chat.app.dto.MassMessageDto;
import com.aleynabenzer.chat.app.dto.MessageNotifDto;
import com.aleynabenzer.chat.app.model.MessageEntity;
import com.aleynabenzer.chat.app.model.UserEntity;
import com.aleynabenzer.chat.app.service.impl.MessageService;
import com.aleynabenzer.chat.app.service.impl.UserService;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class MessageController {
	private final SimpMessagingTemplate messagingTemplate;
	private final MessageService chatMessageService;
	private final ModelMapper modelMapper;
	private final UserService userService;

	@MessageMapping("/chat")
	public void processMessage(@Payload MessageEntity message, Principal principal) {
		String email = principal.getName();
		UserEntity sender = userService.getByEmail(email);
		message.setSenderId(sender.getId());

		MessageEntity savedMsg = chatMessageService.addMessage(message, sender.getId());

		messagingTemplate.convertAndSendToUser(String.valueOf(message.getRecipientId()), "/queue/messages",
				modelMapper.map(savedMsg, MessageNotifDto.class));
	}

	@MessageMapping("/massChat")
	public void massMessage(@Payload MassMessageDto message, Principal principal) {
		String email = principal.getName();
		UserEntity sender = userService.getByEmail(email);
		message.setSenderId(sender.getId());

		List<MessageEntity> savedMsgs = chatMessageService.sendMassMessage(message);

		savedMsgs.forEach(
				msg -> messagingTemplate.convertAndSendToUser(msg.getRecipientId().toString(), 
						"/queue/messages",modelMapper.map(msg, MessageNotifDto.class)));
	}

	@GetMapping("/messages/{recipientId}") /// chat/v1/messages/{recipientId}
	public ResponseEntity<List<MessageEntity>> findChatMessages(@AuthenticationPrincipal UserEntity loggedInUser,
			@PathVariable("recipientId") Integer recipientId) {
		return ResponseEntity.ok(chatMessageService.findChatMessages(loggedInUser.getId(), recipientId));
	}

}
