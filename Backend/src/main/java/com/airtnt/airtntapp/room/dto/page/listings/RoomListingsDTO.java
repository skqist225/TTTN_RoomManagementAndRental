package com.airtnt.airtntapp.room.dto.page.listings;

import java.io.Serializable;
import java.util.Date;
import com.airtnt.entity.Room;
import com.airtnt.entity.User;
import com.airtnt.entity.Address;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
        String location = address.getCountry().getName();
        location += " " + address.getState().getName();
        location += " " + address.getCity().getName();
        location += " " + address.getStreet();

        return RoomListingsDTO.builder()
                .id(room.getId())
                .name(room.getName())
                .thumbnail(room.renderThumbnailImage())
                .currency(room.getCurrency().getSymbol())
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
