package com.aleynabenzer.chat.app.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class LoginDto {
	@Email
	@Size(min=6, max=30)
	private String email;
	private String password;
}
