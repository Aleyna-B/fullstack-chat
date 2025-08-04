package com.aleynabenzer.chat.app.service;

public interface Writable<T,ID> {
	void add(T entity);
	void change(ID id, T entity);
	void remove(ID id);

}
