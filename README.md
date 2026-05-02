# Crowdfunding Platform with Equity-Based Investment

A full-stack MERN application that connects entrepreneurs with investors, enabling funding through an equity-based investment model.

## Overview

This project is a modern crowdfunding platform designed to help startup owners raise funds while offering investors a share in their project. Unlike traditional donation-based platforms, this system introduces an equity-based approach, making it more realistic and beneficial for both parties.
The platform ensures transparency, clear return expectations, and a smooth user experience.

## Key Features

### For Entrepreneurs

* Create and publish projects
* Define funding goal and deadline
* Offer equity percentage to investors
* Track funding progress in real-time
* View list of investors and contributions

### For Investors

* Browse and explore projects
* Invest in projects of interest
* View expected equity returns before investing
* Track all contributions in dashboard
* Monitor project status (Active / Completed)

## Equity-Based Investment Model

Investors receive equity proportional to their investment using the formula:
Equity Percentage = (Investment Amount / Total Funding Goal) × Total Equity Offered

Example:
If a project offers 50% equity for ₹100000,
then investing ₹2000 gives 1% equity.

This ensures fair and transparent distribution of ownership.

## Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication

* JSON Web Token (JWT)
* bcrypt

## Project Structure

crowdfunding-platform/

client/
Frontend built using React with components, pages, services, and context for state management

server/
Backend built using Node.js and Express following MVC architecture (models, routes, controllers, middleware, services)

## Core Functionalities

* User authentication (Register, Login, Logout)
* Role-based system (Entrepreneur / Investor)
* Project creation and management
* Investment system with equity calculation
* Real-time funding tracking
* Dashboard for both users
* Contribution history tracking

## Application Flow

User interacts with frontend
Frontend sends request using Axios
Backend processes request through routes and controllers
Database stores and retrieves data
Response is sent back and UI updates dynamically

## Installation and Setup

### Clone the repository

git clone https://github.com/your-username/crowdfunding-platform.git


### Backend Setup

cd server
npm install
npm run dev

### Frontend Setup

cd client
npm install
npm run dev

## Environment Variables

Create a .env file in the server folder and add:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

## Demo Features

* Preloaded sample projects
* Active, completed, and nearly funded campaigns
* Demo users for testing entrepreneur and investor roles

## Applications

* Startup funding platforms
* Investment tracking systems
* Innovation support platforms
* Financial collaboration systems

## Future Enhancements

* Real-time notifications
* AI-based project recommendations
* Fraud detection system
* Advanced analytics dashboard
* Multi-project portfolio tracking

## Team Members

| Name                     | Roll Number   |
| ------------------------ | ------------- |
| Nikhila Pallamala        | AP24110011552 |
| Annamdasu Tejasri        | AP24110011545 |
| Naradasu Sarayu          | AP24110011574 |

## Conclusion

This project provides a scalable and practical solution for connecting innovative ideas with financial support. By integrating equity-based investment, it ensures mutual benefit, transparency, and trust between entrepreneurs and investors.

## Acknowledgment

Thank you for exploring this project. Contributions, suggestions, and improvements are always welcome.
