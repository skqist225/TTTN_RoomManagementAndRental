package com.airtnt.airtntapp.bookingDetail;

import com.airtnt.airtntapp.booking.BookedDateDTO;
import com.airtnt.airtntapp.exception.BookingDetailNotFoundException;
import com.airtnt.airtntapp.exception.ConstrainstViolationException;
import com.airtnt.entity.BookingDetail;
import com.airtnt.entity.Room;
import com.airtnt.entity.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class BookingDetailService {
    public final int MAX_BOOKING_PER_FETCH_BY_HOST = 10;
    public final int BOOKINGS_PER_PAGE = 10;
    private final String DELETE_SUCCESSFULLY = "Delete Booking Detail Successfully";
    private final String DELETE_FORBIDDEN = "Could not delete this booking detail";


    @Autowired
    private BookingDetailRepository bookingDetailRepository;

    public BookingDetail findById(Integer bookingDetailId) throws BookingDetailNotFoundException {
        Optional<BookingDetail> bookingDetail = bookingDetailRepository.findById(bookingDetailId);
        if (bookingDetail.isPresent()) {
            return bookingDetail.get();
        }

        throw new BookingDetailNotFoundException("Could not find booking detail with id : " + bookingDetailId);
    }

    public Page<BookingDetail> getAllBookingDetails(int pageNum, String keyword) {
        Pageable pageable = PageRequest.of(pageNum - 1, BOOKINGS_PER_PAGE);
        return bookingDetailRepository.findAll(pageable);
    }

    public BookingDetail save(BookingDetail bookingDetail) {
        return bookingDetailRepository.save(bookingDetail);
    }

    public boolean isBooked(Date checkinDate, Date checkoutDate, Integer roomId) throws ParseException {
        List<BookingDetail> bookingDetails = bookingDetailRepository.getBookedDates(roomId, Status.APPROVED);

        boolean isBooked = false;
        for (BookingDetail bookingDetail : bookingDetails) {
            Date cid = bookingDetail.getCheckinDate();
            Date cod = bookingDetail.getCheckoutDate();

            if ((checkinDate.compareTo(cid) >= 0 && checkinDate.compareTo(cod) <= 0)
                    || (checkoutDate.compareTo(cid) >= 0 && checkoutDate.compareTo(cod) <= 0)) {
                isBooked = true;
                break;
            }

            if ((cid.compareTo(checkinDate) >= 0 && cid.compareTo(checkoutDate) <= 0)
                    || (cod.compareTo(checkinDate) >= 0 && cod.compareTo(checkoutDate) <= 0)) {
                isBooked = true;
                break;
            }
        }

        return isBooked;
    }

    public boolean isBookedByUser(Date checkinDate, Date checkoutDate, Integer roomId, Integer customerId) {
		return bookingDetailRepository.isBookedByUser(checkinDate, checkoutDate, roomId, customerId).size() > 0;
    }

    public List<BookedDateDTO> getBookedDates(Room room) throws ParseException {
        List<BookedDateDTO> bookedDates = new ArrayList<>();
        List<BookingDetail> bookings = new ArrayList<>();
        Iterator<BookingDetail> bookingsItr = bookingDetailRepository.findByRoom(room).iterator();
        bookingsItr.forEachRemaining(bookings::add);

        for (int i = 0; i < bookings.size(); i++) {
            Date checkinDate = bookings.get(i).getCheckinDate();
            Date checkoutDate = bookings.get(i).getCheckoutDate();
//            LocalDateTime cancelDate = bookings.get(i).getCancelDate();
            LocalDateTime cancelDate =  LocalDateTime.now();

            if (checkinDate != null & checkoutDate != null && cancelDate == null) {
                String[] checkinDate2 = checkinDate.toString().split("T")[0].split(" ")[0].split("-");
                String[] checkoutDate2 = checkoutDate.toString().split("T")[0].split(" ")[0].split("-");

                bookedDates.add(new BookedDateDTO(checkinDate2[2] + "/" + checkinDate2[1] + "/" + checkinDate2[0],
                        checkoutDate2[2] + "/" + checkoutDate2[1] + "/" + checkoutDate2[0]));
            }
        }
        return bookedDates;
    }

    public List<BookingDetail> getBookingDetailsByRoom(Room room) {
        return bookingDetailRepository.findByRoom(room);
    }

    public List<BookingDetail> getBookingDetailsByRooms(Integer[] rooms, LocalDateTime startDate, LocalDateTime endDate) {
        return bookingDetailRepository.getBookingDetailsByRooms(rooms, startDate, endDate);
    }

    public List<BookingDetail> getBookingDetailsByRooms(Integer[] roomIds) {
        return bookingDetailRepository.getBookingDetailsByRooms(roomIds);
    }

    public List<BookingDetail> getBookingDetailsByUser(Integer customerId, String query) {
        return bookingDetailRepository.getByCustomer(customerId, query);
    }

//    public List<BookedRoomDTO> getBookedRoomsByUser(Integer customerId, String query) {
//        List<BookingDetail> bookings = bookingDetailRepository.getBookedRoomsByUser(customerId, query);
//        List<BookedRoomDTO> bookedRoomDTOs = new ArrayList<>();
//        for (BookingDetail booking : bookings)
//            bookedRoomDTOs.add(BookedRoomDTO.build(booking));
//        return bookedRoomDTOs;
//    }

    public String deleteById(Integer id) throws ConstrainstViolationException {
        try {
            bookingDetailRepository.deleteById(id);
            return DELETE_SUCCESSFULLY;
        } catch (Exception ex) {
            throw new ConstrainstViolationException(DELETE_FORBIDDEN);
        }
    }

    public Page<BookingDetail> listByPage(int pageNum, String sortField, String sortDir, String keyword) {
        Sort sort = Sort.by(sortField);

        sort = sortDir.equals("asc") ? sort.ascending() : sort.descending();

        Pageable pageable = PageRequest.of(pageNum - 1, BOOKINGS_PER_PAGE, sort);

        if (keyword != null) {
            return bookingDetailRepository.findAllAdmin(keyword, pageable);
        }

        return bookingDetailRepository.findAll(pageable);
    }

}
