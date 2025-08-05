package com.aleynabenzer.chat.app.repos;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aleynabenzer.chat.app.model.ChatRoomEntity;

public interface ChatRoomRepository extends JpaRepository<ChatRoomEntity,Integer>{
	 Optional<ChatRoomEntity> findBySenderIdAndRecipientId(Integer senderId, Integer recipientId);
}
