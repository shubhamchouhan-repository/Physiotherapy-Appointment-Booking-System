package com.example.PhysiotherapyAppointmentBooking.dto;


import com.example.PhysiotherapyAppointmentBooking.entity.User;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

public class AuthDto {

    @Data
    public static class RegisterUserRequest {
        @NotBlank private String name;
        @NotBlank @Email private String email;
        @NotBlank private String password;
        private Integer age;
        private User.Gender gender;
        private String contactNumber;
    }

    @Data
    public static class RegisterPhysioRequest {
        @NotBlank private String name;
        @NotBlank @Email private String email;
        @NotBlank private String password;
        @NotBlank private String qualification;
        @NotBlank private String specialization;
        private String clinicAddress;
        @NotNull private Double feesPerAppointment;
        private String contactNumber;
    }

    @Data
    public static class LoginRequest {
        @NotBlank @Email private String email;
        @NotBlank private String password;
    }

    @Data
    public static class AuthResponse {
        private String token;
        private String role;
        private Long userId;
        private String name;
        private String email;

        public AuthResponse(String token, String role, Long userId, String name, String email) {
            this.token = token;
            this.role = role;
            this.userId = userId;
            this.name = name;
            this.email = email;
        }
    }

    @Data
    public static class MessageResponse {
        private String message;
        public MessageResponse(String message) { this.message = message; }
    }
}
