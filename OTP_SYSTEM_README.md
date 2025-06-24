# System OTP - Instrukcje

## 🎉 Nowy System Logowania OTP

Wprowadziliśmy nowy, darmowy system logowania OTP, który nie wymaga konfiguracji Gmail ani płatnych usług email.

## ✨ Funkcje

- **Darmowe** - Nie potrzebujesz Gmail Workspace ani płatnych usług
- **Bezpieczne** - Kryptograficznie generowane kody OTP
- **Proste** - Kody wyświetlane w konsoli serwera
- **Automatyczna rejestracja** - Konta tworzone automatycznie

## 🚀 Jak to działa?

### 1. Rozpocznij logowanie
- Przejdź do `/otp-login` lub kliknij "Zaloguj się"
- Wprowadź swój adres email

### 2. Sprawdź konsolę serwera
Po kliknięciu "Wyślij kod", w terminalu serwera pojawi się:
```
==================================================
📧 OTP EMAIL (Development Mode)
==================================================
📧 To: your@email.com
🔐 OTP Code: 123456
📝 Type: Login
⏰ Expires: 10 minutes
==================================================
```

### 3. Wprowadź kod OTP
- Skopiuj kod z konsoli serwera
- Wklej go w formularzu OTP
- Kliknij "Zaloguj się"

## 🔧 Rozwiązywanie problemów

### Problem: Błąd 404 po wprowadzeniu kodu OTP

**Przyczyna:** Użytkownik nie istnieje w systemie

**Rozwiązanie:**
1. Użyj jednego z predefiniowanych emaili:
   - `test@example.com` (nauczyciel)
   - `student@example.com` (uczeń)

2. Lub utwórz nowe konto:
   - Wprowadź swój email
   - System poprosi o dane rejestracyjne
   - Wypełnij imię, nazwisko i rolę
   - Kod OTP zostanie wysłany

### Problem: Kod OTP nie działa

**Sprawdź:**
1. Czy kod został skopiowany dokładnie (6 cyfr)
2. Czy nie minęło 10 minut od wysłania
3. Czy nie przekroczono 3 prób

### Problem: Serwer nie odpowiada

**Sprawdź:**
1. Czy serwer działa na porcie 5000
2. Czy frontend działa na porcie 3000
3. Sprawdź logi w terminalu

## 🧪 Testowanie

Użyj strony testowej `/otp-test` aby przetestować system OTP krok po kroku.

## 📝 Logi serwera

Wszystkie operacje OTP są logowane w konsoli serwera z emoji dla łatwego śledzenia:
- 📧 Wysyłanie OTP
- 🔐 Weryfikacja OTP
- ✅ Sukces
- ❌ Błąd
- 🗑️ Usuwanie wygasłego OTP

## 🔒 Bezpieczeństwo

- Kody OTP wygasają po 10 minutach
- Maksymalnie 3 próby na kod
- Kryptograficznie bezpieczne generowanie
- Automatyczne czyszczenie wygasłych kodów

## 🚀 Następne kroki

Po udanym logowaniu możesz:
- Przeglądać ogłoszenia korepetycji
- Tworzyć własne ogłoszenia
- Komunikować się z innymi użytkownikami
- Dodawać ogłoszenia do ulubionych

## 🌐 Alternatywy dla Produkcji

### 1. Resend.com (Rekomendowane)
- Darmowe 3000 emaili/miesiąc
- Prosta konfiguracja
- Wysoka dostarczalność

```javascript
// W emailService.js
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.resend.com',
    port: 587,
    secure: false,
    auth: {
      user: 'resend',
      pass: process.env.RESEND_API_KEY
    }
  });
};
```

### 2. SendGrid
- Darmowe 100 emaili/dzień
- Dobra dokumentacja

### 3. Mailgun
- Darmowe 5000 emaili/miesiąc przez 3 miesiące

## 🛠️ Rozwój

### Dodanie nowego dostawcy email
1. Zaktualizuj `emailService.js`
2. Dodaj zmienne środowiskowe
3. Przetestuj konfigurację

### Przełączanie między trybami
```javascript
// W otpService.js
const sendOTP = async (email, otp, isNewUser = false) => {
  if (process.env.USE_EMAIL === 'true') {
    // Użyj emailService
    return await sendOTPEmail(email, otp, isNewUser);
  } else {
    // Użyj console log (development)
    return await sendOTPConsole(email, otp, isNewUser);
  }
};
```

## 📱 Testowanie

1. Uruchom serwery: `npm run dev`
2. Przejdź do `/otp-login`
3. Wprowadź email
4. Sprawdź konsolę serwera
5. Skopiuj kod i zaloguj się

## 🎯 Przykłady użycia

### Nowy użytkownik
```
Email: jan@example.com
Imię: Jan
Nazwisko: Kowalski
Rola: teacher
```

### Istniejący użytkownik
```
Email: test@example.com
(automatyczne logowanie)
```

## 📞 Wsparcie

Jeśli masz pytania lub problemy:
1. Sprawdź konsolę serwera
2. Upewnij się, że serwery są uruchomione
3. Sprawdź plik `.env`
4. Przejdź do `/otp-info` dla szczegółowych instrukcji

---

**Uwaga**: Ten system jest przeznaczony do rozwoju i testowania. W produkcji zalecamy użycie prawdziwego systemu email lub SMS. 