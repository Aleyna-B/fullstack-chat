package com.aleynabenzer.chat.app.dto;

import com.aleynabenzer.chat.app.enums.Status;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserDto {
	private Integer id;
	@Size(min=2,max=60)
	private String name;
	@Email
	@Size(min=6, max=40)
	private String email;
	private boolean deleted;	
	@Enumerated(EnumType.STRING)
	private Status status;
}
