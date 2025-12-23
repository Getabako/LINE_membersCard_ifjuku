# member-card アーキテクチャ設計書

## システム構成図

```
┌─────────────────────────────────────────────────────────────┐
│                        LINE Platform                         │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   LINE App   │  │  LIFF SDK    │  │Messaging API │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
           │                  │                  │
           ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                        │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │    Pages     │  │  Components  │  │    Store     │       │
│  │  - Home      │  │  - MemberCard│  │  (Zustand)   │       │
│  │  - Booking   │  │  - Calendar  │  │  - user      │       │
│  │  - History   │  │  - QRCode    │  │  - booking   │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ REST API
┌─────────────────────────────────────────────────────────────┐
│                   Backend (Node.js + Express)                │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Routes     │  │  Services    │  │  Middleware  │       │
│  │  /api/users  │  │  UserService │  │  - auth      │       │
│  │  /api/booking│  │BookingService│  │  - validate  │       │
│  │  /api/points │  │ PointService │  │  - error     │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ Prisma ORM
┌─────────────────────────────────────────────────────────────┐
│                      PostgreSQL Database                     │
└─────────────────────────────────────────────────────────────┘
```

## ディレクトリ構成

```
member-card/
├── docs/
│   ├── requirements.md
│   ├── architecture.md
│   └── wireframes/
├── src/                          # フロントエンド
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Loading.tsx
│   │   ├── member/
│   │   │   ├── MemberCard.tsx
│   │   │   ├── QRCode.tsx
│   │   │   └── PointBalance.tsx
│   │   └── booking/
│   │       ├── Calendar.tsx
│   │       ├── TimeSlots.tsx
│   │       └── BookingForm.tsx
│   ├── features/
│   │   ├── member/
│   │   │   ├── MemberPage.tsx
│   │   │   └── PointHistoryPage.tsx
│   │   └── booking/
│   │       ├── BookingPage.tsx
│   │       └── BookingListPage.tsx
│   ├── lib/
│   │   ├── liff.ts               # LIFF初期化
│   │   ├── api.ts                # APIクライアント
│   │   └── utils.ts
│   ├── stores/
│   │   ├── userStore.ts
│   │   └── bookingStore.ts
│   ├── styles/
│   │   └── globals.css
│   ├── App.tsx
│   └── main.tsx
├── server/                       # バックエンド
│   ├── src/
│   │   ├── routes/
│   │   │   ├── users.ts
│   │   │   ├── bookings.ts
│   │   │   └── points.ts
│   │   ├── services/
│   │   │   ├── UserService.ts
│   │   │   ├── BookingService.ts
│   │   │   └── PointService.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   └── errorHandler.ts
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── .env.example
└── README.md
```

## データベース設計

### ER図

```
┌─────────────────┐       ┌─────────────────┐
│      User       │       │     Booking     │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │──┐    │ id (PK)         │
│ lineUserId      │  │    │ userId (FK)     │──┐
│ displayName     │  │    │ date            │  │
│ memberNumber    │  └───▶│ timeSlot        │  │
│ rank            │       │ status          │  │
│ points          │       │ createdAt       │  │
│ createdAt       │       └─────────────────┘  │
│ updatedAt       │                            │
└─────────────────┘       ┌─────────────────┐  │
                          │  PointHistory   │  │
                          ├─────────────────┤  │
                          │ id (PK)         │  │
                          │ userId (FK)     │◀─┘
                          │ amount          │
                          │ type            │
                          │ description     │
                          │ createdAt       │
                          └─────────────────┘
```

### Prismaスキーマ

```prisma
model User {
  id           String         @id @default(cuid())
  lineUserId   String         @unique
  displayName  String
  memberNumber String         @unique
  rank         MemberRank     @default(BRONZE)
  points       Int            @default(0)
  createdAt    DateTime       @default(now())
  updatedAt    DateTime       @updatedAt
  bookings     Booking[]
  pointHistory PointHistory[]
}

enum MemberRank {
  BRONZE
  SILVER
  GOLD
  PLATINUM
}

model Booking {
  id        String        @id @default(cuid())
  userId    String
  user      User          @relation(fields: [userId], references: [id])
  date      DateTime
  timeSlot  String
  status    BookingStatus @default(CONFIRMED)
  createdAt DateTime      @default(now())
}

enum BookingStatus {
  CONFIRMED
  CANCELLED
  COMPLETED
}

model PointHistory {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  amount      Int
  type        String
  description String
  createdAt   DateTime @default(now())
}
```

## API設計

### エンドポイント一覧

| メソッド | パス | 説明 |
|---------|------|------|
| GET | /api/users/me | 自分の会員情報取得 |
| GET | /api/users/me/points | ポイント履歴取得 |
| GET | /api/bookings | 予約一覧取得 |
| POST | /api/bookings | 予約作成 |
| PUT | /api/bookings/:id | 予約更新 |
| DELETE | /api/bookings/:id | 予約キャンセル |
| GET | /api/slots | 予約可能枠取得 |

## 認証フロー

```
1. ユーザーがLINEミニアプリを開く
2. LIFF SDKが初期化され、LINEログイン
3. LIFF.getAccessToken()でアクセストークン取得
4. フロントエンドがトークンをAuthorizationヘッダーに付与
5. バックエンドがLINE APIでトークンを検証
6. 検証成功でユーザー情報をDBから取得/作成
```

---
作成日: 2025-12-23
