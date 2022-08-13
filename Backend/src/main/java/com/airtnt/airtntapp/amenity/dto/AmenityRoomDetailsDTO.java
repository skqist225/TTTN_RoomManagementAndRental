package com.airtnt.airtntapp.amenity.dto;

import com.airtnt.entity.Amentity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AmenityRoomDetailsDTO {
	private Integer id;
	private String icon;
	private String name;

	public static AmenityRoomDetailsDTO build(Amentity amentity) {
		return new AmenityRoomDetailsDTO(amentity.getId(), amentity.getIconImagePath(), amentity.getName());
	}
}
