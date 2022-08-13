package com.airtnt.airtntapp.user.dto;

import java.time.LocalDate;

import com.airtnt.entity.User;
import com.fasterxml.jackson.annotation.JsonFormat;

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
public class UserListDTO {
    private Integer id;
    private String fullName;
    private String avatar;
    private String sex;
    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate birthday;
    private String role;
    private boolean emailVerified;
    private boolean phoneVerified;
    private boolean identityVerified;
    private Integer numberOfReviews;

    public static UserListDTO build(User user) {
        return UserListDTO.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .avatar(user.getAvatarPath())
                .sex(user.getSex().toString())
                .role(user.getRole().getName())
                .birthday(user.getBirthday())
                .emailVerified(user.isEmailVerified())
                .phoneVerified(user.isPhoneVerified())
                .identityVerified(user.isIdentityVerified())
                .numberOfReviews(user.getReviews().size())
                .build();
    }
}
