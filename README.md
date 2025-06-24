# Portal Ogłoszeń Korepetycji - MERN Stack

W pełni funkcjonalny portal ogłoszeń korepetycji zbudowany w technologii MERN Stack (MongoDB, Express.js, React.js, Node.js).

## 🚀 Funkcjonalności

### Dla Użytkowników
- **Rejestracja i logowanie** - System autoryzacji z JWT
- **Wyszukiwanie korepetycji** - Filtrowanie według przedmiotu, lokalizacji, ceny
- **System ocen i recenzji** - Ocenianie nauczycieli przez uczniów
- **Wiadomości w czasie rzeczywistym** - Komunikacja między użytkownikami
- **Profil użytkownika** - Edycja danych osobowych i preferencji

### Dla Nauczycieli
- **Tworzenie ogłoszeń** - Dodawanie, edycja i usuwanie ogłoszeń korepetycji
- **Zarządzanie aplikacjami** - Akceptowanie/odrzucanie podań od uczniów
- **Panel nauczyciela** - Specjalne funkcje dla nauczycieli
- **Kalendarz dostępności** - Ustawianie terminów korepetycji

### Dla Uczniów
- **Aplikowanie na korepetycje** - Składanie podań na wybrane ogłoszenia
- **Wyszukiwanie nauczycieli** - Przeglądanie profili i ocen
- **Historia korepetycji** - Śledzenie swoich lekcji

### Systemowe
- **Responsywny design** - Działanie na wszystkich urządzeniach
- **Wyszukiwanie tekstowe** - Wyszukiwanie w treści ogłoszeń
- **Paginacja** - Efektywne ładowanie danych
- **Walidacja formularzy** - Sprawdzanie poprawności danych
- **Obsługa błędów** - Przyjazne komunikaty błędów

## 🛠️ Technologie

### Backend
- **Node.js** - Środowisko uruchomieniowe
- **Express.js** - Framework web
- **MongoDB** - Baza danych NoSQL
- **Mongoose** - ODM dla MongoDB
- **JWT** - Autoryzacja
- **bcryptjs** - Hashowanie haseł
- **Socket.io** - Komunikacja w czasie rzeczywistym
- **express-validator** - Walidacja danych
- **multer** - Obsługa plików
- **cors** - Cross-origin resource sharing

### Frontend
- **React.js** - Biblioteka UI
- **React Router** - Routing
- **React Query** - Zarządzanie stanem serwera
- **React Hook Form** - Formularze
- **Tailwind CSS** - Stylowanie
- **Framer Motion** - Animacje
- **Socket.io Client** - Komunikacja w czasie rzeczywistym
- **React Hot Toast** - Powiadomienia
- **Axios** - HTTP client

## 📦 Instalacja

### Wymagania
- Node.js (v14 lub nowszy)
- MongoDB (lokalnie lub MongoDB Atlas)
- npm lub yarn

### 1. Klonowanie repozytorium
```bash
git clone <repository-url>
cd tutoring-portal
```

### 2. Instalacja zależności
```bash
# Instalacja wszystkich zależności
npm run install-all

# Lub ręcznie:
npm install
cd server && npm install
cd ../client && npm install
```

### 3. Konfiguracja środowiska

#### Backend (.env)
Skopiuj `server/env.example` do `server/.env` i uzupełnij:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/tutoring-portal
JWT_SECRET=your-super-secret-jwt-key
CLIENT_URL=http://localhost:3000
```

#### Frontend (.env)
Utwórz plik `client/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Uruchomienie MongoDB
```bash
# Lokalnie
mongod

# Lub użyj MongoDB Atlas (cloud)
```

### 5. Uruchomienie aplikacji

#### Tryb deweloperski (oba serwery jednocześnie)
```bash
npm run dev
```

#### Lub osobno:
```bash
# Backend
npm run server

# Frontend (w nowym terminalu)
npm run client
```

Aplikacja będzie dostępna pod adresami:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🗄️ Struktura bazy danych

### Modele
- **User** - Użytkownicy (nauczyciele/uczniowie)
- **TutoringAd** - Ogłoszenia korepetycji
- **Message** - Wiadomości między użytkownikami
- **Review** - Recenzje i oceny

### Relacje
- Użytkownik może mieć wiele ogłoszeń (nauczyciel)
- Ogłoszenie może mieć wiele aplikacji (od uczniów)
- Użytkownicy mogą wymieniać wiadomości
- Użytkownicy mogą oceniać się nawzajem

## 🔧 API Endpoints

### Autoryzacja
- `POST /api/auth/register` - Rejestracja
- `POST /api/auth/login` - Logowanie
- `GET /api/auth/me` - Pobierz aktualnego użytkownika

### Ogłoszenia
- `GET /api/tutoring` - Lista ogłoszeń z filtrami
- `GET /api/tutoring/:id` - Szczegóły ogłoszenia
- `POST /api/tutoring` - Utwórz ogłoszenie (nauczyciel)
- `PUT /api/tutoring/:id` - Edytuj ogłoszenie
- `DELETE /api/tutoring/:id` - Usuń ogłoszenie

### Użytkownicy
- `GET /api/users/profile` - Profil użytkownika
- `PUT /api/users/profile` - Aktualizuj profil
- `GET /api/users/teachers` - Lista nauczycieli

### Wiadomości
- `GET /api/messages/conversations` - Konwersacje
- `GET /api/messages/:userId` - Wiadomości z użytkownikiem
- `POST /api/messages` - Wyślij wiadomość

### Recenzje
- `GET /api/reviews/user/:userId` - Recenzje użytkownika
- `POST /api/reviews` - Utwórz recenzję
- `PUT /api/reviews/:id` - Edytuj recenzję

## 🎨 Struktura projektu

```
tutoring-portal/
├── server/                 # Backend
│   ├── models/            # Modele MongoDB
│   │   ├── routes/            # Endpointy API
│   │   ├── middleware/        # Middleware (auth, validation)
│   │   ├── index.js           # Główny plik serwera
│   │   └── package.json
│   └── package.json           # Główny package.json
├── client/                # Frontend
│   ├── src/
│   │   ├── components/    # Komponenty React
│   │   ├── pages/         # Strony
│   │   ├── contexts/      # Konteksty (Auth, Socket)
│   │   ├── services/      # API services
│   │   └── App.js         # Główny komponent
│   └── package.json
└── package.json           # Główny package.json
```

## 🚀 Deployment

### Backend (Heroku/Railway)
1. Skonfiguruj zmienne środowiskowe
2. Dodaj MongoDB URI
3. Deploy przez Git

### Frontend (Vercel/Netlify)
1. Skonfiguruj `REACT_APP_API_URL`
2. Deploy przez Git

## 🤝 Contributing

1. Fork projektu
2. Utwórz branch (`git checkout -b feature/AmazingFeature`)
3. Commit zmian (`git commit -m 'Add some AmazingFeature'`)
4. Push do branch (`git push origin feature/AmazingFeature`)
5. Otwórz Pull Request

## 📝 Licencja

Ten projekt jest licencjonowany pod MIT License.

## 👥 Autor

Portal Korepetycji - MERN Stack

## 🆘 Wsparcie

W przypadku problemów:
1. Sprawdź czy MongoDB jest uruchomiony
2. Sprawdź zmienne środowiskowe
3. Sprawdź logi w konsoli
4. Utwórz issue w repozytorium

## 🔮 Planowane funkcjonalności

- [ ] System płatności online
- [ ] Kalendarz i rezerwacje
- [ ] Powiadomienia email
- [ ] Panel administracyjny
- [ ] Aplikacja mobilna
- [ ] Integracja z Google Calendar
- [ ] System certyfikatów dla nauczycieli
- [ ] Analityka i raporty 