# member-card コンポーネント設計書

## コンポーネント階層

```
src/
├── components/
│   ├── common/           # 共通コンポーネント
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Header.tsx
│   │   ├── Loading.tsx
│   │   ├── Modal.tsx
│   │   └── TabBar.tsx
│   │
│   ├── member/           # 会員証関連
│   │   ├── MemberCard.tsx
│   │   ├── QRCode.tsx
│   │   ├── PointBalance.tsx
│   │   ├── RankBadge.tsx
│   │   └── PointHistoryItem.tsx
│   │
│   └── booking/          # 予約関連
│       ├── Calendar.tsx
│       ├── TimeSlotGrid.tsx
│       ├── TimeSlot.tsx
│       ├── BookingCard.tsx
│       └── BookingConfirm.tsx
│
├── features/             # ページコンポーネント
│   ├── home/
│   │   └── HomePage.tsx
│   ├── member/
│   │   └── PointHistoryPage.tsx
│   └── booking/
│       ├── BookingPage.tsx
│       ├── BookingConfirmPage.tsx
│       └── BookingListPage.tsx
│
├── layouts/
│   └── MainLayout.tsx
│
└── App.tsx
```

---

## 共通コンポーネント

### Button

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}
```

| Variant | 背景色 | テキスト色 | 用途 |
|---------|--------|------------|------|
| primary | LINE緑 | 白 | メインアクション |
| secondary | 白 | グレー | サブアクション |
| danger | 赤 | 白 | 削除・キャンセル |
| ghost | 透明 | LINE緑 | テキストリンク風 |

### Card

```typescript
interface CardProps {
  variant?: 'default' | 'elevated';
  padding?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}
```

### Header

```typescript
interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}
```

### Modal

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}
```

### Loading

```typescript
interface LoadingProps {
  fullScreen?: boolean;
  text?: string;
}
```

### TabBar

```typescript
interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabBarProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
}
```

---

## 会員証コンポーネント

### MemberCard

会員情報を表示するメインカード

```typescript
interface MemberCardProps {
  user: {
    displayName: string;
    memberNumber: string;
    rank: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
    points: number;
  };
}
```

**構成:**
```
┌─────────────────────────────┐
│  QRCode                     │
│  memberNumber               │
├─────────────────────────────┤
│  displayName                │
│  RankBadge                  │
│  PointBalance               │
└─────────────────────────────┘
```

### QRCode

```typescript
interface QRCodeProps {
  value: string;        // エンコードする値
  size?: number;        // デフォルト: 200
  showMemberNumber?: boolean;
}
```

### PointBalance

```typescript
interface PointBalanceProps {
  points: number;
  size?: 'sm' | 'lg';   // sm: 履歴用, lg: メイン表示用
  expiryDate?: string;
}
```

### RankBadge

```typescript
interface RankBadgeProps {
  rank: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
}
```

| Rank | カラー | アイコン |
|------|--------|----------|
| BRONZE | #CD7F32 | ⭐ |
| SILVER | #C0C0C0 | ⭐⭐ |
| GOLD | #F59E0B | ⭐⭐⭐ |
| PLATINUM | #E5E4E2 | 👑 |

### PointHistoryItem

```typescript
interface PointHistoryItemProps {
  date: string;
  description: string;
  amount: number;       // 正: 獲得, 負: 使用
  type: string;
}
```

---

## 予約コンポーネント

### Calendar

```typescript
interface CalendarProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  minDate?: Date;       // デフォルト: 今日
  maxDate?: Date;       // デフォルト: 3ヶ月後
  disabledDates?: Date[];
}
```

**状態:**
- 選択可能日: 通常表示
- 選択中: LINE緑の丸で囲む
- 今日: 小さな点で表示
- 過去・無効日: グレーアウト

### TimeSlotGrid

```typescript
interface TimeSlotGridProps {
  date: Date;
  slots: TimeSlotData[];
  selectedSlot: string | null;
  onSelectSlot: (slotId: string) => void;
}

interface TimeSlotData {
  id: string;
  time: string;         // "10:00"
  available: boolean;
  remainingSeats?: number;
}
```

### TimeSlot

```typescript
interface TimeSlotProps {
  time: string;
  status: 'available' | 'full' | 'selected';
  onClick: () => void;
}
```

| Status | 背景色 | ボーダー | テキスト |
|--------|--------|----------|----------|
| available | 白 | グレー | 黒 |
| full | グレー | なし | グレー |
| selected | LINE緑 | なし | 白 |

### BookingCard

```typescript
interface BookingCardProps {
  booking: {
    id: string;
    date: string;
    time: string;
    title: string;
    status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  };
  onEdit?: () => void;
  onCancel?: () => void;
}
```

### BookingConfirm

```typescript
interface BookingConfirmProps {
  booking: {
    date: string;
    time: string;
    title: string;
    duration: string;
  };
  user: {
    displayName: string;
    memberNumber: string;
  };
}
```

---

## レイアウトコンポーネント

### MainLayout

```typescript
interface MainLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}
```

**構造:**
```
┌─────────────────────┐
│ Header (sticky)     │
├─────────────────────┤
│                     │
│ Content (scroll)    │
│                     │
├─────────────────────┤
│ Footer (optional)   │
└─────────────────────┘
```

---

## アイコン使用

react-icons/hi2 (Heroicons v2) を使用:

| 用途 | アイコン |
|------|----------|
| 戻る | HiArrowLeft |
| 設定 | HiCog6Tooth |
| カレンダー | HiCalendar |
| ポイント | HiGift |
| ユーザー | HiUser |
| 追加 | HiPlus |
| チェック | HiCheck |

---

## 状態管理（Zustand）

### userStore

```typescript
interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
}
```

### bookingStore

```typescript
interface BookingState {
  bookings: Booking[];
  selectedDate: Date | null;
  selectedSlot: string | null;
  isLoading: boolean;

  setSelectedDate: (date: Date) => void;
  setSelectedSlot: (slot: string) => void;
  fetchBookings: () => Promise<void>;
  createBooking: (data: CreateBookingData) => Promise<void>;
  cancelBooking: (id: string) => Promise<void>;
}
```

---

作成日: 2025-12-23
