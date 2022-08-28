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
    private Integer category;

    private Integer privacy;

    private String street;
    private Integer city;
    private Float latitude;
    private Float longitude;

    private int bedroomCount;
    private int bathroomCount;
    private int guestCount;
    private int bedCount;

    private Integer[] amenities;

    private String[] images;

    private String name;

    private String description;

    private Integer[] rules;

    private Long price;
    private Integer currency;

    private Integer host;
    private String thumbnail;
}
