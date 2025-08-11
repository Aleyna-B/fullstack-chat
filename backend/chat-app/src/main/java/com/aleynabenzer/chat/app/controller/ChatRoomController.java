package com.aleynabenzer.chat.app.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import com.aleynabenzer.chat.app.dto.UserDto;
import com.aleynabenzer.chat.app.model.UserEntity;
import com.aleynabenzer.chat.app.service.impl.ChatRoomService;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class ChatRoomController {
	private final ChatRoomService chatRoomService;
	private final ModelMapper modelMapper;
	
	@GetMapping("/messages")
	public ResponseEntity<List<UserDto>> getConvos(@AuthenticationPrincipal UserEntity loggedInUser) {
	    List<UserEntity> users = chatRoomService.findPreviousChats(loggedInUser.getId());
	    
	    List<UserDto> userDtos = users.stream()
	        .map(user -> modelMapper.map(user, UserDto.class))
	        .collect(Collectors.toList());

	    return ResponseEntity.ok(userDtos);
	}


}
