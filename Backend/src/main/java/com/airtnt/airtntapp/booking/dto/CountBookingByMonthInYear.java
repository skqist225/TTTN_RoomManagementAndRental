package com.airtnt.airtntapp.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CountBookingByMonthInYear {
    private List<CountBookingByStatusAndMonthDTO>numberOfApproved;
    private List<CountBookingByStatusAndMonthDTO>numberOfPending;
    private List<CountBookingByStatusAndMonthDTO>numberOfCancelled;
}
