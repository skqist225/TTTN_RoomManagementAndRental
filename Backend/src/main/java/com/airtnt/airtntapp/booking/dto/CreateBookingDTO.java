package com.airtnt.airtntapp.booking.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateBookingDTO {
    private List<PostCreateBookingDetailDTO> bookingDetails;
    private String clientMessage;
}
