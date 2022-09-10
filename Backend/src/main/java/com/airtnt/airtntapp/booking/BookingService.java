package com.airtnt.airtntapp.booking;

import com.airtnt.airtntapp.booking.dto.BookingListDTO;
import com.airtnt.airtntapp.booking.dto.BookingUserOrderDTO;
import com.airtnt.airtntapp.booking.dto.CountBookingByMonthInYear;
import com.airtnt.airtntapp.booking.dto.CountBookingByStatusAndMonthDTO;
import com.airtnt.airtntapp.booking.dto.CountBookingDTO;
import com.airtnt.airtntapp.booking.dto.CreateBookingDTO;
import com.airtnt.airtntapp.booking.dto.PostCreateBookingDetailDTO;
import com.airtnt.airtntapp.booking.dto.RevenueByYearAndStatus;
import com.airtnt.airtntapp.bookingDetail.BookingDetailRepository;
import com.airtnt.airtntapp.bookingDetail.BookingDetailService;
import com.airtnt.airtntapp.exception.AlreadyCancelException;
import com.airtnt.airtntapp.exception.BookingDetailNotFoundException;
import com.airtnt.airtntapp.exception.BookingNotFoundException;
import com.airtnt.airtntapp.exception.CancelDateGreaterThanCheckinDateException;
import com.airtnt.airtntapp.exception.ForbiddenException;
import com.airtnt.airtntapp.exception.ReserveDateInThePastException;
import com.airtnt.airtntapp.exception.RoomHasBeenBookedException;
import com.airtnt.airtntapp.exception.RoomNotFoundException;
import com.airtnt.airtntapp.exception.UserHasBeenBookedThisRoomException;
import com.airtnt.airtntapp.room.RoomService;
import com.airtnt.entity.Booking;
import com.airtnt.entity.BookingDetail;
import com.airtnt.entity.Room;
import com.airtnt.entity.Status;
import com.airtnt.entity.User;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Expression;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.transaction.Transactional;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

@Service
public class BookingService {

    public final int MAX_BOOKING_PER_FETCH_BY_HOST = 10;
    public final int BOOKINGS_PER_PAGE = 10;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private BookingDetailService bookingDetailService;

    @Autowired
    private BookingDetailRepository bookingDetailRepository;

    @Autowired
    private RoomService roomService;

    @Autowired
    private EntityManager entityManager;

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

    public List<Booking> findByCustomerAndBookedStatus(User customer, String query) {
        return bookingRepository.findByCustomerAndBookedStatus(customer, query);
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

        return new CountBookingDTO(numberOfApproved, numberOfPending, numberOfCancelled, countAllBookings());
    }

    public CountBookingDTO countBookingByState(Integer hostId) {
        Integer numberOfApproved = bookingRepository.getNumberOfBookingsOfHost(hostId, "APPROVED");
        Integer numberOfPending = bookingRepository.getNumberOfBookingsOfHost(hostId, "PENDING");
        Integer numberOfCancelled = bookingRepository.getNumberOfBookingsOfHost(hostId, "CANCELLED");

        System.out.println("numberOfApproved" + numberOfApproved);
        System.out.println(numberOfPending);
        System.out.println(numberOfCancelled);

        return new CountBookingDTO(numberOfApproved, numberOfPending, numberOfCancelled, numberOfApproved + numberOfPending + numberOfCancelled);
    }

    public Integer countAllBookings() {
        return bookingRepository.countAllBooking();
    }

    public CountBookingByMonthInYear countBookingByMonth(Integer year) {

        List<CountBookingByStatusAndMonthDTO> numberOfApproved = bookingRepository.countBookingByStateByMonth(Status.APPROVED, year);
        List<CountBookingByStatusAndMonthDTO> numberOfPending = bookingRepository.countBookingByStateByMonth(Status.PENDING, year);
        List<CountBookingByStatusAndMonthDTO> numberOfCancelled = bookingRepository.countBookingByStateByMonth(Status.CANCELLED, year);

        return new CountBookingByMonthInYear(numberOfApproved, numberOfPending, numberOfCancelled);
    }

    public RevenueByYearAndStatus getRevenueByYear(String year) {
        return new RevenueByYearAndStatus(bookingRepository.getRevenueByYear("APPROVED", year), bookingRepository.getRevenueByYear("CANCELLED", year));
    }

    public Long getCurrentMonthSale() {
        return bookingRepository.getCurrentMonthSale();
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
        List<BookingDetail> bookings = bookingDetailRepository.findByRoomAndStatus(room);

        for (int i = 0; i < bookings.size(); i++) {
            Date checkinDate = bookings.get(i).getCheckinDate();
            Date checkoutDate = bookings.get(i).getCheckoutDate();

            String[] checkinDate2 = checkinDate.toString().split("T")[0].split(" ")[0].split("-");
            String[] checkoutDate2 = checkoutDate.toString().split("T")[0].split(" ")[0].split("-");

            bookedDates.add(new BookedDateDTO(checkinDate2[2] + "/" + checkinDate2[1] + "/" + checkinDate2[0],
                    checkoutDate2[2] + "/" + checkoutDate2[1] + "/" + checkoutDate2[0]));
        }
        return bookedDates;
    }

    public List<Booking> getBookingsByUser(Integer customerId, String query) {
        return bookingRepository.getByCustomer(customerId, query);
    }

    @Transactional
    public Booking hostCancelBooking(Integer bookingId, User user) throws ForbiddenException, BookingNotFoundException {
        Booking canceledBooking = findById(bookingId);

        LocalDateTime cancelDate = LocalDateTime.now();

        // if user sent request is not host of the room
//        if (!user.getId().equals(canceledBooking.getBookingDetails().iterator().next().getRoom().getHost().getId())) {
//            throw new ForbiddenException("You are not the host of the room");
//        }

        float totalFee = canceledBooking.getBookingDetails().stream().reduce(0f, (subtotal, bookingDetail) -> subtotal + bookingDetail.getTotalFee(), Float::sum);

        canceledBooking.setCancelDate(cancelDate);
        canceledBooking.setState(Status.CANCELLED);
        canceledBooking.setRefundPaid(totalFee);

        return bookingRepository.save(canceledBooking);
    }

    @Transactional
    public Booking userCancelBooking(Integer bookingId, User customer)
            throws ForbiddenException, BookingNotFoundException, AlreadyCancelException, BookingDetailNotFoundException, CancelDateGreaterThanCheckinDateException, ParseException, ReserveDateInThePastException {
        Booking canceledBooking = findById(bookingId);
        Date checkinDate = canceledBooking.getMinCheckinDate();
        // if user sent request is not customer of the room
        if (!customer.getId().equals(canceledBooking.getCustomer().getId())) {
            throw new ForbiddenException("You are not the owner of this booking");
        }

        // Can not cancel the same room two time
        if (canceledBooking.getState().equals(Status.CANCELLED)) {
            throw new AlreadyCancelException("You have been canceled this room");
        }

        Date now = new Date();
        System.out.println(now);

        if (now.compareTo(checkinDate) > 0) {
            throw new ReserveDateInThePastException("Can not cancel booking at current time");
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

    public BookingListDTO getBookingListByRoomsAdmin(Map<String, String> filters, int page) {
        String searchQuery = filters.get("query");
        String isCompleteStr = filters.get("isComplete");
        String bookingDateYear = filters.get("bookingDateYear");
        String bookingDateMonth = filters.get("bookingDateMonth");

        Sort sort = Sort.by("id").descending();
        Pageable pageable = PageRequest.of(page - 1, MAX_BOOKING_PER_FETCH_BY_HOST, sort);

        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Booking> criteriaQuery = criteriaBuilder.createQuery(Booking.class);
        Root<Booking> root = criteriaQuery.from(Booking.class);

        List<Predicate> predicates = new ArrayList<>();

        Expression<String> bookingId = root.get("id");
        Expression<String> customerFirstName = root.get("customer").get("firstName");
        Expression<String> customerLastName = root.get("customer").get("lastName");
        Expression<String> bookingDate = root.get("bookingDate");
        Expression<Status> state = root.get("state");

        if (!StringUtils.isEmpty(searchQuery)) {
            Expression<String> wantedQueryField = criteriaBuilder.concat(bookingId, " ");
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, customerFirstName);
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, " ");
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, customerLastName);
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, " ");
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, bookingDate);

            predicates.add(criteriaBuilder.and(criteriaBuilder.like(wantedQueryField, "%" + searchQuery + "%")));
        }

        List<Status> bookingStatuses = new ArrayList<>();
        if (isCompleteStr.split(",").length > 0) {
            for (String status : isCompleteStr.split(",")) {
                if (Objects.equals(status, "APPROVED")) {
                    bookingStatuses.add(Status.APPROVED);
                } else if (Objects.equals(status, "PENDING")) {
                    bookingStatuses.add(Status.PENDING);
                } else {
                    bookingStatuses.add(Status.CANCELLED);
                }
            }
        }

        if (bookingStatuses.size() > 0) {
            predicates.add(criteriaBuilder.and(state.in(bookingStatuses)));
        }

        if (!StringUtils.isEmpty(bookingDateMonth) && !StringUtils.isEmpty(bookingDateYear)) {
            predicates.add(criteriaBuilder.and(criteriaBuilder.equal(
                    criteriaBuilder.function("MONTH", Integer.class, root.get("bookingDate")),
                    bookingDateMonth)));
            predicates.add(criteriaBuilder.and(criteriaBuilder.equal(
                    criteriaBuilder.function("YEAR", Integer.class, root.get("bookingDate")),
                    bookingDateYear)));
        } else if (!StringUtils.isEmpty(bookingDateMonth)) {
            predicates.add(criteriaBuilder.and(criteriaBuilder.equal(
                    criteriaBuilder.function("MONTH", Integer.class, root.get("bookingDate")),
                    bookingDateMonth)));
        } else if (!StringUtils.isEmpty(bookingDateYear)) {
            predicates.add(criteriaBuilder.and(criteriaBuilder.equal(
                    criteriaBuilder.function("YEAR", Integer.class, root.get("bookingDate")),
                    bookingDateYear)));
        }

        criteriaQuery
                .where(criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()])))
                .orderBy(criteriaBuilder.desc(root.get("id")));

        TypedQuery<Booking> typedQuery = entityManager.createQuery(criteriaQuery);
        int totalRows = typedQuery.getResultList().size();
        typedQuery.setFirstResult(pageable.getPageNumber() * pageable.getPageSize());
        typedQuery.setMaxResults(pageable.getPageSize());

        Page<Booking> result = new PageImpl<>(typedQuery.getResultList(), pageable, totalRows);

        List<BookingUserOrderDTO> bookingListDTOs = new ArrayList<>();
        for (Booking b : result.getContent()) {
            bookingListDTOs.add(BookingUserOrderDTO.build(b));
        }

        return new BookingListDTO(bookingListDTOs, result.getTotalElements(), result.getTotalPages());
    }

    public BookingListDTO getBookingListByRooms(List<Integer> roomIds, Map<String, String> filters, int page, Integer hostId) {
        String searchQuery = filters.get("query");
        String isCompleteStr = filters.get("isComplete");
        String bookingDateYear = filters.get("bookingDateYear");
        String bookingDateMonth = filters.get("bookingDateMonth");

        Sort sort = Sort.by("id").descending();
        Pageable pageable = PageRequest.of(page - 1, MAX_BOOKING_PER_FETCH_BY_HOST, sort);

        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Booking> criteriaQuery = criteriaBuilder.createQuery(Booking.class);
        Root<Booking> root = criteriaQuery.from(Booking.class);

        List<Predicate> predicates = new ArrayList<>();

        Expression<String> bookingId = root.get("id");
        Expression<String> customerFirstName = root.get("customer").get("firstName");
        Expression<String> customerLastName = root.get("customer").get("lastName");
        Expression<String> bookingDate = root.get("bookingDate");
        Expression<Status> state = root.get("state");
        Join<Booking, BookingDetail> joinOptions = root.join("bookingDetails", JoinType.LEFT);

        predicates.add(criteriaBuilder.and(joinOptions.get("room").get("id").in(roomIds)));

        if (!StringUtils.isEmpty(searchQuery)) {
            Expression<String> wantedQueryField = criteriaBuilder.concat(bookingId, " ");
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, customerFirstName);
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, " ");
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, customerLastName);
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, " ");
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, bookingDate);

            predicates.add(criteriaBuilder.and(criteriaBuilder.like(wantedQueryField, "%" + searchQuery + "%")));
        }

        List<Status> bookingStatuses = new ArrayList<>();
        if (isCompleteStr.split(",").length > 0) {
            for (String status : isCompleteStr.split(",")) {
                if (Objects.equals(status, "APPROVED")) {
                    bookingStatuses.add(Status.APPROVED);
                } else if (Objects.equals(status, "PENDING")) {
                    bookingStatuses.add(Status.PENDING);
                } else {
                    bookingStatuses.add(Status.CANCELLED);
                }
            }
        }

        if (bookingStatuses.size() > 0) {
            predicates.add(criteriaBuilder.and(state.in(bookingStatuses)));
        }

        if (!StringUtils.isEmpty(bookingDateMonth) && !StringUtils.isEmpty(bookingDateYear)) {
            predicates.add(criteriaBuilder.and(criteriaBuilder.equal(
                    criteriaBuilder.function("MONTH", Integer.class, root.get("bookingDate")),
                    bookingDateMonth)));
            predicates.add(criteriaBuilder.and(criteriaBuilder.equal(
                    criteriaBuilder.function("YEAR", Integer.class, root.get("bookingDate")),
                    bookingDateYear)));
        } else if (!StringUtils.isEmpty(bookingDateMonth)) {
            predicates.add(criteriaBuilder.and(criteriaBuilder.equal(
                    criteriaBuilder.function("MONTH", Integer.class, root.get("bookingDate")),
                    bookingDateMonth)));
        } else if (!StringUtils.isEmpty(bookingDateYear)) {
            predicates.add(criteriaBuilder.and(criteriaBuilder.equal(
                    criteriaBuilder.function("YEAR", Integer.class, root.get("bookingDate")),
                    bookingDateYear)));
        }

        criteriaQuery
                .where(criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()])))
                .orderBy(criteriaBuilder.desc(root.get("id")))
                .groupBy(joinOptions.get("booking").get("id"));

        TypedQuery<Booking> typedQuery = entityManager.createQuery(criteriaQuery);
        int totalRows = typedQuery.getResultList().size();
        typedQuery.setFirstResult(pageable.getPageNumber() * pageable.getPageSize());
        typedQuery.setMaxResults(pageable.getPageSize());

        Page<Booking> result = new PageImpl<>(typedQuery.getResultList(), pageable, totalRows);

        List<BookingUserOrderDTO> bookingListDTOs = new ArrayList<>();
        for (Booking b : result.getContent()) {
            bookingListDTOs.add(BookingUserOrderDTO.build(b));
        }

        return new BookingListDTO(bookingListDTOs, result.getTotalElements(), result.getTotalPages());
    }

    @Transactional
    public Booking approveBooking(Integer bookingId, User user) throws ForbiddenException {
        Booking approvedBooking;
        try {
            approvedBooking = findById(bookingId);
            if (!user.getId().toString().equals(approvedBooking.getBookingDetails().iterator().next().getRoom().getHost().getId().toString()) && !user.getRole().getName().equals("Admin")) {
                throw new ForbiddenException("You does not have permission to approve this booking"); // if user sent request is not host of the room
            }

            approvedBooking.setState(Status.APPROVED);
            approvedBooking.setCancelDate(null);
            approvedBooking.setRefundPaid(0f);

            return bookingRepository.save(approvedBooking);
        } catch (BookingNotFoundException e) {
            return null;
        }
    }

    public List<Integer> getBookingIdsByRoom(Room room) {
//		return bookingRepository.getBookingIdsByRoom(room);
        List<Integer> a = new ArrayList<>();
        a.add(0);
        return a;
    }
}
