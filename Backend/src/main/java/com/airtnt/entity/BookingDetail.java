package com.airtnt.entity;


import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.Transient;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Locale;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@EqualsAndHashCode(callSuper = false)
@Table(name = "booking_details")
public class BookingDetail extends BaseEntity implements Serializable {

    @Transient
    long lastUpdated;
    @DateTimeFormat(pattern = "dd-MM-yyyy")
    @JsonFormat(pattern = "dd-MM-yyyy")
    private Date checkinDate;
    @DateTimeFormat(pattern = "dd-MM-yyyy")
    @JsonFormat(pattern = "dd-MM-yyyy")
    private Date checkoutDate;
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
    @OneToOne
    @JoinColumn(name = "review_id", unique = true, referencedColumnName = "id")
    private Review review;

    public BookingDetail(Integer bookingId) {
        super(bookingId);
    }

    @Transient
    public long getNumberOfDays() {
        DateTimeFormatter sdf = null;

        String checkinDateStr = this.checkinDate.toString();
        String checkoutDateStr = this.checkoutDate.toString();

        if (this.checkinDate.toString().contains("-") && this.checkoutDate.toString().contains("-")) {
            sdf = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            checkinDateStr = checkinDateStr.split("\\s")[0];
            checkoutDateStr = checkoutDateStr.split("\\s")[0];
        } else {
            sdf = DateTimeFormatter.ofPattern("EEE MMM dd HH:mm:ss z yyyy", Locale.US);
        }

        LocalDate startDate = LocalDate.parse(checkinDateStr, sdf);
        LocalDate endDate = LocalDate.parse(checkoutDateStr, sdf);

        System.out.println(ChronoUnit.DAYS.between(startDate, endDate));

        return ChronoUnit.DAYS.between(startDate, endDate);
    }

    @Transient
    public float getPricePerDay() {
        return this.getRoom().getPrice();
    }

    @Transient
    public float getTotalFee() {
        return this.getPricePerDay() * this.getNumberOfDays() + this.calculateSiteFee() + this.calculateCleanFee();
    }

    @Transient
    public float calculateSiteFee() {
        return this.getPricePerDay() * 2 / 100;
    }

    @Transient
    public float calculateCleanFee() {
        return this.getPricePerDay() * 3 / 100;
    }

    @Transient
    public float getAverageRating() {
        if (this.getReview() != null) {
            return this.getReview().getFinalRating();
        }

        return 0;
    }
}
