# 🤖 AI WORKFLOW - Zasady Pracy z Projektem

## 🔴 OBOWIĄZKOWE KROKI PRZED KAŻDĄ AKCJĄ

### 1. 📖 ZAWSZE SPRAWDŹ DOKUMENTACJĘ NAJPIERW
```
✅ Przeczytaj: DEPLOYMENT_CONFIG.md
✅ Sprawdź: server/PRODUCTION_CONFIG.txt  
✅ Sprawdź: client/FRONTEND_CONFIG.txt
✅ Sprawdź: server/service.yaml (aktualne env vars)
✅ Sprawdź: client/.env (aktualny API URL)
```

### 2. 🧠 SPRAWDŹ PAMIĘĆ AI
```
✅ Sprawdź zapisane memories o projekcie
✅ Uwzględnij wcześniejsze ustalenia
```

### 3. 🔍 ANALIZA PRZED DZIAŁANIEM
```
✅ Zrozum aktualną konfigurację
✅ Sprawdź czy problem nie jest już opisany w dokumentacji
✅ Upewnij się co do nazw baz danych, URLs, etc.
```

## 🚫 NIE RÓB TEGO:
- ❌ Nie zgaduj nazw baz danych
- ❌ Nie testuj API bez sprawdzenia dokumentacji
- ❌ Nie zakładaj domyślnych wartości
- ❌ Nie ignoruj zapisanych konfiguracji
- ❌ **NIGDY nie edytuj plików .env przez edit_file** - AI nie ma dostępu!
- ❌ **NIGDY nie kasuj plików .env przez terminal** - mogą mieć poprawne dane!
- ❌ **NIGDY nie zakładaj że .env został zmieniony** - sprawdź czy istnieje!

## ✅ ZAWSZE RÓB TO:
- ✅ Sprawdź dokumentację PRZED każdą akcją
- ✅ Zaktualizuj dokumentację PO każdej zmianie
- ✅ Zapisz nowe ustalenia w pamięci AI
- ✅ Dodaj datę ostatniej aktualizacji
- ✅ **Sprawdź czy .env istnieje PRZED próbą edycji**
- ✅ **Poproś użytkownika o ręczne utworzenie .env** jeśli nie istnieje
- ✅ **Podaj TYLKO instrukcje do .env** - nie próbuj edytować!

## 📋 CHECKLIST PRZED KAŻDĄ POMOCĄ

### Problemy z Deploymentem:
1. [ ] Sprawdziłem DEPLOYMENT_CONFIG.md
2. [ ] Sprawdziłem service.yaml vs dokumentacja
3. [ ] Sprawdziłem client/.env vs dokumentacja
4. [ ] Sprawdziłem pamięć AI o projekcie

### Problemy z API/Bazą Danych:
1. [ ] Sprawdziłem PRODUCTION_CONFIG.txt
2. [ ] Sprawdziłem która baza jest używana (test/korke/tutoringads)
3. [ ] Sprawdziłem connection string w service.yaml
4. [ ] Sprawdziłem logi Cloud Run

### Problemy z Frontendem:
1. [ ] Sprawdziłem FRONTEND_CONFIG.txt
2. [ ] Sprawdziłem client/.env
3. [ ] Sprawdziłem CORS w backend

## 🔄 WORKFLOW AKTUALIZACJI DOKUMENTACJI

### Po każdej zmianie konfiguracji:
```bash
1. Zaktualizuj DEPLOYMENT_CONFIG.md
2. Zaktualizuj odpowiedni plik CONFIG.txt
3. Dodaj datę aktualizacji
4. Zapisz w pamięci AI nowe ustalenia
5. Sprawdź czy README.md potrzebuje aktualizacji
```

### Template aktualizacji:
```markdown
---
**Ostatnia aktualizacja**: [DATA]
**Zmiana**: [OPIS ZMIANY]
**Przez**: AI Assistant
---
```

## 🎯 KLUCZOWE INFORMACJE DO ZAPAMIĘTANIA

### Baza Danych:
- ✅ **UWAGA**: Dane są w bazie `test`, nie `tutoring-portal`
- ✅ Connection string zawiera `/test`
- ✅ 30 ogłoszeń + 5 użytkowników

### URLs:
- ✅ Frontend: https://client-hru3eyc6u-pawels-projects-6bbbf083.vercel.app
- ✅ Backend: https://korke-backend-139636337078.europe-west1.run.app
- ✅ API: https://korke-backend-139636337078.europe-west1.run.app/api

### Deployment:
- ✅ Backend: Google Cloud Run (korke-c0097, europe-west1)
- ✅ Frontend: Vercel (pawels-projects-6bbbf083)
- ✅ Database: MongoDB Atlas (korke.bm67q6y.mongodb.net/test)

## 🚨 CZERWONE FLAGI - SPRAWDŹ DOKUMENTACJĘ!

Jeśli widzisz:
- ❌ Puste odpowiedzi API
- ❌ Błędy połączenia z bazą
- ❌ CORS errors
- ❌ 404 na endpointach
- ❌ Problemy z deploymentem

**STOP! Sprawdź dokumentację przed debugowaniem!**

## 🔥 SPECJALNE ZASADY DLA PLIKÓW .ENV

### ⚠️ PROBLEM: AI nie ma dostępu do plików .env
```
❌ edit_file na .env = BŁĄD (AI myśli że się udało)
❌ Terminal echo > .env = KASUJE istniejące dane
❌ Założenie że .env został zmieniony = BŁĄD
```

### ✅ POPRAWNY WORKFLOW dla .env:

#### 1. SPRAWDŹ czy .env istnieje:
```bash
# Użyj: ls -la client/.env
# Użyj: ls -la server/.env
```

#### 2. SPRAWDŹ zawartość (jeśli istnieje):
```bash
# Użyj: cat client/.env
# Użyj: cat server/.env
```

#### 3. NIGDY nie edytuj - TYLKO instrukcje:
```
✅ "Utwórz plik client/.env z zawartością:"
✅ "Dodaj do istniejącego client/.env linię:"
✅ "Zmień w client/.env wartość X na Y:"

❌ Nie używaj: edit_file na .env
❌ Nie używaj: echo "content" > .env (kasuje!)
❌ Nie zakładaj że się udało
```

#### 4. ZAWSZE sprawdź rezultat:
```bash
# Po instrukcjach sprawdź: cat client/.env
```

### 🎯 Template instrukcji .env:
```
Musisz ręcznie utworzyć/edytować plik .env:

📁 Lokalizacja: client/.env
📝 Zawartość:
REACT_APP_API_URL=https://korke-backend-139636337078.europe-west1.run.app/api

💡 Jak to zrobić:
1. Otwórz folder client/ w edytorze
2. Utwórz plik .env (jeśli nie istnieje)
3. Wklej powyższą zawartość
4. Zapisz plik
```

---
**Utworzono**: 2025-06-25
**Zaktualizowano**: 2025-06-25 (dodano zasady .env)
**Cel**: Zapobieganie problemom przez sprawdzanie dokumentacji
**Status**: 🔴 OBOWIĄZKOWE DO PRZESTRZEGANIA 