# Physiotherapy Appointment Booking System

A full-stack web application designed to streamline the appointment booking process between users (patients) and physiotherapists. The platform enables secure user registration, appointment scheduling, payment processing, and schedule management through dedicated dashboards for both users and physiotherapists.

## Features

### Authentication & Account Management

* Role-based registration (User (Patient) / Physiotherapist)
* Email verification for account activation
* Secure login and authentication
* Role-based dashboard access

### User (Patient) Dashboard

* Browse available physiotherapists
* View specialization, qualifications, and consultation fees
* Check available appointment slots
* Book appointments online
* Payment confirmation for appointment booking
* Email notifications for appointment confirmation
* View upcoming appointments and booking status

### Physiotherapist Dashboard

* Manage daily appointment schedules
* Create, update, and delete appointment slots
* View all booked appointments for the day
* Reorder appointment sequences when required
* Mark unavailable days and manage availability
* Update consultation fees dynamically
* Receive booking notifications via email

## Tech Stack

### Frontend

* React.js
* HTML5
* CSS3
* JavaScript
* Axios

### Backend

* Spring Boot
* Spring Security
* Spring Data JPA
* RESTful APIs

### Database

* PostgreSQL

### Additional Services

* JavaMail Sender (Email Verification & Notifications)
* Payment Gateway Integration (Mock/Third-Party)
* JWT Authentication

## System Workflow

1. Users register as either a User (Patient) or Physiotherapist.
2. A verification email is sent to activate the account.
3. After verification, users can log in securely.
4. Users browse physiotherapists and select available appointment slots.
5. Payment is processed to confirm the booking.
6. Appointment details are stored in PostgreSQL.
7. Confirmation emails are sent to both the User (Patient) and Physiotherapist.
8. Physiotherapists manage appointments and schedules through their dashboard.

## Key Functionalities

* Secure Authentication & Authorization
* Email Verification
* Appointment Booking System
* Schedule Management
* Payment Processing
* Automated Email Notifications
* Responsive User Interface
* Role-Based Access Control (RBAC)

## Project Goal

The Physiotherapy Appointment Booking System aims to digitize and simplify physiotherapy appointment management by providing an efficient platform for users (patients) to book appointments and for physiotherapists to manage their schedules, reducing administrative effort and improving the overall user experience.
