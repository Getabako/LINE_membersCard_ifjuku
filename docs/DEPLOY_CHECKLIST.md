# デプロイチェックリスト

## 事前準備

### LINE Developers Console
- [ ] LINEログインチャネルを作成
- [ ] LIFFアプリを作成
- [ ] LIFF IDを取得
- [ ] エンドポイントURLを設定（本番URL）
- [ ] スコープを設定: `profile`, `openid`

### 環境変数（Vercel）
- [ ] `VITE_LIFF_ID` - LIFFアプリID
- [ ] `VITE_API_URL` - バックエンドAPIのURL

### 環境変数（Railway/Backend）
- [ ] `DATABASE_URL` - PostgreSQL接続文字列
- [ ] `PORT` - サーバーポート（通常3001）
- [ ] `FRONTEND_URL` - フロントエンドURL（CORS用）
- [ ] `LINE_CHANNEL_ID` - LINEチャネルID
- [ ] `LINE_CHANNEL_SECRET` - LINEチャネルシークレット
- [ ] `LINE_CHANNEL_ACCESS_TOKEN` - LINEチャネルアクセストークン

### GitHub Secrets
- [ ] `VERCEL_TOKEN` - Vercelトークン
- [ ] `VERCEL_ORG_ID` - Vercel組織ID
- [ ] `VERCEL_PROJECT_ID` - VercelプロジェクトID
- [ ] `RAILWAY_TOKEN` - Railwayトークン
- [ ] `DATABASE_URL` - 本番DB URL
- [ ] `LINE_CHANNEL_ID`
- [ ] `LINE_CHANNEL_SECRET`
- [ ] `VITE_LIFF_ID`
- [ ] `VITE_API_URL`

---

## デプロイ前チェック

### コード品質
- [ ] `npm run lint` がエラーなし
- [ ] `npm run typecheck` がエラーなし
- [ ] `npm run test:run` が全テストパス

### ビルド確認
- [ ] `npm run build` が成功
- [ ] `cd server && npm run build` が成功

### セキュリティ
- [ ] `.env` がコミットされていない
- [ ] シークレットがハードコードされていない
- [ ] CORS設定が本番ドメインのみ許可

---

## デプロイ手順

### 1. データベース（Railway）
```bash
# Railwayでプロジェクト作成
railway login
railway init

# PostgreSQLを追加
railway add postgresql

# DATABASE_URLを取得してメモ
railway variables
```

### 2. バックエンド（Railway）
```bash
cd server

# Prismaマイグレーション
DATABASE_URL="postgresql://..." npx prisma db push

# デプロイ
railway up
```

### 3. フロントエンド（Vercel）
```bash
# Vercelにログイン
vercel login

# デプロイ
vercel --prod
```

### 4. LINE設定更新
1. LINE Developers Console にアクセス
2. LIFFアプリのエンドポイントURLを本番URLに更新
3. コールバックURLを更新

---

## デプロイ後確認

### API確認
- [ ] `https://api.example.com/health` が `{"status":"ok"}` を返す
- [ ] CORS エラーがない

### LIFF確認
- [ ] LINEアプリからミニアプリを開ける
- [ ] ログイン・認証が正常
- [ ] プロフィール取得が正常

### 機能確認
- [ ] 会員証が表示される
- [ ] QRコードが生成される
- [ ] ポイント残高が表示される
- [ ] 予約カレンダーが表示される
- [ ] 予約の作成ができる
- [ ] 予約のキャンセルができる

---

## ロールバック手順

### Vercel
```bash
vercel rollback
```

### Railway
Railwayダッシュボードから以前のデプロイを選択してロールバック

### 緊急時
```bash
# 問題のあるコミットを戻す
git revert HEAD
git push origin main
```

---

## 監視・アラート

### 推奨ツール
- **エラー監視**: Sentry
- **パフォーマンス**: Vercel Analytics
- **ログ**: Railway Logs / Vercel Logs

### アラート設定
- API応答時間 > 3秒
- エラー率 > 1%
- サーバーダウン

---

## トラブルシューティング

### LIFF初期化エラー
1. LIFF IDが正しいか確認
2. エンドポイントURLが正しいか確認
3. HTTPSで提供されているか確認

### CORS エラー
1. `FRONTEND_URL` 環境変数を確認
2. バックエンドのCORS設定を確認

### 認証エラー
1. LINEアクセストークンの有効期限を確認
2. チャネルシークレットが正しいか確認

### データベース接続エラー
1. `DATABASE_URL` が正しいか確認
2. データベースが起動しているか確認
3. ネットワーク/ファイアウォール設定を確認
