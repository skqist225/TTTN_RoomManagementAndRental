package com.airtnt.airtntapp.user.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CountUserByRole {
    private Integer numberOfUsers;
    private Integer numberOfAdmin;
    private Integer numberOfHost;
}
