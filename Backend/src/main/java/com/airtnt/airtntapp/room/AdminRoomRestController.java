package com.airtnt.airtntapp.room;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.airtnt.airtntapp.response.StandardJSONResponse;
import com.airtnt.airtntapp.response.success.OkResponse;
import com.airtnt.airtntapp.room.dto.page.listings.RoomListingsDTO;
import com.airtnt.airtntapp.room.response.RoomsOwnedByUserResponseEntity;
import com.airtnt.entity.Room;

@RestController
@RequestMapping("/api/admin/")
public class AdminRoomRestController {
    @Autowired
    private RoomService roomService;

    @GetMapping("rooms")
    public ResponseEntity<StandardJSONResponse<RoomsOwnedByUserResponseEntity>> fetchUserOwnedRooms(
            @RequestParam("page") int page,
            @RequestParam(value = "keyword", required = false) String keyword) {
        Page<Room> roomsPage = roomService.getAllRooms(page, keyword);

        List<RoomListingsDTO> roomListingsDTOs = new ArrayList<>();
        RoomsOwnedByUserResponseEntity roomsOwnedByUserResponseEntity = new RoomsOwnedByUserResponseEntity();

        for (Room room : roomsPage.getContent()) {
            roomListingsDTOs.add(RoomListingsDTO.buildRoomListingsDTO(room));
            // redisTemplate.opsForHash().put("ROOM", room.getId().toString(),
            // RoomListingsDTO.buildRoomListingsDTO(room));
        }

        // if (redisTemplate.opsForHash().get("TOTAL_PAGES", "TOTAL_PAGES") != null) {
        // roomListingsDTOs = redisTemplate.opsForHash().values("ROOM");

        // roomsOwnedByUserResponseEntity.setRooms(roomListingsDTOs);
        // roomsOwnedByUserResponseEntity
        // .setTotalPages((int) redisTemplate.opsForHash().get("TOTAL_PAGES",
        // "TOTAL_PAGES"));
        // roomsOwnedByUserResponseEntity
        // .setTotalRecords((long) redisTemplate.opsForHash().get("TOTAL_ELS",
        // "TOTAL_ELS"));
        // } else {

        // redisTemplate.opsForHash().put("TOTAL_PAGES", "TOTAL_PAGES", (Integer)
        // roomsPage.getTotalPages());
        // redisTemplate.opsForHash().put("TOTAL_ELS", "TOTAL_ELS", (Long)
        // roomsPage.getTotalElements());

        roomsOwnedByUserResponseEntity.setRooms(roomListingsDTOs);
        roomsOwnedByUserResponseEntity.setTotalPages(roomsPage.getTotalPages());
        roomsOwnedByUserResponseEntity.setTotalRecords(roomsPage.getTotalElements());

        return new OkResponse<RoomsOwnedByUserResponseEntity>(roomsOwnedByUserResponseEntity).response();

    }
}
