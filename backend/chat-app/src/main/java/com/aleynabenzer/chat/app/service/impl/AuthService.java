package com.aleynabenzer.chat.app.service.impl;

import java.util.HashMap;

import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.aleynabenzer.chat.app.dto.JwtTokenDto;
import com.aleynabenzer.chat.app.dto.LoginDto;
import com.aleynabenzer.chat.app.dto.RegisterDto;
import com.aleynabenzer.chat.app.enums.Status;
import com.aleynabenzer.chat.app.model.UserEntity;
import com.aleynabenzer.chat.app.service.IAuthService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService implements IAuthService {

	private final AuthenticationManager authenticationManager;
	private final UserService userService;
	private final JwtUtilsService jwtUtilsService;
	private final ModelMapper mapper;
	private final PasswordEncoder passwordEncoder;

	@Override
	public JwtTokenDto giris(LoginDto loginDto) {
		JwtTokenDto tokenDto = new JwtTokenDto();

		try {
			authenticationManager
					.authenticate(new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassword()));

			UserEntity user = userService.getByEmail(loginDto.getEmail());

			String token = jwtUtilsService.generateToken(user);
			String refreshToken = jwtUtilsService.generateRefreshToken(new HashMap<>(), user);

			tokenDto.setToken(token);
			tokenDto.setRefreshToken(refreshToken);
			user.setStatus(Status.ONLINE);
			userService.add(user);
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}

		return tokenDto;
	}
	
	public RegisterDto kaydet(RegisterDto kayitDTO){
		
		UserEntity user = mapper.map(kayitDTO,UserEntity.class);
		
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		user.setStatus(Status.OFFLINE);
		userService.add(user);
		
		RegisterDto kullaniciDTO = this.mapper.map(user, RegisterDto.class);
		
		return kullaniciDTO;
		
	}

}
