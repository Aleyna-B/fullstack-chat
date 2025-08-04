package com.aleynabenzer.chat.app.dto;
import lombok.Data;

@Data
public class JwtTokenDto {
	private String token;
	private String refreshToken;

}
