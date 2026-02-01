package com.aleynabenzer;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import com.aleynabenzer.chat.app.ChatAppApplication;

@SpringBootTest(classes = ChatAppApplication.class)	//expicitly specify the application class bc the package names do not match
class ChatAppApplicationTests {

	@Test
	void contextLoads() {
	}

}
