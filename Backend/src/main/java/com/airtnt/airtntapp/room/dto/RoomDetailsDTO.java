package com.airtnt.airtntapp.room.dto;

import java.beans.Transient;
import java.util.List;
import java.util.Set;

import com.airtnt.airtntapp.amenity.dto.AmenityRoomDetailsDTO;
import com.airtnt.airtntapp.booking.BookedDateDTO;
import com.airtnt.airtntapp.review.dto.ReviewDTO;
import com.airtnt.entity.Address;
import com.airtnt.entity.Room;
import com.airtnt.entity.Rule;
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
public class RoomDetailsDTO {
        private int bed;
        private List<AmenityRoomDetailsDTO> amenities;
        private List<String> images;
        private String thumbnail;
        private float latitude;
        private String description;
        private String privacy;
        private List<BookedDateDTO> bookedDates;
        private float averageRating;
        private Set<Rule> rules;
        private int bedroom;
        private String stayType;
        private List<ReviewDTO> reviews;
        private float price;
        private String name;
        private HostDTO host;
        private String location;
        private int guest;
        private String currencySymbol;
        private String currencyUnit;
        private Integer id;
        private int bathroom;
        private int accomodates;
        private float longitude;
        private String cityName;
        private String category;
        private boolean isLikedByCurrentUser;
        private boolean status;
        private Integer groupId;
        private String groupName;
        private Integer categoryId;
        private Integer privacyId;
        private Address address;

        @Transient
        @JsonIgnore
        public static RoomDetailsDTO buildRoomDetailsDTO(Room room, List<ReviewDTO> reviewDTOs,
                        List<AmenityRoomDetailsDTO> amenityRoomDetailsDTOs, HostDTO hostDTO,
                        List<BookedDateDTO> bookedDates,
                        float avgRatings) {
                Address address = room.getAddress();
                String location = address.getCountry().getName();
                location += " " + address.getState().getName();
                location += " " + address.getCity().getName();
                location += " " + address.getStreet();
                
                return RoomDetailsDTO.builder()
                                .thumbnail(room.renderThumbnailImage())
                                .amenities(amenityRoomDetailsDTOs)
                                .rules(room.getRules())
                                .images(room.getImagesPath())
                                .reviews(reviewDTOs)
                                .id(room.getId())
                                .name(room.getName())
                                .description(room.getDescription())
                                .location(location)
                                .privacy(room.getPrivacyType().getName()).guest(room.getAccomodatesCount())
                                .host(hostDTO)
                                .bed(room.getBedCount())
                                .bathroom(room.getBathroomCount())
                                .bedroom(room.getBedroomCount())
                                .price(room.getPrice())
                                .currencySymbol(room.getCurrency().getSymbol())
                                .currencyUnit(room.getCurrency().getUnit())
                                .longitude(room.getLongitude())
                                .latitude(room.getLatitude())
                                .averageRating(avgRatings)
                                .bookedDates(bookedDates)
                                .address(room.getAddress())
                                .category(room.getCategory().getName())
                                .isLikedByCurrentUser(room.getHost().getFavRooms().contains(room))
                                .status(room.isStatus())
                                .accomodates(room.getAccomodatesCount())
                                .categoryId(room.getCategory().getId())
                                .privacyId(room.getPrivacyType().getId())
                                .build();
        }
}
