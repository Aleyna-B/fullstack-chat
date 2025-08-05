package com.aleynabenzer.chat.app.repos;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aleynabenzer.chat.app.model.MessageEntity;

public interface MessageRepository extends JpaRepository<MessageEntity,Integer>{
	List<MessageEntity> findByChatId(String chatId);
}
