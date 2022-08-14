package com.airtnt.airtntapp.bookingDetail;

import com.airtnt.airtntapp.booking.BookedDateDTO;
import com.airtnt.airtntapp.booking.UnitExpression;
import com.airtnt.airtntapp.booking.dto.BookingListDTO;
import com.airtnt.airtntapp.exception.*;
import com.airtnt.entity.*;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.*;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;

@Service
public class BookingDetailService {
    public final int MAX_BOOKING_PER_FETCH_BY_HOST = 10;
    public final int BOOKINGS_PER_PAGE = 10;

    @Autowired
    private BookingDetailRepository bookingDetailRepository;

    public BookingDetail findById(Integer bookingDetailId) throws BookingDetailNotFoundException {
        Optional<BookingDetail> bookingDetail = bookingDetailRepository.findById(bookingDetailId);
        if(bookingDetail.isPresent()) {
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
        List<BookingDetail> bookingDetails = bookingDetailRepository.getBookedDates(roomId);

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

    public BookingListDTO getBookingListByRooms(List<Integer> roomIds, Map<String, String> filters, int page) {
        String query = filters.get("query");
        String bookingDateStr = filters.get("bookingDate");
        String isCompleteStr = filters.get("isComplete");
        String bookingDateYear = filters.get("bookingDateYear");
        String bookingDateMonth = filters.get("bookingDateMonth");
        String sortField = filters.get("sortField");
        String sortDir = filters.get("sortDir");
        Float totalFee = Float.parseFloat(filters.get("totalFee"));

        Sort sort = Sort.by(sortField);
		if (sortField.equals("room-name")) {
			sort = Sort.by("room.name");
		}
        if (sortField.equals("customer-fullName")) {
            Sort sortByCustomerFirstName = Sort.by("customer.firstName");
            Sort sortByCustomerLastName = Sort.by("customer.lastName");
            sort = sortByCustomerFirstName.and(sortByCustomerLastName);
        }

        sort = sortDir.equals("ASC") ? sort.ascending() : sort.descending();
        Pageable pageable = PageRequest.of(page - 1, MAX_BOOKING_PER_FETCH_BY_HOST, sort);

        Page<BookingDetail> bookingPage = bookingDetailRepository.findAll(new Specification<BookingDetail>() {
            @Override
            public Predicate toPredicate(Root<BookingDetail> root, CriteriaQuery<?> criteriaQuery,
                                         CriteriaBuilder criteriaBuilder) {
                List<Predicate> predicates = new ArrayList<>();

                Expression<String> bookingId = root.get("id");
                Expression<String> roomName = root.get("room").get("name");
                Expression<LocalDateTime> bookingdDate = root.get("bookingDate");
                Expression<User> roomId = root.get("room").get("id");
                Expression<Float> cleanFee = root.get("cleanFee");
                Expression<Float> siteFee = root.get("siteFee");
                Expression<String> state = root.get("booking").get("state");

                predicates.add(criteriaBuilder.and(roomId.in(roomIds)));

                if (!StringUtils.isEmpty(query)) {
                    Expression<String> wantedQueryField = criteriaBuilder.concat(bookingId, roomName);
                    predicates.add(criteriaBuilder.and(criteriaBuilder.like(wantedQueryField, "%" + query + "%")));
                }

                if (!StringUtils.isEmpty(bookingDateStr)) {
                    try {
                        LocalDateTime bkDate = new SimpleDateFormat("yyyy-MM-dd").parse(bookingDateStr).toInstant()
                                .atZone(ZoneId.systemDefault()).toLocalDateTime();
                        LocalDateTime startOfBookingDate = bkDate.withHour(0).withMinute(0).withSecond(0);
                        LocalDateTime endOfBookingDate = bkDate.withHour(23).withMinute(0).withSecond(0);

                        predicates.add(
                                criteriaBuilder.and(criteriaBuilder.lessThanOrEqualTo(bookingdDate, endOfBookingDate)));
                        predicates.add(criteriaBuilder
                                .and(criteriaBuilder.greaterThanOrEqualTo(bookingdDate, startOfBookingDate)));
                    } catch (ParseException e) {
                        e.printStackTrace();
                    }
                }

                if (!StringUtils.isEmpty(isCompleteStr)) {
                    predicates.add(criteriaBuilder.and(criteriaBuilder.equal(state, isCompleteStr)));
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

                Expression<String> second = new UnitExpression(null, String.class, "SECOND");

                Expression<Float> numberOfDays = criteriaBuilder.function("timestampdiff", Integer.class, second,
                        root.get("checkinDate"), root.get("checkoutDate")).as(Float.class);
                Expression<Float> roomFee = criteriaBuilder.prod(numberOfDays, root.get("room").get("price"));
                Expression<Float> summ = criteriaBuilder.sum(criteriaBuilder.sum(roomFee, siteFee), cleanFee);

                predicates.add(criteriaBuilder.and(criteriaBuilder.greaterThanOrEqualTo(summ, totalFee)));

                return criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        }, pageable);

        List<BookingListDTO> bookingListDTOs = new ArrayList<>();
        for (BookingDetail b : bookingPage.toList()) {
//            bookingListDTOs.add(BookingListDTO.build(b));
        }

//        return new BookingListDTO(bookingListDTOs, bookingPage.getTotalElements(), bookingPage.getTotalPages());
        return null;
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
