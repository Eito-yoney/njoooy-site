# njoooy brand site

doobydobap.com の「creator hub + recipe archive + shop + about + contact」構成を、njoooy向けに再設計した静的サイトです。

## 構成

- `/` — メインページ。SNS導線、Recent recipes、Service / Shop / AI product への導線
- `/recipes/` — モクテル・カクテル・技法レシピ一覧
- `/service/` — 出張バー、メニュー開発、研修のサービス入口
- `/shop/` — ShopifyをバックエンドにするヘッドレスShop構想
- `/about/` — ブランドオーナー米山丈偉の紹介
- `/contact/` — 問い合わせ
- `/ai-product/` — Writingの代替。エージェント/デジタルプロダクト紹介

## Shopify 方針

初期は `https://njoooy.com/shop/` として同一ドメイン内に置く方針が自然です。

理由:

- ブランドサイト、SNS、Service、AI productからの回遊を切らない
- SEO評価を `njoooy.com` に集約できる
- Shopify Storefront APIで商品・カートを読み、CheckoutだけShopifyに渡せる
- 将来、越境・大規模SKU・運用分離が必要になった時だけ `shop.njoooy.com` を検討できる

## ローカル確認

`index.html` をブラウザで開くとトップページを確認できます。

サブページも相対リンクで動くため、`recipes/index.html` などを直接開けます。
