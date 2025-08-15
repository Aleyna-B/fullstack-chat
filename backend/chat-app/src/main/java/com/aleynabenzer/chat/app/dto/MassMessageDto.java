package com.aleynabenzer.chat.app.dto;

import java.util.Date;

import lombok.Data;

@Data
public class MassMessageDto {
	private Integer senderId;
    private String content;
    private Date timestamp;

}
