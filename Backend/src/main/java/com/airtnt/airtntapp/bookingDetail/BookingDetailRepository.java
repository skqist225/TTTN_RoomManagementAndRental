package com.airtnt.airtntapp.bookingDetail;


import com.airtnt.entity.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
@Repository
public interface BookingDetailRepository extends JpaRepository<BookingDetail, Integer>, JpaSpecificationExecutor<BookingDetail> {

    @Query("SELECT b FROM BookingDetail b")
    public Page<BookingDetail> findAll(Pageable pageable);

    @Query("SELECT b FROM BookingDetail b WHERE b.room.id = :roomId AND b.booking.state = :state")
    public List<BookingDetail> getBookedDates(Integer roomId, Status state);

    @Query("SELECT b FROM BookingDetail b WHERE b.checkinDate = :checkinDate AND b.checkoutDate = :checkoutDate" +
            " AND b.room.id = :roomId AND b.booking.customer.id = :customerId")
    public List<BookingDetail> isBookedByUser(Date checkinDate, Date checkoutDate, Integer roomId, Integer customerId);

    public List<BookingDetail> findByRoom(Room room);

    @Query("SELECT b FROM BookingDetail b WHERE b.room = :room AND b.booking.state = com.airtnt.entity.Status.APPROVED")
    public List<BookingDetail> findByRoomAndStatus(Room room);

    @Query("SELECT b FROM BookingDetail b WHERE b.booking.customer.id = :customerId AND CONCAT(b.room.name, ' ', b.booking.customer.firstName, ' ', b.booking.customer.lastName) LIKE %:query% ORDER BY b.booking.bookingDate DESC")
    public List<BookingDetail> getByCustomer(Integer customerId, String query);

    @Query("SELECT b FROM BookingDetail b WHERE b.booking.customer.id = :customerId"
            + " AND CONCAT(b.id, ' ', b.room.name, ' ', b.booking.customer.firstName, ' ', b.booking.customer.lastName) LIKE %:query% ORDER BY b.booking.bookingDate DESC")
    public List<BookingDetail> getBookedRoomsByUser(Integer customerId, String query);

    @Query("SELECT b FROM BookingDetail b WHERE b.room.id IN (:roomIds) AND b.booking.bookingDate >= :startDate AND b.booking.bookingDate <= :endDate AND b.booking.state = com.airtnt.entity.Status.APPROVED")
    public List<BookingDetail> getBookingDetailsByRoomsInOneYear(Integer[] roomIds, LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT b FROM BookingDetail b WHERE b.room.id IN (:roomIds)")
    public List<BookingDetail> getBookingDetailsByRooms(List<Integer> roomIds);

    @Query("SELECT b.id FROM BookingDetail b WHERE b.room.id IN (:roomIds)")
    public List<Integer> getBookingDetailsIdByRooms(List<Integer> roomIds);

    @Query("SELECT b FROM BookingDetail b WHERE CONCAT(b.booking.customer.firstName, '',b.booking.customer.lastName, '' , b.room.name) LIKE %?1%")
    public Page<BookingDetail> findAllAdmin(String keyword, Pageable pageable);
}
