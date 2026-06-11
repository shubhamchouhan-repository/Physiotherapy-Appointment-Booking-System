package com.example.PhysiotherapyAppointmentBooking.service;



import com.example.PhysiotherapyAppointmentBooking.dto.AuthDto.*;
import com.example.PhysiotherapyAppointmentBooking.entity.User;
import com.example.PhysiotherapyAppointmentBooking.repository.UserRepository;
import com.example.PhysiotherapyAppointmentBooking.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthService {

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private EmailService emailService;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private CustomUserDetailsService userDetailsService;

    public MessageResponse registerUser(RegisterUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        String token = UUID.randomUUID().toString();
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.USER)
                .age(request.getAge())
                .gender(request.getGender())
                .contactNumber(request.getContactNumber())
                .emailVerified(false)
                .emailVerificationToken(token)
                .build();
        userRepository.save(user);
        emailService.sendVerificationEmail(user.getEmail(), user.getName(), token);
        return new MessageResponse("Registration successful! Please check your email to verify your account.");
    }

    public MessageResponse registerPhysiotherapist(RegisterPhysioRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        String token = UUID.randomUUID().toString();
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.PHYSIOTHERAPIST)
                .qualification(request.getQualification())
                .specialization(request.getSpecialization())
                .clinicAddress(request.getClinicAddress())
                .feesPerAppointment(request.getFeesPerAppointment())
                .contactNumber(request.getContactNumber())
                .emailVerified(false)
                .emailVerificationToken(token)
                .build();
        userRepository.save(user);
        emailService.sendVerificationEmail(user.getEmail(), user.getName(), token);
        return new MessageResponse("Registration successful! Please check your email to verify your account.");
    }

    public MessageResponse verifyEmail(String token) {
        User user = userRepository.findByEmailVerificationToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired verification token"));
        user.setEmailVerified(true);
        user.setEmailVerificationToken(null);
        userRepository.save(user);
        return new MessageResponse("Email verified successfully! You can now log in.");
    }

    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        } catch (DisabledException e) {
            throw new RuntimeException("Please verify your email before logging in.");
        } catch (BadCredentialsException e) {
            throw new RuntimeException("Invalid email or password.");
        }
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        String token = jwtUtil.generateToken(userDetails);
        User user = userRepository.findByEmail(request.getEmail()).get();
        return new AuthResponse(token, user.getRole().name(), user.getId(), user.getName(), user.getEmail());
    }
}

