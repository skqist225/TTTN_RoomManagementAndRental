package com.airtnt.airtntapp.dashboard;


import com.airtnt.airtntapp.booking.BookingService;
import com.airtnt.airtntapp.dashboard.dto.CountCreatedRoomDTO;
import com.airtnt.airtntapp.dashboard.dto.DashboardNumberDTO;
import com.airtnt.airtntapp.response.StandardJSONResponse;
import com.airtnt.airtntapp.response.success.OkResponse;
import com.airtnt.airtntapp.room.RoomService;
import com.airtnt.airtntapp.user.UserService;
import com.airtnt.airtntapp.user.dto.CountUserByRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
public class DashboardRestController {
    @Autowired
    private BookingService bookingService;

    @Autowired
    private UserService userService;

    @Autowired
    private RoomService roomService;

    @GetMapping("statsCount")
    public ResponseEntity<StandardJSONResponse<DashboardNumberDTO>> statsCount() {
        return new OkResponse<>(new DashboardNumberDTO(bookingService.getCurrentMonthSale(), bookingService.countAllBookings(), roomService.getNumberOfRoom(), userService.getNumberOfUser())).response();
    }

    @GetMapping("getCreatedRoom")
    public ResponseEntity<StandardJSONResponse<CountCreatedRoomDTO>> getCreatedRoomByMonthAndYear() {
        return new OkResponse<>(roomService.getCreatedRoomByMonthAndYear(2022)).response();
    }

    @GetMapping("countUserByRole")
    public ResponseEntity<StandardJSONResponse<CountUserByRole>> countUserByRole() {
        return new OkResponse<>(userService.countUserByRole()).response();
    }
}
