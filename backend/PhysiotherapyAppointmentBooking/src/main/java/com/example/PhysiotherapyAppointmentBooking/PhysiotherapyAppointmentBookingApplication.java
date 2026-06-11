package com.example.PhysiotherapyAppointmentBooking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class PhysiotherapyAppointmentBookingApplication {

	public static void main(String[] args) {
		SpringApplication.run(PhysiotherapyAppointmentBookingApplication.class, args);
	}

}
