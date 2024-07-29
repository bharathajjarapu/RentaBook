# RentaBook
A minimal material UI Book Rental App

Not to flex but, I built this in just 2 hours 🔥 ! It's perfect for when you need to quickly create a full-stack project for your coding class or hackathon. Let's dive in! 🏊‍♂️

## 🎨 Project Overview

This Book Rental App is a web application that allows users to browse, search, and rent books. It's built using React for the frontend and Express.js for the backend, with SQLite as the database. The cool part? It's all done with minimal code! 😎

### 🌟 Key Features

1. User Authentication 🔐
   - Register new accounts
   - Login to existing accounts
   - Logout functionality

2. Book Management 📖
   - Browse recommended books
   - Search for specific books
   - View book details

3. Rental System 🏷️
   - Rent books for a specified duration
   - View your rented books

4. User Interface 🖥️
   - Responsive design using Material-UI
   - Dark mode toggle for late-night reading sessions 🌙

## 🛠️ How It Works

Let's break down the main components and how they interact:

### Frontend (App.js)

1. **State Management**: Uses React hooks (useState, useEffect) to manage application state.
2. **API Calls**: Axios is used to make HTTP requests to the backend.
3. **UI Components**: Material-UI provides pre-styled components for a sleek look.
4. **Conditional Rendering**: Different views are shown based on user authentication status.

### Backend (server.js)

1. **Express Server**: Handles HTTP requests and routes.
2. **SQLite Database**: Stores user info, books, and rental data.
3. **API Endpoints**: 
   - `/api/search`: Search books
   - `/api/books`: Add new books (for renters)
   - `/api/users/register` and `/api/users/login`: User authentication
   - `/api/rentals`: Manage book rentals

### Database Schema

- `users`: Stores user information
- `categories`: Book categories
- `books`: Book details including rental info
- `rentals`: Tracks rented books

## 🚀 How to Run the Project

1. Clone the repo:
   ```
   git clone https://github.com/bharathajjarapu/rentabook.git
   ```

2. Install dependencies:
   ```
   cd rentabook
   npm install
   ```

3. Start the backend server:
   ```
   node server.js
   ```

4. In a new terminal, start the React app:
   ```
   cd client
   npm install
   npm start
   ```

5. Open your browser and go to `http://localhost:3000`.

## 🎓 Applied Topics

- **React Hooks**: Dive deeper into useState, useEffect, and useCallback.
- **Express.js**: Explore more about routing and middleware.
- **Database Design**: Understand relationships between tables.
- **API Development**: Create and consume RESTful APIs.
- **Authentication**: Implement more secure auth methods (e.g., JWT).
- **Performance Optimization**: Look into ways to make the app faster.

## 🔜 Future Enhancements

1. Add user reviews and ratings for books
2. Implement a recommendation system based on user preferences
3. Add payment integration for rentals
4. Create an admin panel for managing books and users
5. Implement real-time notifications for due dates

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## 🤝 Contributing

Contributions are welcome! Feel free to open a pull request or submit an issue.
Happy reading and happy coding! 📚💻
