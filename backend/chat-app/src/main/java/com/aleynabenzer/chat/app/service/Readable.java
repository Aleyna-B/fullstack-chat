package com.aleynabenzer.chat.app.service;

import java.util.List;

public interface Readable<T,ID> {
	List<T> getList();
	T getById(ID id);

}
