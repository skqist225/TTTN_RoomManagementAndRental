package com.airtnt.airtntapp.booking;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.airtnt.airtntapp.booking.dto.BookingListDTO;
import com.airtnt.airtntapp.booking.dto.BookingListResponse;
import com.airtnt.airtntapp.response.StandardJSONResponse;
import com.airtnt.airtntapp.response.success.OkResponse;
import com.airtnt.entity.Booking;

@RestController
@RequestMapping("/api/admin/")
public class AdminBookingRestController {
    @Autowired
    private BookingService bookingService;

    @GetMapping("bookings")
    public ResponseEntity<StandardJSONResponse<BookingListResponse>> getAllBookings(@RequestParam("page") int page,
            @RequestParam(value = "keyword", required = false) String keyword) {
        Page<Booking> bookingsPage = bookingService.getAllBookings(page, keyword);

        List<BookingListDTO> bookingListingsDTOs = new ArrayList<>();
        BookingListResponse bookingListResponse = new BookingListResponse();

        for (Booking booking : bookingsPage.getContent()) {
            bookingListingsDTOs.add(BookingListDTO.build(booking));
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

        bookingListResponse.setBookings(bookingListingsDTOs);
        bookingListResponse.setTotalPages(bookingsPage.getTotalPages());
        bookingListResponse.setTotalElements(bookingsPage.getTotalElements());

        return new OkResponse<BookingListResponse>(bookingListResponse).response();
    }
}
