package com.aleynabenzer.chat.app.enums;

public enum Status {
	ONLINE("status.online"),
	OFFLINE("status.offline");

	private final String status;
	private Status(String status) {
		this.status = status;
	}
	public String getStatus() {
		return this.status;
	}
}
