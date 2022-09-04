package com.airtnt.airtntapp.room.dto.page.listings;

import com.airtnt.entity.Address;
import com.airtnt.entity.City;
import com.airtnt.entity.Room;
import com.airtnt.entity.State;
import com.airtnt.entity.User;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RoomListingsDTO implements Serializable {
    /**
     *
     */
    private static final long serialVersionUID = 1L;
    private Integer id;
    private String name;
    private String thumbnail;
    private String currency;
    private String category;
    private String location;
    private User host;
    private float price;
    private int bedroomCount;
    private int bathroomCount;
    private int bedCount;
    private boolean status;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date createdDate;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date updatedDate;

    @JsonIgnore
    public static RoomListingsDTO buildRoomListingsDTO(Room room) {
        Address address = room.getAddress();
        City city = address.getCity();
        State state = ((City) city).getState();
        String location = address.getStreet();

        location += ", " + address.getCity().getName();
        location += ", " + city.getState().getName();
        location += ", " + state.getCountry().getName();

        return RoomListingsDTO.builder()
                .id(room.getId())
                .name(room.getName())
                .thumbnail(room.renderThumbnailImage())
                .category(room.getCategory().getName())
                .price(room.getPrice())
                .bedCount(room.getBedCount())
                .bedroomCount(room.getBedroomCount())
                .bathroomCount(room.getBathroomCount())
                .status(room.isStatus())
                .createdDate(room.getCreatedDate())
                .updatedDate(room.getUpdatedDate())
                .location(location)
                .host(room.getHost())
                .build();
    }
}
