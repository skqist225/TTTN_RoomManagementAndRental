package com.airtnt.airtntapp.dashboard.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DashboardNumberDTO {
    private Long totalSales;
    private Integer totalBookings;
    private Integer totalRooms;
    private Integer totalUsers;
}
