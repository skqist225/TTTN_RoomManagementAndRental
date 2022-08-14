package com.airtnt.entity;


import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@EqualsAndHashCode(callSuper = false)
@Table(name = "booking_details")
public class BookingDetail extends BaseEntity implements Serializable {

    @DateTimeFormat(pattern = "dd-MM-yyyy")
    @JsonFormat(pattern = "dd-MM-yyyy")
    private Date checkinDate;

    @DateTimeFormat(pattern = "dd-MM-yyyy")
    @JsonFormat(pattern = "dd-MM-yyyy")
    private Date checkoutDate;

    @DateTimeFormat(pattern = "dd-MM-yyyy")
    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDateTime bookingDate;

    @Column(columnDefinition = "Decimal(20,2)", nullable = false)
    private float siteFee;

    @Column(columnDefinition = "Decimal(20,2)", nullable = false)
    private float cleanFee;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @Transient
    long lastUpdated;

    @OneToOne(mappedBy = "bookingDetail")
    private Review review;

    @Transient
    public long getNumberOfDays() {
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate startDate = LocalDate.parse(this.checkinDate.toString().split(" ")[0], dtf);
        LocalDate endDate = LocalDate.parse(this.checkoutDate.toString().split(" ")[0], dtf);

        return ChronoUnit.DAYS.between(startDate, endDate);
    }

    @Transient
    public float getPricePerDay() {
        float roomPrice = this.getRoom().getPrice();
        String currency = this.getRoom().getCurrency().getSymbol();
        if (currency.equals("$")) {
            roomPrice *= 23397;
        } else if (currency.equals("£")) {
            roomPrice *= 28404;
        } else if (currency.equals("¥")) {
            roomPrice *= 3900;
        } else {
            return roomPrice;
        }

        return roomPrice;
    }


    @Transient
    public float getTotalFee() {
        return this.getPricePerDay() * this.getNumberOfDays() + this.getSiteFee() + this.getCleanFee();
    }

    @Transient
    public float getAverageRating() {
        if (this.getReview() != null) {
            return this.getReview().getFinalRating();
        }

        return 0;
    }

    public BookingDetail(Integer bookingId) {
        super(bookingId);
    }
}
