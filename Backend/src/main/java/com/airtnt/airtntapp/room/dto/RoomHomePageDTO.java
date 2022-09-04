package com.airtnt.airtntapp.room.dto;

import com.airtnt.entity.Room;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.beans.Transient;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RoomHomePageDTO {
    private Integer id;
    private String name;
    private String thumbnail;
    private List<String> images;
    private List<Integer> likedByUsers;
    private float price;
    private String currencySymbol;

    @Transient
    @JsonIgnore
    public static RoomHomePageDTO build(Room room, List<Integer> likedByUsers) {
        List<String> images = new ArrayList<>();

        images.add(room.renderThumbnailImage());
        images.addAll(room.getImagesPath());

        return RoomHomePageDTO.builder().id(room.getId()).name(room.getName()).thumbnail(room.renderThumbnailImage())
                .images(images).likedByUsers(likedByUsers).price(room.getPrice())
                .build();
    }
}
