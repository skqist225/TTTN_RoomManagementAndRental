package com.airtnt.airtntapp.chat;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.airtnt.airtntapp.chat.dto.ChatReceiverDTO;

import com.airtnt.airtntapp.exception.UserNotFoundException;
import com.airtnt.airtntapp.response.StandardJSONResponse;
import com.airtnt.airtntapp.response.error.BadResponse;
import com.airtnt.airtntapp.response.success.OkResponse;
import com.airtnt.airtntapp.security.UserDetailsImpl;
import com.airtnt.airtntapp.user.UserService;
import com.airtnt.entity.Chat;
import com.airtnt.entity.User;

@RestController
@RequestMapping("/api/chat")
public class ChatRestController {

	@Autowired
	private ChatService chatService;

	@Autowired
	private UserService userService;

	@GetMapping("user")
	public ResponseEntity<StandardJSONResponse<List<Chat>>> fetchSenderChat(
			@AuthenticationPrincipal UserDetailsImpl userDetailsImpl) {
		User sender = userDetailsImpl.getUser();
		List<Chat> chats = chatService.findBySender(sender);
		return new OkResponse<List<Chat>>(chats).response();

	}

	@GetMapping("receivers")
	public ResponseEntity<StandardJSONResponse<List<ChatReceiverDTO>>> fetchAllReceivers(
			@AuthenticationPrincipal UserDetailsImpl userDetailsImpl) {
		User sender = userDetailsImpl.getUser();
		List<ChatReceiverDTO> chats = chatService.findAllReceiversBySender(sender);
		return new OkResponse<List<ChatReceiverDTO>>(chats).response();

	}

	@GetMapping("receiver/{receiverid}")
	public ResponseEntity<StandardJSONResponse<List<Chat>>> fetchInboxWithReceiver(
			@AuthenticationPrincipal UserDetailsImpl userDetailsImpl,
			@PathVariable("receiverid") Integer receiverId) {
		try {
			User sender = userDetailsImpl.getUser();
			User receiver = userService.findById(receiverId);
			List<Chat> chats = chatService.findBySenderAndReceiver(sender, receiver);
			return new OkResponse<List<Chat>>(chats).response();
		} catch (UserNotFoundException e) {
			return new BadResponse<List<Chat>>(e.getMessage()).response();
		}

	}
}
