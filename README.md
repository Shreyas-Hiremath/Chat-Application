# ChatFlow - A Real-Time Chat Application

ChatFlow is a modern, full-stack real-time chat application built with Node.js, Express, and Socket.IO. It features a responsive and professional user interface, robust user authentication, and persistent message history using MongoDB.

This project serves as a comprehensive example of building a real-time web application from scratch, covering both the client-side and server-side components.

## Features

* *Real-Time Messaging:* Instantly send and receive messages in a real-time environment.
* *Persistent Chat History:* Messages are saved to a MongoDB database, ensuring they are available even after the server restarts.
* *User Authentication:* A simple login screen authenticates users and manages their sessions using Socket.IO.
* *Multiple Channels:* Users can chat in public channels like #General, #Random, and #Tech Talk.
* *Direct Messaging:* Seamlessly switch to private conversations with other online users.
* *Typing Indicators:* See when other users are typing in the same channel.
* *Responsive Design:* The interface is optimized for both desktop and mobile devices.
* *Secure Credential Handling:* Utilizes environment variables (.env) to protect sensitive data like database passwords.

## Technologies Used

* *Backend:*
    * *Node.js & Express:* The foundation for the server-side logic.
    * *Socket.IO:* Enables bi-directional, low-latency communication between the client and server.
    * *Mongoose:* An elegant MongoDB object modeling tool for Node.js.
* *Frontend:*
    * *HTML5 & CSS3:* For the application's structure and styling.
    * *JavaScript (ES6+):* Powers the interactive and real-time client-side functionality.
    * *Custom CSS:* A clean and modern design with smooth animations.
* *Database:*
    * *MongoDB:* A NoSQL database used for storing persistent chat messages and user data.

## Getting Started

Follow these steps to set up and run the project locally on your machine.

### Prerequisites

You need to have [Node.js](https://nodejs.org/en/) and [Git](https://git-scm.com/) installed on your computer.

### Installation

1.  *Clone the repository:*
    bash
    git clone [https://github.com/YOUR_USERNAME/ChatFlow.git](https://github.com/YOUR_USERNAME/ChatFlow.git)
    cd ChatFlow
    

2.  *Install dependencies:*
    bash
    npm install
    

3.  *Set up your environment variables:*
    * Create a file named .env in the root directory.
    * Inside this file, add your MongoDB Atlas connection string. You can get this from your [MongoDB Atlas dashboard](https://cloud.mongodb.com/).
    * Your .env file should look like this:
        env
        MONGO_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/chatflow-app
        
    * *Important:* Do not commit this .env file to your Git repository. The .gitignore file is already configured to prevent this.

4.  *Run the application:*
    bash
    node server.js
    

5.  *Access the chat:*
    * Open your web browser and navigate to http://localhost:7777.
    * Log in with any username and email to start chatting!
