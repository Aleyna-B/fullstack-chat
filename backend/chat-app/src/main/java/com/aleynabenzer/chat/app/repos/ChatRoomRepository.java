package com.aleynabenzer.chat.app.repos;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aleynabenzer.chat.app.model.ChatRoomEntity;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoomEntity,Integer>{
	 Optional<ChatRoomEntity> findBySenderIdAndRecipientId(Integer senderId, Integer recipientId);
	 List<ChatRoomEntity> findBySenderId(Integer senderId);
}
