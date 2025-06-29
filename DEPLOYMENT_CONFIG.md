# 🚀 Konfiguracja Deploymentu - Portal Korepetycji

## 📊 Aktualne Środowisko Produkcyjne

### 🌐 Frontend (Vercel)
- **URL**: https://client-1psxklam1-pawels-projects-6bbbf083.vercel.app
- **Projekt**: client (pawels-projects-6bbbf083)
- **Framework**: Create React App
- **API URL**: https://korke-backend-qm72ucfvqq-ew.a.run.app/api

### ⚙️ Backend (Google Cloud Run)
- **URL**: https://korke-backend-qm72ucfvqq-ew.a.run.app
- **Projekt**: korke-c0097
- **Region**: europe-west1
- **Service**: korke-backend
- **Port**: 8080 (automatyczny)

### 🗄️ Baza Danych (MongoDB Atlas)
- **Cluster**: korke.bm67q6y.mongodb.net
- **Baza**: `test` ⚠️ **UWAGA: Dane są w bazie 'test', nie 'tutoring-portal'**
- **Kolekcje**:
  - `tutoringads` (30 ogłoszeń)
  - `users` (5 użytkowników)
  - `messages` (wiadomości)
  - `reviews` (recenzje)

## 🔧 Zmienne Środowiskowe (Produkcja)

```bash
NODE_ENV=production
PORT=8080 (automatyczne w Cloud Run)
MONGODB_URI=mongodb+srv://aasdafefe854afaf:Ptasie123.@korke.bm67q6y.mongodb.net/test?retryWrites=true&w=majority&appName=Korke
CLIENT_URL=https://client-1psxklam1-pawels-projects-6bbbf083.vercel.app
JWT_SECRET=korke-super-secret-jwt-key-2024
```

## 📂 Pliki Konfiguracyjne

- `server/service.yaml` - Konfiguracja Google Cloud Run
- `client/.env` - URL API dla frontendu
- `server/env.example` - Przykład zmiennych środowiskowych

## 🚨 Ważne Uwagi

1. **Baza danych**: Rzeczywiste dane są w bazie `test`, nie w `tutoring-portal` (jak w env.example)
2. **CORS**: Skonfigurowany dla wszystkich domen Vercel + korke.pl
3. **Routing**: `/users/teachers` musi być przed `/:id` w routes/users.js

## 📋 Checklist Deploy

### Backend (Google Cloud Run)
```bash
cd server
gcloud builds submit --tag gcr.io/korke-c0097/korke-backend .
gcloud run deploy korke-backend --image gcr.io/korke-c0097/korke-backend --region europe-west1 --platform managed
gcloud run services replace service.yaml --region europe-west1  # jeśli zmiany w env vars
```

### Frontend (Vercel)
```bash
cd client
vercel --prod
```

## 🔍 Sprawdzanie Statusu

### Backend Health Check
```bash
curl https://korke-backend-qm72ucfvqq-ew.a.run.app/api/tutoring?limit=1
```

### Logi Backend
```bash
gcloud run services logs read korke-backend --region=europe-west1 --limit=10
```

### MongoDB Connection Test
```bash
mongosh "mongodb+srv://aasdafefe854afaf:Ptasie123.@korke.bm67q6y.mongodb.net/test" --eval "db.tutoringads.countDocuments({})"
```

---
**Ostatnia aktualizacja**: 2025-06-29
**Zaktualizowano**: 2025-06-29 (wyrównanie wysokości search bar w mobile)
**Status**: ✅ Wszystko działa poprawnie

## 🗑️ Historia Zmian

### 2025-06-29 - Wyrównanie wysokości search bar w mobile
- ✅ **Frontend**: https://client-1psxklam1-pawels-projects-6bbbf083.vercel.app
- ✅ **Backend**: https://korke-backend-139636337078.europe-west1.run.app
- ✅ **API**: https://korke-backend-139636337078.europe-west1.run.app/api
- ✅ **Search bar**: Wyrównana wysokość z buttonami filtrującymi (36px mobile, 32px desktop)
- ✅ **Search bar**: Wyrównany rozmiar tekstu z buttonami filtrującymi (13px mobile, 14px desktop)
- ✅ **Mobile**: Burger menu → ikonka logowania (UserIcon)
- ✅ **Z-index**: Navbar z-[70] > Sekcja filtrująca z-[60]
- ✅ **Połączenie**: Frontend ↔ Backend działa poprawnie

### 2025-06-29 - Wyrównanie rozmiaru tekstu w search bar
- ✅ **Frontend**: https://client-mhje3vdqx-pawels-projects-6bbbf083.vercel.app
- ✅ **Backend**: https://korke-backend-139636337078.europe-west1.run.app
- ✅ **API**: https://korke-backend-139636337078.europe-west1.run.app/api
- ✅ **Search bar**: Wyrównany rozmiar tekstu z buttonami filtrującymi (13px mobile, 14px desktop)
- ✅ **Mobile**: Burger menu → ikonka logowania (UserIcon)
- ✅ **Z-index**: Navbar z-[70] > Sekcja filtrująca z-[60]
- ✅ **Połączenie**: Frontend ↔ Backend działa poprawnie 