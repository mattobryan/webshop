Thanks for the details! I’ll create a comprehensive `README.md` for your MEAN stack mobile webshop project. It will cover project overview, features, technology stack, setup instructions, and usage roles (admin, customer, guest). I’ll let you know once it’s ready.


# Mobile Webshop – MEAN Stack Project

## Project Overview

This project is a full-stack **MEAN** (MongoDB, Express.js, Angular, Node.js) application that implements a mobile e-commerce webshop. It includes a **MongoDB** NoSQL database, a **Node.js/Express** backend server providing RESTful APIs, and an **Angular (2+)** frontend web application. The webshop supports three user roles – **Admin**, **Customer**, and **Guest** – each with different access and capabilities. Admin users can manage products and inventory; registered customers can browse products, add items to their shopping cart, and complete purchases; guests can only browse products and view prices without purchasing.

## Features by User Role

* **Admin:**

  * Add, update, and delete products and categories.
  * Set product details such as price, description, and stock quantity.
  * Update inventory levels (stock).
  * Manage user accounts (e.g. promote users to admin, deactivate accounts).
  * View all orders placed by customers.

* **Customer (Registered User):**

  * Browse and search available products by category or keyword.
  * View detailed product information and prices.
  * Register a new account and log in securely.
  * Add products to a personal shopping cart (bucket) and remove them.
  * Checkout to place an order (simulate a purchase).
  * View their own order history.

* **Guest:**

  * Browse products and categories without logging in.
  * View product listings and prices.
  * Cannot add items to cart or make purchases (must register and log in to buy).

## Technology Stack

* **MongoDB:** A NoSQL database used to store data for products, categories, users, and orders.
* **Express.js (Node.js):** Backend framework to build REST API routes for CRUD operations, user authentication, and session management.
* **Angular (v2+):** Frontend framework (uses TypeScript) for building a dynamic single-page web application.
* **Node.js:** JavaScript runtime for running the backend server.
* **Mongoose:** (commonly used) MongoDB ODM for defining schemas and interacting with the database (likely used in the server code).
* **Angular CLI:** Toolchain for building and serving the Angular application.
* **Additional:** The project may use libraries for handling sessions, authentication (e.g. Passport.js or JWT), and HTTP requests (Angular’s HttpClient).

## Setup Instructions

### Prerequisites

* **Node.js:** Install Node.js (version 14 or higher). Comes with `npm`.
* **MongoDB:** Run a MongoDB database (locally or use a MongoDB Atlas cloud instance).
* **Angular CLI:** Install globally using `npm install -g @angular/cli` (if not already installed) to run the Angular frontend.

### Installation & Running

1. **Clone the repository:**

   ```bash
   git clone https://github.com/mattobryan/webshop.git
   cd webshop
   ```

2. **Set up the Backend (Node/Express):**

   * Navigate to the `server` directory:

     ```bash
     cd server
     ```
   * Install dependencies:

     ```bash
     npm install
     ```
   * **Configure the database connection:** The server expects a MongoDB connection string. You can set this in a configuration file or environment variable. For example, create a `.env` file in `server/` containing:

     ```
     MONGO_URI=mongodb://localhost:27017/webshop
     PORT=3000
     ```

     (Replace the URI with your MongoDB URI if using Atlas or a different setup.)
   * Start the backend server:

     ```bash
     npm start
     ```

     The server will run (by default) on `http://localhost:3000` (or the specified `PORT`) and expose REST API endpoints (e.g. `/api/products`, `/api/users`, etc.).

3. **Set up the Frontend (Angular):**

   * Open a new terminal window/tab.
   * Navigate to the `client` directory:

     ```bash
     cd ../client
     ```
   * Install dependencies:

     ```bash
     npm install
     ```
   * Run the Angular development server:

     ```bash
     ng serve
     ```

     This will compile the Angular app and serve it on `http://localhost:4200`.
   * Open your web browser and go to `http://localhost:4200` to view the webshop UI.

4. **Connecting to MongoDB:**

   * Ensure your MongoDB instance is running (e.g. by starting the MongoDB service or using `mongod`).
   * The backend server must connect to MongoDB using the connection string you provided. If using a local MongoDB, `mongodb://localhost:27017/webshop` connects to a database named `webshop`.
   * The application may automatically load demo data on first run; otherwise, you can insert sample data using provided scripts or MongoDB GUI tools.

## Sample Data Description

The project includes **demo data** to help test its functionality without manual entry. This sample data typically includes:

* **Categories:** Example categories such as "Smartphones", "Accessories", etc., used to group products.
* **Products:** A set of mobile products (with fields like name, description, price, and stock quantity). For instance, sample smartphones or gadgets with prices set.
* **Users:** Example user accounts including:

  * **Admin account:** used to log in and test admin features.
  * **Customer accounts:** One or more regular users to simulate shopping and orders.
* **Orders:** Sample orders created by the demo customers, each containing one or more products (to show how orders look).

These sample entries allow you to immediately browse the store, log in with a demo account, and test adding items to the cart or checking out. (Check any provided seed or data files for exact usernames/passwords if needed.)

## Folder Structure

The repository is organized into the following key folders and files:

* **`client/`** – *Angular Frontend:* Contains the Angular application. Main subfolders include:

  * `src/`: The source code for the Angular app.

    * `app/`: Angular components, services, and modules. (E.g. components for product listing, cart, login.)
    * `assets/`: Static assets like images or styles.
    * `environments/`: Configuration files (e.g. API endpoint URLs).
  * `angular.json`, `package.json`, etc.: Configuration for building and running the Angular app.

* **`server/`** – *Node/Express Backend:* Contains the server-side code. Key parts likely include:

  * `models/`: Definitions of MongoDB schemas (e.g. User, Product, Order models).
  * `routes/`: Express route handlers that define API endpoints (e.g. routes for products, users, orders).
  * `controllers/` (if present): Business logic for handling requests.
  * `config/` or `.env`: Configuration files for things like the database connection string and secret keys.
  * `app.js` or `server.js`: Entry point that sets up the Express app and connects to MongoDB.

* **Root files:**

  * `README.md`: This file (project documentation).
  * `.gitignore`: Specifies files and folders to be ignored by Git (e.g. `node_modules/`, environment files).
  * (There may also be a `package.json` in the root if the project is set up as a mono-repo, but typically the client and server have their own `package.json`.)

## Contribution Guidelines

Contributions and feedback are welcome! To contribute to this project:

1. **Fork the repository:** Create a personal copy on GitHub.
2. **Create a new branch:** Make a branch for your feature or bug fix (e.g. `feature/add-login` or `fix/cart-bug`).
3. **Commit your changes:** Write clear commit messages.
4. **Push and open a Pull Request:** Push your branch to your fork and submit a PR to the `main` branch.
5. **Describe your changes:** In the PR description, explain what you’ve done and why.

Please ensure that the new code is well-documented and follows the existing style. Report any issues or suggest enhancements via GitHub Issues. All contributors should be respectful and collaborate in a constructive manner.

## License

academic purposes alone  
