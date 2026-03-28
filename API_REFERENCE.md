# AyurChain API Reference

Base URL: `/api`

## Authentication (`/auth`)

### 1. Register User
* **Method:** `POST`
* **Path:** `/auth/register`
* **Auth:** Public
* **Request Body:**
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "password123",
    "role": "farmer",
    "orgName": "Jane's Farm",
    "location": "Kerala, India"
  }
  ```
* **Success Response:** `201 Created`
  ```json
  {
    "success": true,
    "data": {
      "user": { "_id": "...", "name": "...", "role": "farmer" },
      "token": "eyJhbGciOiJIUzI1NiIsInR5c... "
    }
  }
  ```

### 2. Login User
* **Method:** `POST`
* **Path:** `/auth/login`
* **Auth:** Public
* **Request Body:**
  ```json
  {
    "email": "jane@example.com",
    "password": "password123"
  }
  ```
* **Success Response:** `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "user": { "_id": "...", "name": "...", "role": "farmer" },
      "token": "eyJhbGciOiJIUzI1NiIsInR5c... "
    }
  }
  ```

### 3. Get Current User
* **Method:** `GET`
* **Path:** `/auth/me`
* **Auth:** Required (Any Role)
* **Success Response:** `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "user": { "_id": "...", "name": "...", "email": "..." }
    }
  }
  ```

---

## Batches & Supply Chain (`/batches`)

### 4. Create Harvest Batch
* **Method:** `POST`
* **Path:** `/batches`
* **Auth:** Required (`farmer`)
* **Request Body (FormData):**
  * `herbName` (text)
  * `harvestLocation` (text)
  * `harvestDate` (text/ISO)
  * `quantity` (text)
  * `document` (File, optional)
* **Success Response:** `201 Created`
  ```json
  {
    "success": true,
    "data": {
      "batch": { "batchId": "...", "currentStage": 0, "status": "active" }
    }
  }
  ```

### 5. Get My Batches
* **Method:** `GET`
* **Path:** `/batches`
* **Auth:** Required (Any Role)
* **Success Response:** `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "batches": [{ "batchId": "...", "herbName": "Ashwagandha", "currentStage": 1 }],
      "count": 1
    }
  }
  ```

### 6. Transfer Batch (Move to next stage)
* **Method:** `PUT`
* **Path:** `/batches/:batchId/transfer`
* **Auth:** Required (Any Role, depending on stage progression)
* **Request Body:**
  ```json
  {
    "toUserId": "60d0fe4f5311236168a109ca",
    "notes": "Transferred for processing",
    "nextStage": 1
  }
  ```
* **Success Response:** `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "batch": { "batchId": "...", "currentStage": 1, "transferHistory": [...] }
    }
  }
  ```

---

## Lab Testing (`/labs`)

### 7. Submit Lab Report
* **Method:** `POST`
* **Path:** `/labs/reports`
* **Auth:** Required (`lab`)
* **Request Body (FormData):**
  * `batchId` (text)
  * `reportType` (text: HeavyMetal, Pesticide, etc.)
  * `findings` (text)
  * `testDate` (text/ISO)
  * `reportTitle` (text, optional)
  * `reportFile` (File, required)
* **Success Response:** `201 Created`
  ```json
  {
    "success": true,
    "data": {
      "report": { "_id": "...", "batchId": "...", "status": "pending", "ipfsHash": "..." }
    }
  }
  ```

### 8. Get Pending Lab Queue
* **Method:** `GET`
* **Path:** `/labs/queue`
* **Auth:** Required (`lab`)
* **Success Response:** `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "batches": [{ "batchId": "...", "currentStage": 2 }],
      "count": 1
    }
  }
  ```

---

## Certification (`/certifications`)

### 9. Issue Certification
* **Method:** `POST`
* **Path:** `/certifications`
* **Auth:** Required (`certifier`)
* **Request Body (FormData):**
  * `batchId` (text)
  * `certType` (text: Organic, GAP, etc.)
  * `certifierOrgName` (text)
  * `expiresAt` (text/ISO, optional)
  * `certificateFile` (File, optional)
* **Success Response:** `201 Created`
  ```json
  {
    "success": true,
    "data": {
      "certificate": { "batchId": "...", "certificateType": "Organic", "revoked": false }
    }
  }
  ```

---

## Consumer Verification (`/consumer`)

### 10. Verify Product Batch
* **Method:** `GET`
* **Path:** `/consumer/verify/:token`
* **Auth:** Public
* **Success Response:** `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "batchId": "...",
      "herbName": "Ashwagandha",
      "farmerName": "Jane's Farm",
      "farmerLocation": "Kerala, India",
      "currentStage": 4,
      "isCertified": true,
      "trustScore": 100,
      "blockchainVerified": true,
      "journey": [
        { "stage": 0, "actorName": "Jane Doe", "timestamp": "...", "txHash": "..." }
      ],
      "certificates": [
        { "certType": "Organic", "certifierOrgName": "ISO Cert Labs" }
      ]
    }
  }
  ```
