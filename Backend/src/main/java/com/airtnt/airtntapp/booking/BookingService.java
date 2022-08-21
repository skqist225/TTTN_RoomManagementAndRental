package com.airtnt.airtntapp.booking;

import com.airtnt.airtntapp.booking.dto.CountBookingDTO;
import com.airtnt.airtntapp.booking.dto.CreateBookingDTO;
import com.airtnt.airtntapp.booking.dto.PostCreateBookingDetailDTO;
import com.airtnt.airtntapp.bookingDetail.BookingDetailService;
import com.airtnt.airtntapp.exception.*;
import com.airtnt.airtntapp.room.RoomService;
import com.airtnt.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class BookingService {

    public final int MAX_BOOKING_PER_FETCH_BY_HOST = 10;
    public final int BOOKINGS_PER_PAGE = 10;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private BookingDetailService bookingDetailService;

    @Autowired
    private RoomService roomService;

    public Booking findById(Integer bookingId) throws BookingNotFoundException {

        Optional<Booking> booking = bookingRepository.findById(bookingId);
        if (booking.isPresent()) {
            return booking.get();
        }

        throw new BookingNotFoundException("Could not find booking with id : " + bookingId);
    }

    public Booking save(Booking booking) {
        return bookingRepository.save(booking);
    }

    public List<Booking> findByCustomerAndState(User customer, Status status) {
        return bookingRepository.findByCustomerAndState(customer, status);
    }

    public List<Booking> findByCustomerAndCartStatus(User customer) {
        return bookingRepository.findByCustomerAndCartStatus(customer);
    }

    public List<Booking> findByCustomerAndBookedStatus(User customer) {
        return bookingRepository.findByCustomerAndBookedStatus(customer);
    }


    public boolean deleteById(Integer bookingId) throws BookingNotFoundException {
        try {
            bookingRepository.deleteById(bookingId);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public Page<Booking> getAllBookings(int pageNum, String type) {
        Pageable pageable = PageRequest.of(pageNum - 1, BOOKINGS_PER_PAGE);

        if (type.equals("ALL")) {
            return bookingRepository.findAll(pageable);
        }

        Status state = type.equals("APPROVED") ? Status.APPROVED : type.equals("PENDING") ? Status.PENDING : Status.CANCELLED;

        return bookingRepository.findAll(state, pageable);
    }

    public CountBookingDTO countBookingByState() {
        Integer numberOfApproved = bookingRepository.countBookingByState(Status.APPROVED);
        Integer numberOfPending = bookingRepository.countBookingByState(Status.PENDING);
        Integer numberOfCancelled = bookingRepository.countBookingByState(Status.CANCELLED);

        return new CountBookingDTO(numberOfApproved, numberOfPending, numberOfCancelled);
    }

    public Booking createBooking(CreateBookingDTO createBookingDTO, User customerUser
    ) throws ParseException, RoomHasBeenBookedException, UserHasBeenBookedThisRoomException, RoomNotFoundException, ReserveDateInThePastException {
        Set<BookingDetail> bookingDetails = new HashSet<>();

        LocalDateTime currentDate = LocalDateTime.now();
        for (PostCreateBookingDetailDTO bookingDetailDTO : createBookingDTO.getBookingDetails()) {
            SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy");
            Date checkinDate = sdf.parse(bookingDetailDTO.getCheckinDate());
            Date checkoutDate = sdf.parse(bookingDetailDTO.getCheckoutDate());

            Room room = roomService.findById(bookingDetailDTO.getRoomId());

            LocalDateTime checkinDateldt = checkinDate.toInstant().atZone(ZoneId.systemDefault())
                    .toLocalDateTime();
            LocalDateTime bookingDateldt = checkoutDate.toInstant().atZone(ZoneId.systemDefault())
                    .toLocalDateTime();
            if (checkinDateldt.isBefore(currentDate) || bookingDateldt.isBefore(currentDate)) {
                throw new ReserveDateInThePastException("Invalid checkin date and checkout date as it before current date");
            }

            if (bookingDetailService.isBooked(checkinDate, checkoutDate, room.getId())) {
                throw new RoomHasBeenBookedException("This room has been booked");
            }

            if (bookingDetailService.isBookedByUser(checkinDate, checkoutDate, room.getId(), customerUser.getId())) {
                throw new UserHasBeenBookedThisRoomException("You have been booked this room");
            }

            float cleanFee = room.getPrice() * 2 / 100;
            float siteFee = room.getPrice() * 3 / 100;

            BookingDetail bookingDetail = BookingDetail.builder().checkinDate(checkinDate).checkoutDate(checkoutDate).siteFee(siteFee)
                    .room(room).cleanFee(cleanFee).build();
            bookingDetails.add(bookingDetail);
        }

        Booking booking = Booking.builder()
                .customer(customerUser)
                .bookingDetails(bookingDetails)
                .state(Status.PENDING)
                .clientMessage(createBookingDTO.getClientMessage())
                .bookingDate(LocalDateTime.now())
                .build();

        Booking savedBooking = bookingRepository.save(booking);

        bookingDetails.forEach(bookingDetail -> {
            bookingDetail.setBooking(savedBooking);
            bookingDetailService.save(bookingDetail);
        });

        return savedBooking;
    }

    public List<BookedDateDTO> getBookedDates(Room room) throws ParseException {
        List<BookedDateDTO> bookedDates = new ArrayList<>();
        List<Booking> bookings = new ArrayList<>();
//		Iterator<Booking> bookingsItr = bookingRepository.findByRoom(room).iterator();
//		bookingsItr.forEachRemaining(bookings::add);

//		for (int i = 0; i < bookings.size(); i++) {
//			Date checkinDate = bookings.get(i).getCheckinDate();
//			Date checkoutDate = bookings.get(i).getCheckoutDate();
//			LocalDateTime cancelDate = bookings.get(i).getCancelDate();
//
//			if (checkinDate != null & checkoutDate != null && cancelDate == null) {
//				String[] checkinDate2 = checkinDate.toString().split("T")[0].split(" ")[0].split("-");
//				String[] checkoutDate2 = checkoutDate.toString().split("T")[0].split(" ")[0].split("-");
//
//				bookedDates.add(new BookedDateDTO(checkinDate2[2] + "/" + checkinDate2[1] + "/" + checkinDate2[0],
//						checkoutDate2[2] + "/" + checkoutDate2[1] + "/" + checkoutDate2[0]));
//			}
//		}
        return bookedDates;
    }

    public List<Booking> getBookingsByRoom(Room room) {
//		List<Booking> bookings = bookingRepository.findByRoom(room);
        return null;
    }

    public List<Booking> getBookingsByRooms(Integer[] rooms, LocalDateTime startDate, LocalDateTime endDate) {
//		return  bookingRepository.getBookingsByRooms(rooms, startDate, endDate);
        return null;
    }


    public List<Booking> getBookingsByRooms(Integer[] roomIds) {
//		return bookingRepository.getBookingsByRooms(roomIds);
        return null;
    }


    public List<Booking> getBookingsByUser(Integer customerId, String query) {
        return bookingRepository.getByCustomer(customerId, query);
    }

    public List<Booking> getBookedRoomsByUser(Integer customerId, String query) {
        List<Booking> bookings = bookingRepository.getBookedRoomsByUser(customerId);
//		List<BookedRoomDTO> bookedRoomDTOs = new ArrayList<>();
//		for (Booking booking : bookings) {
//			return booking.getBookingDetails().stream().map(b -> {
//
//			}
//		}
        return bookings;
    }

    @Transactional
    public Booking hostCancelBooking(Integer bookingId, User user) throws ForbiddenException, BookingNotFoundException {
        Booking canceledBooking = findById(bookingId);

        LocalDateTime cancelDate = LocalDateTime.now();

        // if user sent request is not host of the room
        if (!user.getId().equals(canceledBooking.getBookingDetails().iterator().next().getRoom().getHost().getId()))
            throw new ForbiddenException("You are not the host of the room");

        float totalFee = canceledBooking.getBookingDetails().stream().reduce(0f, (subtotal, bookingDetail) -> {
            return subtotal + bookingDetail.getTotalFee();
        }, Float::sum);


        canceledBooking.setCancelDate(cancelDate);
        canceledBooking.setState(Status.CANCELLED);
        canceledBooking.setRefundPaid(totalFee);

        return bookingRepository.save(canceledBooking);
    }

    @Transactional
    public Booking userCancelBooking(Integer bookingId, User user)
            throws ForbiddenException, BookingNotFoundException, AlreadyCancelException, BookingDetailNotFoundException, CancelDateGreaterThanCheckinDateException, ParseException {
        Booking canceledBooking = findById(bookingId);

        // if user sent request is not customer of the room
        if (!user.getId().equals(canceledBooking.getCustomer().getId())) {
            throw new ForbiddenException("You are not the owner of this booking");
        }

        // Can not cancel the same room two time
        if (canceledBooking.getState().equals(Status.CANCELLED)) {
            throw new AlreadyCancelException("You have been canceled this room");
        }

        LocalDateTime cancelDate = LocalDateTime.now();
        LocalDateTime bookingDate = canceledBooking.getBookingDate();

        long hours = ChronoUnit.HOURS.between(bookingDate, cancelDate);

        // In 48 hours, free refund
        if (hours < 48) {
            canceledBooking.setRefundPaid(canceledBooking.getTotalFee());
        } else {
            if (!canceledBooking.getState().equals(Status.APPROVED)) {
                canceledBooking.setRefundPaid(canceledBooking.getTotalFee());
            } else {
                canceledBooking.setRefundPaid(canceledBooking.getTotalFee() * 71 / 100);
            }
        }

        canceledBooking.setCancelDate(cancelDate);
        canceledBooking.setState(Status.CANCELLED);

        return bookingRepository.save(canceledBooking);
    }

    @Transactional
    public Booking approveBooking(Integer bookingId, User user) throws ForbiddenException {
        Booking approvedBooking;
        try {
            approvedBooking = findById(bookingId);
            System.out.println(user.getId());
            System.out.println(approvedBooking.getBookingDetails().iterator().next().getRoom().getHost().getId());
            System.out.println(user.getRole().getName());
            if (!user.getId().toString().equals(approvedBooking.getBookingDetails().iterator().next().getRoom().getHost().getId().toString()) && !user.getRole().getName().equals("Admin")) {
                throw new ForbiddenException("You does not have permission to approve this booking"); // if user sent request is not host of the room
            }

            approvedBooking.setState(Status.APPROVED);

            return bookingRepository.save(approvedBooking);
        } catch (BookingNotFoundException e) {
            return null;
        }
    }

    public Page<Booking> listByPage(int pageNum, String sortField, String sortDir, String keyword) {
        Sort sort = Sort.by(sortField);

        sort = sortDir.equals("asc") ? sort.ascending() : sort.descending();

        Pageable pageable = PageRequest.of(pageNum - 1, BOOKINGS_PER_PAGE, sort);

        if (keyword != null) {
//			return bookingRepository.findAllAdmin(keyword, pageable);
        }

        return bookingRepository.findAll(pageable);
    }

    public Booking getById(int id) throws BookingNotFoundException {
        try {
            return bookingRepository.getById(id);
        } catch (NoSuchElementException ex) {
            throw new BookingNotFoundException("could not find booking with id: " + id);
        }
    }

    public List<Integer> getBookingIdsByRoom(Room room) {
//		return bookingRepository.getBookingIdsByRoom(room);
        List<Integer> a = new ArrayList<>();
        a.add(0);
        return a;
    }

    public Integer getNumberOfBooking() {
//		return bookingRepository.getNumberOfBooking();
        return 0;
    }

    // public Integer getTotalRevenue() {
    // return bookingRepository.getTotalRevenue();
    // }

    public Integer getNumberOfBookingInLastMonth() {
        return bookingRepository.getNumberOfBookingInLastMonth();
    }

    public Integer getTotalRevenueOfBookingInLastMonth() {
        return bookingRepository.getTotalRevenueOfBookingInLastMonth();
    }


    // public Integer getRevenueInSpecificMonthYear(Integer month, Integer year) {
    // return bookingRepository.getRevenueInSpecificMonthYear(month, year);
    // }

    // public Integer getRevenueInSpecificYear(Integer year) {
    // return bookingRepository.getRevenueInSpecificYear(year);
    // }

    // public Integer getNumberOfBookingComplete() {
    // return bookingRepository.getNumberOfBookingComplete();
    // }

    // public Integer getNumberOfBookingNotComplete() {
    // return bookingRepository.getNumberOfBookingNotComplete();
    // }

    // public Integer getNumberOfBookingRefund() {
    // return bookingRepository.getNumberOfBookingRefund();
    // }

    public List<BookingStatsPerDayDTO> getBookingStatsPerDay(Integer month, Integer year) {
        return bookingRepository.getBookingStatsPerDay(month, year);
    }

    public List<BookingStatsPerDayDTO> getBookingStatsPerMonth(Integer year) {
        return bookingRepository.getBookingStatsPerMonth(year);
    }
}
