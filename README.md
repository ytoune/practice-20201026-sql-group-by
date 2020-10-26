# 割合をSQLで算出したい

```sh
# 依存関係のインストール
yarn
# データベースの立ち上げ
docker-compose up -d
# データベースの初期化
yarn ts-node src/postgresql/seed.ts
yarn ts-node src/mysql/seed.ts
yarn ts-node src/mariadb/seed.ts
# 計測
yarn ts-node src/postgresql/main.ts
yarn ts-node src/mysql/main.ts
yarn ts-node src/mariadb/main.ts
```

## `postgres:13.0`  

| index | 項目 | かかった時間 (ms)
| :-- | :-- | :--
| なし | CASE SUM | 68.17758500576019
| なし | CASE SUM 2 | 60.12009900808334
| なし | CASE AVG | 65.01697398722172
| なし | GROUP BY | 137.92603600025177
| なし | GROUP BY 2 | 83.6627570092678
| あり | CASE SUM | 62.570003002882004
| あり | CASE SUM 2 | 60.56514599919319
| あり | CASE AVG | 69.0283989906311
| あり | GROUP BY | 91.42919300496578
| あり | GROUP BY 2 | 75.24222299456596

## `mysql:8.0.22`  

| index | 項目 | かかった時間 (ms)
| :-- | :-- | :--
| なし | CASE SUM | 465.65529799461365
| なし | CASE SUM 2 | 413.3637180030346
| なし | CASE AVG | 424.914416000247
| なし | GROUP BY | 743.9726179987192
| なし | GROUP BY 2 | 728.8747979998589
| あり | CASE SUM | 531.9412150084972
| あり | CASE SUM 2 | 442.4586120098829
| あり | CASE AVG | 450.6431059986353
| あり | GROUP BY | 231.84844900667667
| あり | GROUP BY 2 | 209.13177299499512

## `mariadb:10.5.6-focal`  

| index | 項目 | かかった時間 (ms)
| :-- | :-- | :--
| なし | CASE SUM | 408.0005840063095
| なし | CASE SUM 2 | 353.89616100490093
| なし | CASE AVG | 363.93634098768234
| なし | GROUP BY | 1342.0051109939814
| なし | GROUP BY 2 | 1224.6118699908257
| あり | CASE SUM | 365.82643100619316
| あり | CASE SUM 2 | 340.48441599309444
| あり | CASE AVG | 356.9275560081005
| あり | GROUP BY | 280.2247450053692
| あり | GROUP BY 2 | 157.4356790035963
