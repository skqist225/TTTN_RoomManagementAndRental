package com.airtnt.airtntapp.room.dto.page.home;

import java.util.Set;

import com.airtnt.entity.Image;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RoomDTO {
    private int id;
    private Set<Image> images;
    private String name;
    private float price;
    private String currencySymbol;
    private String userName;
}
