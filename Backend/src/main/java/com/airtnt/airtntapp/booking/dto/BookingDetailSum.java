package com.airtnt.airtntapp.booking.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BookingDetailSum {
    private Integer bookingId;
    private Float totalSiteFee;
    private Float totalCleanFee;
//    private Float
}
