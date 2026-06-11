package com.example.PhysiotherapyAppointmentBooking.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.PhysiotherapyAppointmentBooking.entity.Appointment;
import com.example.PhysiotherapyAppointmentBooking.entity.User;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByPatientOrderBySlotDateAsc(User patient);

    @Query("SELECT a FROM Appointment a JOIN a.slot s WHERE a.patient = :patient AND s.date >= :today ORDER BY s.date ASC, s.startTime ASC")
    List<Appointment> findUpcomingByPatient(User patient, LocalDate today);

    @Query("SELECT a FROM Appointment a JOIN a.slot s WHERE a.physiotherapist = :physio AND s.date = :date ORDER BY s.slotOrder ASC")
    List<Appointment> findByPhysioAndDate(User physio, LocalDate date);

    boolean existsBySlotId(Long slotId);
}

