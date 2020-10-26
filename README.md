# 割合をSQLで算出したい

```sh
# 依存関係のインストール
yarn
# データベースの立ち上げ
docker-compose up -d
# データベースの初期化
yarn ts-node src/postgresql/seed.ts
yarn ts-node src/mysql/seed.ts
# 計測
yarn ts-node src/postgresql/main.ts
yarn ts-node src/mysql/main.ts
```
