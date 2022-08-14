package com.airtnt.airtntapp.booking.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PostCreateBookingDetailDTO {
   private String checkin;
   private String checkout;
   private Integer roomId;
}
