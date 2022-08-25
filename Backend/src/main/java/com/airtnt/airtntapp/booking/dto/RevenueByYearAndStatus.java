package com.airtnt.airtntapp.booking.dto;

import com.airtnt.airtntapp.booking.BookingRepository;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RevenueByYearAndStatus {
    private List<BookingRepository.RevenueByYear> revenue;
    private List<BookingRepository.RevenueByYear> refund;
}
