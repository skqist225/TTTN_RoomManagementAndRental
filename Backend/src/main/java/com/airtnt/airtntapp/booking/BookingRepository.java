package com.airtnt.airtntapp.booking;

import com.airtnt.airtntapp.booking.dto.CountBookingByStatusAndMonthDTO;
import com.airtnt.entity.Booking;
import com.airtnt.entity.Status;
import com.airtnt.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer>, JpaSpecificationExecutor<Booking> {

    @Query("SELECT b FROM Booking b WHERE b.state = :type")
    public Page<Booking> findAll(@Param("type") Status type, Pageable pageable);

    @Query(value = "SELECT count(temp.id) as numberOfBookings FROM (SELECT bs.* FROM airtn.bookings as bs" +
            " LEFT JOIN booking_details as bds on bs.id = bds.booking_id" +
            " WHERE bs.state = :state AND bds.room_id in (select id from rooms as r where r.host_id = :hostId)" +
            " group by bs.id) as temp", nativeQuery = true)
    public Integer getNumberOfBookingsOfHost(Integer hostId, String state);

    public List<Booking> findByCustomerAndState(User customer, Status state);

    @Query("SELECT b FROM Booking b WHERE b.customer = :customer AND b.state = com.airtnt.entity.Status.CART OR b.state = com.airtnt.entity.Status.CARTSELECTED")
    public List<Booking> findByCustomerAndCartStatus(User customer);

    @Query("SELECT b FROM Booking b WHERE b.customer = :customer AND b.state IN (com.airtnt.entity.Status.PENDING, com.airtnt.entity.Status.APPROVED, com.airtnt.entity.Status.CANCELLED, com.airtnt.entity.Status.OUTOFDATE) AND CONCAT(b.customer.firstName, ' ', b.customer.lastName, ' ', b.state) LIKE %:query% ORDER BY b.createdDate DESC")
    public List<Booking> findByCustomerAndBookedStatus(User customer, String query);

    @Query("SELECT b FROM Booking b WHERE b.customer.id = :customerId AND CONCAT(b.customer.firstName, ' ', b.customer.lastName) LIKE %:query% ORDER BY b.bookingDate DESC")
    public List<Booking> getByCustomer(Integer customerId, String query);

    @Query("SELECT count(*) FROM Booking b WHERE b.state = :stateStatus")
    public Integer countBookingByState(Status stateStatus);

    @Query("SELECT count(*) FROM Booking b WHERE b.state IN (com.airtnt.entity.Status.PENDING, com.airtnt.entity.Status.APPROVED, com.airtnt.entity.Status.CANCELLED)")
    public Integer countAllBooking();

    @Query("SELECT new com.airtnt.airtntapp.booking.dto.CountBookingByStatusAndMonthDTO(count(b.id), MONTH(b.createdDate)) FROM Booking b WHERE b.state = :stateStatus AND YEAR(b.createdDate) = :year GROUP BY MONTH(b.createdDate)")
    public List<CountBookingByStatusAndMonthDTO> countBookingByStateByMonth(Status stateStatus, Integer year);

    @Query(value = "SELECT sum(rs.price* DATEDIFF(bds.checkout_date, bds.checkin_date) + bds.site_fee + bds.clean_fee) as number, month(bs.created_at) as month from bookings as bs"
            + " left join booking_details as bds on bds.booking_id = bs.id"
            + " left join rooms as rs on rs.id = bds.room_id"
            + " where bs.state = :status and  YEAR(bs.created_at) = :year"
            + " group by month(bs.created_at)", nativeQuery = true)
    public List<RevenueByYear> getRevenueByYear(String status, String year);

    @Query(value = "SELECT SUM(rs.price* DATEDIFF(bds.checkout_date, bds.checkin_date) + bds.site_fee + bds.clean_fee) as number FROM (select * from bookings as bs where bs.state = \"APPROVED\" AND YEAR(bs.created_at) =  YEAR(CURRENT_DATE()) and MONTH(bs.created_at) = MONTH(CURRENT_DATE())) as bk" +
            " LEFT JOIN booking_details as bds ON bds.booking_id = bk.id" +
            " LEFT JOIN rooms as rs ON rs.id = bds.room_id", nativeQuery = true)
    public Long getCurrentMonthSale();

    @Query(value = "select count(temp.id) from (SELECT distinct(b.id) FROM airtn.bookings as b" +
            " left join booking_details as bds on bds.booking_id = b.id" +
            " left join rooms as r on r.id = bds.room_id" +
            " where" +
            " b.state = \"APPROVED\" and" +
            " r.host_id = :hostId and" +
            " month(b.booking_date) = :month and year(b.booking_date) = :year) as temp", nativeQuery = true)
    public Integer countNumberOfBookingsByHost(Integer hostId, Integer month, Integer year);

    public static interface RevenueByYear {

        Long getNumber();

        Integer getMonth();

    }
}
