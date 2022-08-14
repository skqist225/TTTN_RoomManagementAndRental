package com.airtnt.airtntapp.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CountBookingDTO {
    private Integer numberOfApproved;
    private Integer numberOfPending;
    private Integer numberOfCancelled;
}
