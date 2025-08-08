package com.aleynabenzer.chat.app.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class MessageNotifDto {
    private Integer id;
    private Integer senderId;
    private Integer recipientId;
    private String content;
}
