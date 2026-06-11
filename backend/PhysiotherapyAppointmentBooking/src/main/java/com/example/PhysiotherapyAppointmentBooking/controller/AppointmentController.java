package com.example.PhysiotherapyAppointmentBooking.controller;



import com.example.PhysiotherapyAppointmentBooking.dto.AppointmentDto.*;
import com.example.PhysiotherapyAppointmentBooking.entity.AppointmentSlot;
import com.example.PhysiotherapyAppointmentBooking.repository.UserRepository;
import com.example.PhysiotherapyAppointmentBooking.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
public class AppointmentController {

    @Autowired private AppointmentService appointmentService;
    @Autowired private UserRepository userRepository;

    
    // User end points 

    
    @GetMapping("/physiotherapists")
    public ResponseEntity<List<PhysiotherapistResponse>> getAllPhysiotherapists() {
        return ResponseEntity.ok(appointmentService.getAllPhysiotherapists());
    }

    @GetMapping("/physiotherapists/{id}")
    public ResponseEntity<PhysiotherapistResponse> getPhysiotherapist(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.getPhysiotherapistById(id));
    }

    @GetMapping("/physiotherapists/{id}/slots")
    public ResponseEntity<List<SlotResponse>> getAvailableSlots(
            @PathVariable Long id,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        if (date == null) date = LocalDate.now();
        return ResponseEntity.ok(appointmentService.getAvailableSlots(id, date));
    }

    @PostMapping("/user/appointments/book")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> bookAppointment(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody BookAppointmentRequest request) {
        try {
            Long patientId = getUserId(userDetails);
            return ResponseEntity.ok(appointmentService.bookAppointment(patientId, request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/user/appointments")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<AppointmentResponse>> getMyAppointments(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long patientId = getUserId(userDetails);
        return ResponseEntity.ok(appointmentService.getUpcomingAppointments(patientId));
    }

    
    // Physiotherapist end points 

    
    @GetMapping("/physio/appointments/today")
    @PreAuthorize("hasRole('PHYSIOTHERAPIST')")
    public ResponseEntity<List<AppointmentResponse>> getTodayAppointments(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long physioId = getUserId(userDetails);
        return ResponseEntity.ok(appointmentService.getTodayAppointmentsForPhysio(physioId));
    }

    @GetMapping("/physio/appointments")
    @PreAuthorize("hasRole('PHYSIOTHERAPIST')")
    public ResponseEntity<List<AppointmentResponse>> getAppointmentsByDate(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        Long physioId = getUserId(userDetails);
        return ResponseEntity.ok(appointmentService.getAppointmentsForPhysioByDate(physioId, date));
    }

    @GetMapping("/physio/slots")
    @PreAuthorize("hasRole('PHYSIOTHERAPIST')")
    public ResponseEntity<List<SlotResponse>> getPhysioSlots(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        if (date == null) date = LocalDate.now();
        Long physioId = getUserId(userDetails);
        return ResponseEntity.ok(appointmentService.getAllSlotsForPhysio(physioId, date));
    }

    @PostMapping("/physio/slots")
    @PreAuthorize("hasRole('PHYSIOTHERAPIST')")
    public ResponseEntity<?> createSlots(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody CreateSlotsRequest request) {
        try {
            Long physioId = getUserId(userDetails);
            return ResponseEntity.ok(appointmentService.createSlots(physioId, request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/physio/slots/{slotId}/block")
    @PreAuthorize("hasRole('PHYSIOTHERAPIST')")
    public ResponseEntity<?> blockSlot(@PathVariable Long slotId) {
        return ResponseEntity.ok(appointmentService.updateSlotStatus(slotId, AppointmentSlot.SlotStatus.BLOCKED));
    }

    @PutMapping("/physio/slots/{slotId}/unblock")
    @PreAuthorize("hasRole('PHYSIOTHERAPIST')")
    public ResponseEntity<?> unblockSlot(@PathVariable Long slotId) {
        return ResponseEntity.ok(appointmentService.updateSlotStatus(slotId, AppointmentSlot.SlotStatus.AVAILABLE));
    }

    @PutMapping("/physio/appointments/reorder")
    @PreAuthorize("hasRole('PHYSIOTHERAPIST')")
    public ResponseEntity<?> reorderAppointments(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UpdateSlotOrderRequest request) {
        Long physioId = getUserId(userDetails);
        return ResponseEntity.ok(appointmentService.reorderAppointments(physioId, request));
    }

    private Long getUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }
}
