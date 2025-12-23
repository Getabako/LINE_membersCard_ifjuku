# member-card

オンライン学習塾向けLINEミニアプリ（デジタル会員証＋予約管理）

## 機能

- **デジタル会員証**: QRコード表示、ポイント残高、ランク表示
- **予約管理**: カレンダーから授業予約、予約一覧・キャンセル

## 技術スタック

### フロントエンド
- React 18 + TypeScript
- LIFF SDK
- Zustand（状態管理）
- TanStack Query
- Tailwind CSS
- Vite

### バックエンド
- Node.js + Express
- Prisma + PostgreSQL
- Zod（バリデーション）

## セットアップ

### 1. 依存関係のインストール

```bash
# フロントエンド
npm install

# バックエンド
cd server && npm install
```

### 2. 環境変数の設定

```bash
cp .env.example .env
# .env を編集してLIFF IDなどを設定
```

### 3. データベースのセットアップ

```bash
cd server
npx prisma generate
npx prisma db push
```

### 4. 開発サーバーの起動

```bash
# フロントエンド（別ターミナル）
npm run dev

# バックエンド（別ターミナル）
cd server && npm run dev
```

## LIFF設定

1. [LINE Developers Console](https://developers.line.biz/)でLIFFアプリを作成
2. エンドポイントURLを設定（開発時は ngrok などを使用）
3. LIFF IDを`.env`に設定

## ディレクトリ構成

```
member-card/
├── src/                    # フロントエンド
│   ├── components/        # UIコンポーネント
│   ├── features/          # ページコンポーネント
│   ├── stores/            # Zustandストア
│   ├── lib/               # ユーティリティ
│   └── styles/            # スタイル
├── server/                 # バックエンド
│   └── src/
│       ├── routes/        # APIルート
│       ├── services/      # ビジネスロジック
│       ├── middleware/    # ミドルウェア
│       └── prisma/        # Prismaスキーマ
└── docs/                   # ドキュメント
```

## スクリプト

```bash
# フロントエンド
npm run dev      # 開発サーバー起動
npm run build    # プロダクションビルド
npm run preview  # ビルドプレビュー

# バックエンド
npm run dev      # 開発サーバー起動
npm run build    # TypeScriptコンパイル
npm run start    # プロダクション起動
```
