package com.example.PhysiotherapyAppointmentBooking.dto;


import lombok.Data;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import com.example.PhysiotherapyAppointmentBooking.entity.Appointment;
import com.example.PhysiotherapyAppointmentBooking.entity.AppointmentSlot;

public class AppointmentDto {

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class SlotResponse {
        private Long id;
        private LocalDate date;
        private LocalTime startTime;
        private LocalTime endTime;
        private AppointmentSlot.SlotStatus status;
        private Integer slotOrder;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class AppointmentResponse {
        private Long id;
        private Long patientId;
        private String patientName;
        private Long physiotherapistId;
        private String physiotherapistName;
        private String physiotherapistSpecialization;
        private LocalDate date;
        private LocalTime startTime;
        private LocalTime endTime;
        private Appointment.AppointmentStatus status;
        private Appointment.PaymentStatus paymentStatus;
        private Double amountPaid;
        private String paymentTransactionId;
        private Integer slotOrder;
    }

    @Data
    public static class BookAppointmentRequest {
        private Long slotId;
        private String paymentTransactionId;
        private Double amountPaid;
    }

    @Data
    public static class CreateSlotsRequest {
        private LocalDate date;
        private LocalTime startTime;
        private LocalTime endTime;
        private Integer durationMinutes;
    }

    @Data
    public static class UpdateSlotOrderRequest {
        private List<Long> slotIds;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class PhysiotherapistResponse {
        private Long id;
        private String name;
        private String specialization;
        private String qualification;
        private String clinicAddress;
        private Double feesPerAppointment;
        private String contactNumber;
        private String email;
    }
}

