package com.airtnt.airtntapp.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class WishlistsDTO {
    private Integer id;
    private String thumbnail;
    private String name;
    private String category;
    private Integer numberOfReviews;
    private Float price;
    private Float averageRating;
}
