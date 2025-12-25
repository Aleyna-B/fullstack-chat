package com.aleynabenzer.chat.app.service;

import com.aleynabenzer.chat.app.dto.JwtTokenDto;
import com.aleynabenzer.chat.app.dto.LoginDto;
import com.aleynabenzer.chat.app.dto.RegisterDto;


public interface IAuthService {
	JwtTokenDto giris(LoginDto loginDTO);
	RegisterDto kaydet(RegisterDto kayitDTO);
}
