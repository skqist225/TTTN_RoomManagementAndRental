package com.airtnt.airtntapp.room.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PostAddRoomDTO {
    private Integer activeStep;
    private String name;
    private String[] images;
    private int[] rules;
    private int[] amenities;
    private Integer country;
    private Integer city;
    private int bedroomCount;
    private int bathroomCount;
    private int guestCount;
    private int bedCount;
    private int currency;
    private int category;
    private String description;
    private Float latitude;
    private Float longitude;
    private int price;
    private int host;
    private int privacy;
    private String street;
    private String thumbnail;
}
