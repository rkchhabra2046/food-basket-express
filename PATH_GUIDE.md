# 📌 Terminal Navigation & How to Run Project

### ⚠️ Why did `cd backend` fail?
Aap pehle `frontend` folder ke andar thhe (`E:\My All Mini Projects\Food Delivery Website\frontend`), isliye terminal ne `frontend\backend` khoja jo exist nahi karta.

---

### 💡 Correct Navigation Commands:

#### Scenario A: Agar aap main project root (`Food Delivery Website`) mein hain:
- Backend mein jaane ke liye:
  ```powershell
  cd backend
  ```
- Frontend mein jaane ke liye:
  ```powershell
  cd frontend
  ```

#### Scenario B: Agar aap pehle se `frontend` folder ke andar hain:
- Ek folder peeche jaakar `backend` mein jaane ke liye:
  ```powershell
  cd ..\backend
  ```
- Ya phir seedha main directory se try karein:
  ```powershell
  cd "E:\My All Mini Projects\Food Delivery Website\backend"
  ```

---

### 🚀 Both Commands to Run:

#### 1. Backend Terminal:
```powershell
cd "E:\My All Mini Projects\Food Delivery Website\backend"
.\mvnw.cmd spring-boot:run
```

#### 2. Frontend Terminal:
```powershell
cd "E:\My All Mini Projects\Food Delivery Website\frontend"
npm run dev
```
