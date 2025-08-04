package com.aleynabenzer.chat.app.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aleynabenzer.chat.app.dto.JwtTokenDto;
import com.aleynabenzer.chat.app.dto.LoginDto;
import com.aleynabenzer.chat.app.dto.RegisterDto;
import com.aleynabenzer.chat.app.service.impl.AuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
	private final AuthService authService;
	
	@PostMapping("/signup")
	public ResponseEntity<RegisterDto> register(@RequestBody RegisterDto registerDto){
		return ResponseEntity.ok(authService.kaydet(registerDto));
	}
	
	@PostMapping("/signin")
	public ResponseEntity signin(@RequestBody LoginDto loginDto) {
		JwtTokenDto jwt = authService.giris(loginDto);
		
		if(jwt.getToken() == null) {
			return new ResponseEntity(jwt, HttpStatus.BAD_REQUEST);
		}
		
		return ResponseEntity.ok(jwt);
	}


}
