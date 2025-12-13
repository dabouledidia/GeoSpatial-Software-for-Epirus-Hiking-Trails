# GeoSpatial-Software-for-Epirus-Hiking-Trails
This software was developed for the diploma thesis of @dtsantas. We used Java with Spring Boot for the BE and Angular with Typescrtipt for the FE. The communication between the server and the cliend was established using REST APIs.

## Technologies Used
* **Backend:** Java 17, Spring Boot 3.5.6, Spring Security (JWT), Spring Data JPA
* **Frontend:** Angular 20.3.0, TypeScript, PrimeNG
* **Database:** PostgreSQL

---

## How to Run the Application

### Prerequisites
Ensure you have the following installed on your machine:
* **Java 17 SDK** (Required for the backend)
* **Node.js & npm** (Required for the frontend)
* **PostgreSQL** (Database)

### 1. Database Configuration
The application is configured to connect to a local PostgreSQL database.

1.  **Create the Database:**
    Open your SQL tool (like pgAdmin or psql) and run:
    ```sql
    CREATE DATABASE hikingdb;
    ```

2.  **Verify Credentials:**
    The backend expects the following credentials by default:
    * **Username:** `postgres`
    * **Password:** `root`
    * **Port:** `5432`

    **Important:** If your local PostgreSQL password is **not** `root`, you must either:
    * Change your local database password to `root`.
    * **OR** update the `geospatial/src/main/resources/application.properties` file with your actual password.

### 2. Setting up the Backend (Spring Boot)

1.  Open a terminal and navigate to the backend directory:
    ```bash
    cd geospatial
    ```
2.  Run the application using the Maven Wrapper:
    * **Windows:**
        ```bash
        .\mvnw spring-boot:run
        ```
    * **Mac/Linux:**
        ```bash
        ./mvnw spring-boot:run
        ```
3.  The server will start on `http://localhost:8080`.

### 3. Setting up the Frontend (Angular)

1.  Open a **new** terminal window and navigate to the frontend directory:
    ```bash
    cd geospatial-frontend
    ```
2.  Install dependencies. **Note:** Due to version conflicts with PrimeNG, use the legacy peer dependencies flag:
    ```bash
    npm install --legacy-peer-deps
    ```
3.  Start the development server:
    ```bash
    npm start
    ```
4.  Open your browser and navigate to `http://localhost:4200/`.
