# FileShare Application

A full-stack, secure file-sharing application designed for fast uploading and structured downloading of single or multiple files. The application generates highly compact access codes, offers optional password protection with BCrypt encryption, bundles multi-file downloads into ZIP archives on the fly, and automatically purges expired records.

## 🚀 Live Demo
The application is deployed and available at: **[alien.spdev.tech](http://alien.spdev.tech)**

---

## 🛠️ Tech Stack

- **Frontend:** React (deployed dynamically alongside the environment)
- **Backend:** Spring Boot (Java), Spring Web
- **Database:** MongoDB

---

## Architectural Features

### 1. Unique Code Generation
The system generates a distinct, collision-free numeric identification string (typically padded to 4 digits, e.g., `0123`) for quick sharing. When single files or multi-file batches are uploaded, they are retrieved via this user-friendly token or its secure hash counterpart.

### 2. Encryption & Multi-File Password Protection
- Single and multi-file uploads are supported.
- When saving multiple files, an optional password parameter can be specified. 
- Passwords are encrypted using **BCrypt hashing** (`BCryptPasswordEncoder`) on the server.
- The lookup code is securely hashed using **SHA-256** (`DigestUtils.sha256Hex`) before database query comparison to ensure the storage keys remain hidden.

### 3. On-the-Fly Dynamic ZIP Archiving
Multi-file downloads are aggregated efficiently into standard compressed ZIP files using Spring's streaming infrastructure. Files are pulled sequentially out of GridFS, fed into a `ZipOutputStream`, and streamed back to the browser via `HttpServletResponse` under the content disposition naming format `files_<code\>.zip`.

### 4. Automatic Expiration Scheduler
To optimize cloud storage footprints, an asynchronous background routine runs every hour (`@Scheduled(fixedRate = 3600000)`). The application evaluates file records against their `createdAt` metadata and purges binary blocks from GridFS and documents from MongoDB exactly **24 hours** after their creation.

---

## API Endpoints

### Health Check
- `GET /health` -> Validates application health (`"OK"`).

### File Operations
- `GET /getfiles` -> Retrieves metadata list for individual files.
- `POST /addfile` -> Manually saves raw structured metadata.
- `POST /upload` -> Form-data endpoint to upload a single multipart file. Returns the retrieval code.
- `POST /uploadM` -> Multi-part file arrays handler. Accepts an optional string parameter `password`. Returns the unique lookup identifier.
- `GET /download/{code}` -> Downloads a single file as an octet stream attachment.
- `GET /downloadM/{code}?password=...` -> Authenticates and down-streams multi-file sets bundled into a single ZIP archive.

---

## Local Setup & Installation

### Prerequisites
- Java 17 or higher
- Node.js & npm (for React frontend)
- MongoDB instance running locally or on a cloud cluster (Atlas)

### Backend Configuration
1. Clone the repository and navigate to the backend directory.
2. Configure your `application.properties` or `application.yml` file:
   ```properties
   spring.data.mongodb.uri=mongodb://localhost:27017/fileshare
   # Add additional configurations if applicable
   ```
3. Compile and launch the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```

### Frontend Configuration
1. Navigate to your React source folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set your environment variables (e.g., `.env`):
   ```env
   REACT_APP_API_URL=http://localhost:8080
   ```
4. Fire up the development server:
   ```bash
   npm start
   ```
