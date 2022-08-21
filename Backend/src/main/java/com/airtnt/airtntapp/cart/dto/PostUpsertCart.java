package com.airtnt.airtntapp.cart.dto;


import com.airtnt.airtntapp.booking.dto.PostCreateBookingDetailDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PostUpsertCart {
    private PostCreateBookingDetailDTO bookingDetail;
}
