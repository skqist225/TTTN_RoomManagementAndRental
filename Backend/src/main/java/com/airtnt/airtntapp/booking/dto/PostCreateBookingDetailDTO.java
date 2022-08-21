package com.airtnt.airtntapp.booking.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PostCreateBookingDetailDTO {
   private String checkinDate;
   private String checkoutDate;
   private Integer roomId;
}
