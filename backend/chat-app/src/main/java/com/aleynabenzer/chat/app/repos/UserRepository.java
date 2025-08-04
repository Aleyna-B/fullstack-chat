package com.aleynabenzer.chat.app.repos;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aleynabenzer.chat.app.enums.Status;
import com.aleynabenzer.chat.app.model.UserEntity;

@Repository
public interface UserRepository extends JpaRepository<UserEntity,Integer>{
	Optional<UserEntity> findByEmail(String email);	
	boolean existsByEmail(String email);
	List<UserEntity> findByDeletedFalse();
	List<UserEntity> findAllByStatus(Status status);

}
