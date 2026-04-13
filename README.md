Projet de mise en pratique des tests unitaires, tests d'intégration, couverture de code et CI/CD.

## Installation

cd testing-tp
npm install
npm run start:dev
```

L'API est accessible sur `http://localhost:3000`

---

##  Commandes

| Commande | Description |
|---|---|
| `npm run test` | Lance tous les tests |
| `npm run test -- --coverage` | Tests + rapport de couverture |
| `npm run lint` | Lance le linter |
| `npm run start:dev` | Démarre le serveur en mode dev |

---

## Couverture de code

Seuil minimum configuré à **80%** sur toutes les métriques.

```bash
npm run test -- --coverage
```

Ouvre le rapport HTML :
```bash
# Windows
start coverage/lcov-report/index.html

# Mac
open coverage/lcov-report/index.html
```

---

## 📡 Endpoints API

### POST /orders/simulate
Simule le prix d'une commande sans l'enregistrer.

**Body :**
```json
{
  "items": [{ "name": "Pizza", "price": 12.50, "quantity": 2 }],
  "distance": 5,
  "weight": 2,
  "hour": 15,
  "dayOfWeek": "tuesday",
  "promoCode": "BIENVENUE20"
}
```

**Réponse 200 :**
```json
{
  "subtotal": 25,
  "discount": 5,
  "deliveryFee": 3,
  "surge": 1.0,
  "total": 23
}
```

---

### POST /orders
Crée et enregistre une commande en mémoire.

**Body :** identique à `/orders/simulate`

**Réponse 201 :**
```json
{
  "id": 1,
  "items": [...],
  "subtotal": 25,
  "discount": 5,
  "deliveryFee": 3,
  "surge": 1.0,
  "total": 23,
  "createdAt": "2026-03-27T14:00:00.000Z"
}
```

---

### GET /orders/:id
Récupère une commande par son ID.

**Réponse 200 :** la commande complète

**Réponse 404 :**
```json
{ "statusCode": 404, "message": "Commande 999 introuvable" }
```

---

### POST /promo/validate
Vérifie un code promo sans créer de commande.

**Body :**
```json
{
  "code": "BIENVENUE20",
  "subtotal": 50
}
```

**Réponse 200 :**
```json
{
  "total": 40,
  "discount": 10
}
```

---

## Codes promo disponibles

| Code | Type | Valeur | Minimum |
|---|---|---|---|
| `BIENVENUE20` | percentage | 20% | 15€ |
| `REMISE5` | fixed | 5€ | 10€ |
| `EXPIRE` | percentage | 10% | 0€ (expiré) |

---

## Règles de tarification

### Frais de livraison
| Distance | Frais |
|---|---|
| ≤ 3 km | 2.00€ (base) |
| 3-10 km | +0.50€/km au delà de 3km |
| > 10 km | Livraison refusée |
| Poids > 5kg | +1.50€ |

### Surge pricing
| Créneau | Multiplicateur |
|---|---|
| Lundi-Jeudi, heures normales | ×1.0 |
| Lundi-Jeudi, 12h-13h30 | ×1.3 |
| Lundi-Jeudi, 19h-21h | ×1.5 |
| Vendredi-Samedi, 19h-22h | ×1.8 |
| Dimanche | ×1.2 |
| Avant 10h / après 22h | Fermé |

---

## Partie A — Tests unitaires

- `capitalize` — mise en majuscule
- `calculateAverage` — moyenne arrondie
- `slugify` — transformation en slug URL
- `clamp` — limitation entre min et max
- `sortStudents` — tri par grade, nom ou âge (TDD)
- `isValidEmail` — validation email
- `isValidPassword` — validation mot de passe avec règles
- `isValidAge` — validation âge entier entre 0 et 150

---

## Partie B — Tests d'intégration

20 tests d'intégration couvrant :
- `POST /orders/simulate` — 7 tests
- `POST /orders` — 5 tests
- `GET /orders/:id` — 3 tests
- `POST /promo/validate` — 5 tests