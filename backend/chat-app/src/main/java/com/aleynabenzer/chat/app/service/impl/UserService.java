package com.aleynabenzer.chat.app.service.impl;

import java.util.List;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.aleynabenzer.chat.app.enums.Status;
import com.aleynabenzer.chat.app.model.UserEntity;
import com.aleynabenzer.chat.app.repos.UserRepository;
import com.aleynabenzer.chat.app.service.UserReadable;
import com.aleynabenzer.chat.app.service.UserWritable;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor			
public class UserService implements UserDetailsService,UserReadable,UserWritable{

	private final UserRepository userRepo;
	private final PasswordEncoder encoder;
	
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		return userRepo.findByEmail(username).orElseThrow(()-> new UsernameNotFoundException(username));
	}
	
	@Override
	public List<UserEntity> getList() {
		return userRepo.findByDeletedFalse();
	}

	@Override
	public UserEntity getById(Integer id) {
		return userRepo.findById(id).orElseThrow(()-> new IllegalArgumentException());
	}
	
	public UserEntity getByEmail(String email) {
		
		return userRepo.findByEmail(email).orElseThrow(()-> new UsernameNotFoundException(email));
	}

	@Override
	public void add(UserEntity entity) {
		userRepo.save(entity);
		
	}
	
    public void disconnect(UserEntity storedUser) {
		//UserEntity storedUser = userRepo.findById(id).orElseThrow(()-> new IllegalArgumentException());
        if (storedUser != null) {
            storedUser.setStatus(Status.OFFLINE);
            userRepo.save(storedUser);
        }
    }

    public List<UserEntity> findConnectedUsers() {
        return userRepo.findAllByStatus(Status.ONLINE);
    }

	@Override
	public void change(Integer id, UserEntity entity) {
		// TODO Auto-generated method stub		
	}

	@Override
	public void remove(Integer id) {
		UserEntity userToDelete = userRepo.findById(id).orElseThrow(()-> new IllegalArgumentException());
		userToDelete.setDeleted(true);
		userRepo.save(userToDelete);
		
	}

}
