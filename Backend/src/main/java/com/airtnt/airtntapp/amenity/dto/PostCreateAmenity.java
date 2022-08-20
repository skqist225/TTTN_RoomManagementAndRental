package com.airtnt.airtntapp.amenity.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PostCreateAmenity {
    private Integer id;
    private String name;
    private Integer amenityCategoryId;
    private String description;
    private String type;
    private MultipartFile iconImage;
}
