# RentaBook

Minimal Material UI Book Rental App

Built this in 2 hours. Useful for quickly spinning up a clean full-stack project for classes or hackathons.

## Project Overview

Simple Website to browse, search, and rent books.
Stack: React (frontend), Express.js (backend), SQLite (database).

## Key Features

**User Authentication**

* Register
* Login
* Logout

**Book Management**

* Browse books
* Search books
* View details

**Rental System**

* Rent books for a duration
* View rented books

**UI**

* Material-UI components
* Responsive layout
* Dark mode

## How It Works

**Frontend (App.js)**

* React hooks for state (useState, useEffect)
* Axios for API calls
* Material-UI for UI
* Conditional rendering based on auth

**Backend (server.js)**

* Express server with REST APIs
* SQLite database
* Endpoints:

  * `/api/search`
  * `/api/books`
  * `/api/users/register`
  * `/api/users/login`
  * `/api/rentals`

**Database**

* users
* categories
* books
* rentals

## Run the Project

```bash
git clone https://github.com/bharathajjarapu/rentabook.git
cd rentabook
npm install
node server.js
```

New terminal:

```bash
cd client
npm install
npm start
```

Open: [http://localhost:3000](http://localhost:3000)

## Outputs

* Home page
* Auth pages
* User dashboard
* Renter dashboard
* Rentals view

## Applied Topics

* React hooks
* Express routing & middleware
* Database design
* REST APIs
* Authentication basics
* Performance optimization

## Future Enhancements

* Reviews and ratings
* Recommendation system
* Payment integration
* Admin panel
* Notifications

Happy reading and Happy coding!
