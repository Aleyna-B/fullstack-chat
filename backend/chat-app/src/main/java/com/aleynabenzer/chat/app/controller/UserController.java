package com.aleynabenzer.chat.app.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.aleynabenzer.chat.app.dto.UserDto;
import com.aleynabenzer.chat.app.model.UserEntity;
import com.aleynabenzer.chat.app.service.UserReadable;
import com.aleynabenzer.chat.app.service.UserWritable;
import com.aleynabenzer.chat.app.service.impl.UserService;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor 
public class UserController {
	private final UserReadable userReadableService;
	private final UserWritable userWritableService;
	private final UserService userService;
	private final ModelMapper modelMapper;
	
    @GetMapping("/usersInfo")		//chat/v1/usersInfo
    public ResponseEntity<List<UserEntity>> getAllUsersInfo() {
        return ResponseEntity.ok(userReadableService.getList());
    }
    
    @GetMapping("/users")		//chat/v1/users		jwt bilgileri gelmesin
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userReadableService.getList().stream()
        		.map(user -> modelMapper.map(user, UserDto.class))
        		.collect(Collectors.toList()));
    }
    
    @MessageMapping("/user.disconnectUser")	///app/user.disconnectUser
    @SendTo("/user/public")
    public UserEntity disconnectUser(@Payload UserEntity user) {
        userService.disconnect(user);
        return user;
    }
    
    @GetMapping("/{id}")
    public void deleteUser(@PathVariable("id") Integer id) {
    	/////DISCONNECT	/////
    	userWritableService.remove(id);
    }
    
}

