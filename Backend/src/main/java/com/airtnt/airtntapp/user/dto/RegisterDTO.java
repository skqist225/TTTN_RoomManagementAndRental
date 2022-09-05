package com.airtnt.airtntapp.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class RegisterDTO {
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String email;
    private String password;
    private String sex;
    private LocalDate birthday;
    private Integer roleId;
}
