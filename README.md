# Vastralok – Full-Stack E-Commerce Application

Vastralok is a full-stack e-commerce web application built using Spring Boot, React.js, and MySQL.  
The application demonstrates real-world implementation of authentication, product management, cart, orders, returns workflow, and online payment integration.

This project was built as part of my full-stack developer learning journey.

---

## Project Structure

VastraLok-FullStack-Project
│
├── Vastralok Backend (Spring Boot)
└── Vastralok Frontend (React.js)

---

## Tech Stack

Frontend:
- React.js
- Axios
- HTML
- CSS

Backend:
- Spring Boot
- Spring Security
- JWT Authentication
- Hibernate / JPA
- REST APIs

Database:
- MySQL

Payment Gateway:
- Razorpay

Tools:
- Git
- GitHub
- Postman

---

## Features

User Features:
- User registration
- Login with JWT authentication
- OTP email verification
- Browse products
- Search products
- Filter products
- Sort products
- Add to cart
- Place order
- Razorpay payment integration
- Return item request

Admin Features:
- View return requests
- Approve / reject returns

---

## How to Run the Project

### Backend (Spring Boot)

1. Open backend project in IDE
2. Configure database in `application.properties`
3. Run Spring Boot application

Example configuration:
spring.datasource.url=jdbc:mysql://localhost:3306/myshopdb
spring.datasource.username=YOUR_DB_USERNAME
spring.datasource.password=YOUR_DB_PASSWORD


---

### Frontend (React)

Open frontend folder in terminal:
npm install
npm start


Frontend will run on:  http://localhost:3000/


Backend will run on:   http://localhost:8080/


---

## API Testing

All APIs were tested using Postman.

---

## Learning Highlights

- Implemented JWT authentication using Spring Security
- Built REST APIs for cart, orders, and returns
- Integrated Razorpay payment gateway
- Implemented email OTP verification
- Connected React frontend with Spring Boot backend
- Designed product grid UI with search/filter/sort

---

## Author

Rajat Kumar Nayak  
Full-Stack Developer (Fresher)

GitHub:
https://github.com/RajatKumarNayak123

Project Repository:
https://github.com/RajatKumarNayak123/VastraLok-FullStack-Project













