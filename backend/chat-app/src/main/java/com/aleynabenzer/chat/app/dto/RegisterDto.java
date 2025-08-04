package com.aleynabenzer.chat.app.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterDto {
	@Email
	@Size(min=6, max=30)
	private String email;
	@Size(min=2,max=40)
	private String name;
	private String password;
}
