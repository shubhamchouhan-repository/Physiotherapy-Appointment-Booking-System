package com.example.PhysiotherapyAppointmentBooking.entity;


import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    private Integer age;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    private String contactNumber;

    // Physiotherapist fields
    private String qualification;
    private String specialization;
    private String clinicAddress;
    private Double feesPerAppointment;

    @Column(nullable = false)
    private boolean emailVerified = false;

    private String emailVerificationToken;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum Role {
        USER, PHYSIOTHERAPIST
    }

    public enum Gender {
        MALE, FEMALE, OTHER
    }
}