package com.airtnt.airtntapp.user.dto;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class ForgotPasswordResponse {
    public int resetPasswordCode;
    public String message;
    public String email;
}
