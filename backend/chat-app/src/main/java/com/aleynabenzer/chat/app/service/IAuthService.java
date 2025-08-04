package com.aleynabenzer.chat.app.service;

import com.aleynabenzer.chat.app.dto.JwtTokenDto;
import com.aleynabenzer.chat.app.dto.LoginDto;

public interface IAuthService {
	JwtTokenDto giris(LoginDto loginDTO);
}
