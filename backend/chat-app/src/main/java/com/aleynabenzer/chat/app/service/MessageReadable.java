package com.aleynabenzer.chat.app.service;

import java.util.List;

import com.aleynabenzer.chat.app.model.MessageEntity;

public interface MessageReadable extends Readable<MessageEntity,Integer>{

	List<MessageEntity> getList(Integer senderId, Integer recipientId);

}
