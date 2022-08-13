package com.airtnt.airtntapp.user.dto;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UpdateUserDTO {
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String email;
    private String password;
    private String sex;
    private String about;
    private String birthday;
    private MultipartFile avatar;
    private Integer country;
    private Integer state;
    private Integer city;
    private String street;
}
