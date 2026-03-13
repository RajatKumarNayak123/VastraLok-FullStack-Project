# Vastralok – Full Stack E-Commerce Application

Vastralok is a full-stack e-commerce web application built using **Spring Boot, React.js, and MySQL**.
The application demonstrates real-world implementation of **authentication, product management, cart system, order processing, return workflow, and online payment integration**.

This project was built as part of my **Full-Stack Developer learning journey** to understand real industry architecture including REST APIs, secure authentication, and frontend-backend communication.

---

# Tech Stack

### Frontend

* React.js
* Axios
* HTML
* CSS
* JavaScript

### Backend

* Spring Boot
* Spring Security
* JWT Authentication
* Hibernate / JPA
* REST APIs

### Database

* MySQL

### Payment Gateway

* Razorpay

### Tools

* Git
* GitHub
* Postman
* VS Code
* Eclipse

---

# Project Architecture

React Frontend
↓
REST API (Spring Boot)
↓
Spring Security + JWT Authentication
↓
Service Layer (Business Logic)
↓
Hibernate / JPA
↓
MySQL Database

---

# Features

## User Features

* User registration
* Login with JWT authentication
* Email OTP verification
* Browse products
* Search products
* Filter products
* Sort products
* Add products to cart
* Place orders
* Razorpay payment integration
* Return item request

## Admin Features

* View return requests
* Approve / reject return requests

---

# Project Screenshots

### Login Page

![Login Page](screenshots/login.png)

### Product Listing

![Products](screenshots/products.png)

### Product Details

![Product Details](screenshots/product-details.png)

### Cart Page

![Cart](screenshots/cart.png)

### Checkout / Payment

![Checkout](screenshots/checkout.png)

### Orders Page

![Orders](screenshots/orders.png)

---

# Project Structure

VastraLok-FullStack-Project

Backend
└── Vastralok (Spring Boot)

Frontend
└── Vastralok (React.js)

Screenshots
└── UI Screenshots used in README

---

# How to Run the Project

## Backend (Spring Boot)

1. Open backend project in IDE
2. Configure database in `application.properties`
3. Run the Spring Boot application

Example configuration:

spring.datasource.url=jdbc:mysql://localhost:3306/myshopdb
spring.datasource.username=YOUR_DB_USERNAME
spring.datasource.password=YOUR_DB_PASSWORD

Backend will run on:
http://localhost:8080

---

## Frontend (React)

Open frontend folder in terminal:

npm install
npm start

Frontend will run on:
http://localhost:3000

---

# API Testing

All APIs were tested using **Postman**.

---

# Learning Highlights

* Implemented **JWT authentication** using Spring Security
* Built **REST APIs** for cart, orders, and returns
* Integrated **Razorpay payment gateway**
* Implemented **email OTP verification**
* Connected **React frontend with Spring Boot backend**
* Designed **product grid UI with search, filter, and sorting**

---

# Author

Rajat Kumar Nayak
Aspiring Full-Stack Developer

GitHub Profile:
https://github.com/RajatKumarNayak123

Project Repository:
https://github.com/RajatKumarNayak123/VastraLok-FullStack-Project
