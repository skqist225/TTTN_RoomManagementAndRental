package com.airtnt.airtntapp.dashboard.dto;


import com.airtnt.airtntapp.room.RoomRepository;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CountCreatedRoomDTO {
    private List<RoomRepository.CreatedRoomByMonthAndYear> activeList;
    private List<RoomRepository.CreatedRoomByMonthAndYear> deactiveList;
}
