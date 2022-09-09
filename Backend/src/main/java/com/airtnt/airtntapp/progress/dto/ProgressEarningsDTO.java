package com.airtnt.airtntapp.progress.dto;

import com.airtnt.airtntapp.booking.dto.BookingDetailProgressEarningDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProgressEarningsDTO {
    private List<BookingDetailProgressEarningDTO> bookings;
    private Map<Integer, Float> feesInMonth;
    private Map<Integer, Integer> numberOfBookingsInMonth;
    private float totalFee;
}
