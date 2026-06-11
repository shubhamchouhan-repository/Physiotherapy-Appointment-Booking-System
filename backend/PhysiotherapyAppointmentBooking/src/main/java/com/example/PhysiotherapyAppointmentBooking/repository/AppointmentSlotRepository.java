package com.example.PhysiotherapyAppointmentBooking.repository;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.PhysiotherapyAppointmentBooking.entity.AppointmentSlot;
import com.example.PhysiotherapyAppointmentBooking.entity.User;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentSlotRepository extends JpaRepository<AppointmentSlot, Long> {

    List<AppointmentSlot> findByPhysiotherapistAndDateOrderBySlotOrder(User physio, LocalDate date);

    List<AppointmentSlot> findByPhysiotherapistAndDateAndStatusOrderByStartTime(
            User physio, LocalDate date, AppointmentSlot.SlotStatus status);

    @Query("SELECT s FROM AppointmentSlot s WHERE s.physiotherapist.id = :physioId AND s.date = :date ORDER BY s.slotOrder ASC")
    List<AppointmentSlot> findByPhysioIdAndDate(Long physioId, LocalDate date);

    void deleteByPhysiotherapistAndDate(User physio, LocalDate date);
}
