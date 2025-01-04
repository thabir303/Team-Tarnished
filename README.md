## **Team-Tarnished** 

## **User Routes**

### 1. Create User
- **URL:** `localhost:3000/api/v1/create-user`
- **Method:** POST
- **Request Body:**
  ```json
  {
    "name": "Rina Akter",
    "email": "rina.akter@example.com",
    "password": "SecurePass123"
  }
  ```
- **Response Body:**
  ```json
  {
    "message": "User created successfully",
    "data": {
      "id": "6428a1f25f4c3d2a5e9b1c3f",
      "name": "Rina Akter",
      "email": "rina.akter@example.com"
    }
  }
  ```

### 2. Get Single User
- **URL:** `localhost:3000/api/v1/6428a1f25f4c3d2a5e9b1c3f`
- **Method:** GET
- **Headers:** 
  ```json
  {
    "Authorization": "Bearer <auth_token>"
  }
  ```
- **Response Body:**
  ```json
  {
    "id": "6428a1f25f4c3d2a5e9b1c3f",
    "name": "Rina Akter",
    "email": "rina.akter@example.com",
    "savedPDFs": ["Story1.pdf", "Story2.pdf"]
  }
  ```

### 3. Get All Users
- **URL:** `localhost:3000/api/v1/`
- **Method:** GET
- **Headers:** 
  ```json
  {
    "Authorization": "Bearer <auth_token>"
  }
  ```
- **Response Body:**
  ```json
  [
    {
      "id": "6428a1f25f4c3d2a5e9b1c3f",
      "name": "Rina Akter",
      "email": "rina.akter@example.com"
    },
    {
      "id": "6428b2d45a7e3d2b6f0c4e7d",
      "name": "Nadia Rahman",
      "email": "nadia.rahman@example.com"
    }
  ]
  ```

### 4. Update User
- **URL:** `localhost:3000/api/v1/6428a1f25f4c3d2a5e9b1c3f`
- **Method:** PATCH
- **Headers:** 
  ```json
  {
    "Authorization": "Bearer <auth_token>"
  }
  ```
- **Request Body:**
  ```json
  {
    "name": "Rina Akter",
    "email": "rina.updated@example.com"
  }
  ```
- **Response Body:**
  ```json
  {
    "message": "User updated successfully",
    "data": {
      "id": "6428a1f25f4c3d2a5e9b1c3f",
      "name": "Rina Akter",
      "email": "rina.updated@example.com"
    }
  }
  ```

### 5. Delete User
- **URL:** `localhost:3000/api/v1/6428a1f25f4c3d2a5e9b1c3f`
- **Method:** DELETE
- **Headers:** 
  ```json
  {
    "Authorization": "Bearer <auth_token>"
  }
  ```
- **Response Body:**
  ```json
  {
    "message": "User deleted successfully"
  }
  ```
## **PDF Routes**

### **1. Create PDF**
- **URL:** `localhost:3000/api/v1/create-pdf`
- **Method:** POST
- **Headers:**
  ```json
  {
    "Authorization": "Bearer <auth_token>"
  }
  ```
- **Request Body:**
  ```json
  {
    "content": "Amar sonar Bangla, ami tomay bhalobashi."
  }
  ```
- **Response Body:**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "PDF is created successfully",
    "data": {
      "id": "641f1c8e5e4a3b3dc1e9ab7a",
      "content": "Amar sonar Bangla, ami tomay bhalobashi.",
      "translatedContent": "আমার সোনার বাংলা, আমি তোমায় ভালোবাসি।",
      "caption": "আমার বাংলা",
      "fileUrl": "http://localhost:3000/stackoverflow-files/1672948572_translated.pdf"
    }
  }
  ```

### **2. Get All PDFs**
- **URL:** `localhost:3000/api/v1/`
- **Method:** GET
- **Headers:**
  ```json
  {
    "Authorization": "Bearer <auth_token>"
  }
  ```
- **Response Body:**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "PDFs are retrieved successfully",
    "data": [
      {
        "id": "641f1c8e5e4a3b3dc1e9ab7a",
        "content": "Amar sonar Bangla, ami tomay bhalobashi.",
        "translatedContent": "আমার সোনার বাংলা, আমি তোমায় ভালোবাসি।",
        "caption": "আমার বাংলা",
        "fileUrl": "http://localhost:3000/stackoverflow-files/1672948572_translated.pdf"
      },
      {
        "id": "641f1c9d5e4a3b3dc1e9ab8b",
        "content": "Ei prithibi ekdin shukhhin hobe.",
        "translatedContent": "এই পৃথিবী একদিন সুখী হবে।",
        "caption": "পৃথিবীর আশা",
        "fileUrl": "http://localhost:3000/stackoverflow-files/1672948573_translated.pdf"
      }
    ]
  }
  ```

### **3. Get Single PDF**
- **URL:** `localhost:3000/api/v1/641f1c8e5e4a3b3dc1e9ab7a`
- **Method:** GET
- **Headers:**
  ```json
  {
    "Authorization": "Bearer <auth_token>"
  }
  ```
- **Response Body:**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "PDF is retrieved successfully",
    "data": {
      "id": "641f1c8e5e4a3b3dc1e9ab7a",
      "content": "Amar sonar Bangla, ami tomay bhalobashi.",
      "translatedContent": "আমার সোনার বাংলা, আমি তোমায় ভালোবাসি।",
      "caption": "আমার বাংলা",
      "fileUrl": "/stackoverflow-files/1672948572_translated.pdf"
    }
  }
  ```

### **4. Get PDF File**
- **URL:** `localhost:3000/api/v1/file/1672948572_translated.pdf`
- **Method:** GET
- **Headers:**
  ```json
  {
    "Authorization": "Bearer <auth_token>"
  }
  ```
- **Response Body:**
  ```json
  {
    "filename": "1672948572_translated.pdf",
    "content": "Base64EncodedPDFContent"
  }
  ```

## **Chat Routes**

### 1. Get Chat Response
- **URL:** `localhost:3000/api/v1/get-chat-response`
- **Method:** POST
- **Request Body:**
  ```json
  {
    "query": "Rongdhonu ki kore hoy?"
  }
  ```
- **Response Body:**
  ```json
  {
    "message": "Chat response generated",
    "data": {
      "response": "রংধনু সূর্যের আলো ও পানির ফোঁটার প্রতিফলনের মাধ্যমে তৈরি হয়।"
    }
  }
  ```

## **Enhance Routes**

### **1. Auto-Correct**
- **URL:** `localhost:3000/api/v1/auto-correct`
- **Method:** POST
- **Headers:**
  ```json
  {
    "Content-Type": "application/json"
  }
  ```
- **Request Body:**
  ```json
  {
    "context": "ami tumi valo valoo ase"
  }
  ```
- **Response Body (with mistakes):**
  ```json
  {
    "result": "valoo, ase\nvalo, ache"
  }
  ```
- **Response Body (no mistakes):**
  ```json
  {
    "result": "(empty)"
  }
  ```

### **2. Next-Word Prediction**
- **URL:** `localhost:3000/api/v1/next-word`
- **Method:** POST
- **Headers:**
  ```json
  {
    "Content-Type": "application/json"
  }
  ```
- **Request Body:**
  ```json
  {
    "context": "tumi valo"
  }
  ```
- **Response Body:**
  ```json
  {
    "result": "acho"
  }
  ```

### **Error Responses**

- **400 Bad Request:**
  - Occurs when the `context` field is missing in the request body.
  - Response:
    ```json
    {
      "error": "Context is required."
    }
    ```

- **500 Internal Server Error:**
  - Occurs if there’s an issue with the auto-correction or prediction process.
  - Response:
    ```json
    {
      "error": "Auto-correction failed."
    }
    ```
    and:
    ```json
    {
      "error": "Next-word prediction failed."
    }
    ```
Here’s the **API documentation** for the voice interaction features:

---

## **Voice Interaction API**

### **1. Hands-Free Content Generation**
- **URL:** `localhost:3000/api/v1/voice-to-text`
- **Method:** POST
- **Headers:**
  ```json
  {
    "Content-Type": "multipart/form-data",
    "Authorization": "Bearer <auth_token>"
  }
  ```
- **Request Body:**
  - **File:** Upload an audio file (in `.wav`, `.mp3`, or similar formats) containing the voice input in Bangla or English.
  Example:
  ```json
  {
    "file": "<audio_file>"
  }
  ```
- **Response Body:**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "Voice converted to text successfully.",
    "data": {
      "transcribedText": "আমি আজ ভীষণ আনন্দিত।"
    }
  }
  ```

### **2. Voice Assistant (Chatbot with Voice Output)**
- **URL:** `localhost:3000/api/v1/chatbot/voice-response`
- **Method:** POST
- **Headers:**
  ```json
  {
    "Content-Type": "application/json",
    "Authorization": "Bearer <auth_token>"
  }
  ```
- **Request Body:**
  ```json
  {
    "query": "Amar sonar Bangla, tumi keno valo?"
  }
  ```
- **Response Body:**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "Chatbot responded with voice.",
    "data": {
      "responseText": "আমার সোনার বাংলা, আমি তোমায় ভালোবাসি।",
      "audioUrl": "/voice-responses/response_1672948572.mp3"
    }
  }
  ```

### **Error Responses**

#### **400 Bad Request**
- **Hands-Free Content Generation:** If no audio file is provided.
  ```json
  {
    "error": "Audio file is required."
  }
  ```

- **Voice Assistant:** If the `query` field is missing in the request body.
  ```json
  {
    "error": "Query is required."
  }
  ```

#### **500 Internal Server Error**
- **Both Endpoints:** For any server-side issues.
  ```json
  {
    "error": "Voice processing failed. Please try again later."
  }
  ```
