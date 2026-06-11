package com.example.PhysiotherapyAppointmentBooking.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.base-url}")
    private String baseUrl;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async
    public void sendVerificationEmail(String toEmail, String name, String token) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Verify your PhysioBook account");
            message.setText(
                "Hi " + name + ",\n\n" +
                "Thank you for registering with PhysioBook!\n\n" +
                "Please verify your email by clicking the link below:\n" +
                baseUrl + "/verify-email?token=" + token + "\n\n" +
                "This link will expire in 24 hours.\n\n" +
                "Best regards,\nPhysioBook Team"
            );
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send verification email: " + e.getMessage());
        }
    }

    @Async
    public void sendAppointmentConfirmationToPatient(String toEmail, String patientName,
            String physioName, String date, String time, double amount) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Appointment Confirmed - PhysioBook");
            message.setText(
                "Dear " + patientName + ",\n\n" +
                "Your appointment has been confirmed!\n\n" +
                "Details:\n" +
                "Physiotherapist: Dr. " + physioName + "\n" +
                "Date: " + date + "\n" +
                "Time: " + time + "\n" +
                "Amount Paid: ₹" + amount + "\n\n" +
                "Please arrive 10 minutes early.\n\n" +
                "Best regards,\nPhysioBook Team"
            );
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send confirmation email: " + e.getMessage());
        }
    }

    @Async
    public void sendAppointmentNotificationToPhysio(String toEmail, String physioName,
            String patientName, String date, String time) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("New Appointment Booked - PhysioBook");
            message.setText(
                "Dear Dr. " + physioName + ",\n\n" +
                "A new appointment has been booked.\n\n" +
                "Patient: " + patientName + "\n" +
                "Date: " + date + "\n" +
                "Time: " + time + "\n\n" +
                "Best regards,\nPhysioBook Team"
            );
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send physio notification email: " + e.getMessage());
        }
    }
}
