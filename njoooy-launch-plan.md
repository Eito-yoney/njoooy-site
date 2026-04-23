# njoooy LP 公開手順書

**対象バージョン**: v7.8
**最終更新**: 2026-04-22
**公開目標**: 2026-04-30

---

## この手順書の使い方

上から順番にチェックボックスを埋めていけば、`https://njoooy.com/` で LP が公開された状態に到達します。

迷った時は **巻末「つまずき対処」** を参照。それでも解決しない時は次セッションで相談してください。

---

## 公開の全体像

| 項目 | 内容 |
|---|---|
| **作業時間**(手を動かす時間) | 正味 2〜3 時間 |
| **待ち時間** | DNS 伝搬 1〜4 時間、SSL 自動発行 〜1 時間 |
| **必要なもの** | ダウンロード済み 5 ファイル / Vercel アカウント / ドメインレジストラの管理画面ログイン情報 / Google アカウント |
| **完了の定義** | `https://njoooy.com/` で LP が表示される + Google Search Console にサイトマップ送信済み |

**「Google で『njoooy』と検索してヒットする」までは、公開後さらに 1〜14 日かかります**(Google がクロールしてインデックスするまでの待ち時間)。これは手順書完了後の自然待ち。

---

## 進捗チェックリスト(目次を兼ねる)

- [ ] **Step 0**: 事前確認 — 5 分
- [ ] **Step 1**: ローカル動作確認 — 5 分
- [ ] **Step 2**: Vercel にデプロイ — 15 分
- [ ] **Step 3**: Vercel にドメイン追加 — 5 分
- [ ] **Step 4**: DNS 設定 — 15 分 + 伝搬待ち
- [ ] **Step 5**: DNS 伝搬待ち — 1〜4 時間
- [ ] **Step 6**: SSL 証明書発行確認 — 数分〜1 時間
- [ ] **Step 7**: 全ページ動作確認 — 10 分
- [ ] **Step 8**: Google Search Console 登録 — 15 分
- [ ] **Step 9**: Bing Webmaster Tools 登録 — 5 分(任意)

---

## Step 0: 事前確認

### やること

**0-1. 5 ファイル確認**
ダウンロードしたフォルダに以下の構成で 5 ファイルがあることを確認:

```
[あなたが決めたフォルダ名]/
├── index.html
├── robots.txt
├── sitemap.xml
└── legal/
    ├── tokusho.html
    └── privacy.html
```

`legal/` フォルダの存在と、その中の 2 ファイルが特に重要(フォルダ構造ごと Vercel にアップする)。

**0-2. レジストラ確認**
`njoooy.com` を取得したドメインレジストラの管理画面にログインできることを確認。
(お名前.com / Cloudflare / ムームードメイン / Google Domains 等、どこでも可)

**0-3. メール運用確認**
現在 `hello@njoooy.com` 等、njoooy.com のドメインでメールを既に運用しているか確認。
- **運用していない** → Step 4 では **4-A(Nameservers 方式、簡単)** に進む
- **運用している** → Step 4 では **4-B(A/CNAME 方式、既存設定を壊さない)** に進む

### 完了条件

- [ ] 5 ファイルがローカルに揃っている
- [ ] レジストラの管理画面にログインできる
- [ ] Step 4 は 4-A / 4-B どちらに進むか把握

---

## Step 1: ローカル動作確認

アップする前に手元で動作確認。Vercel で問題が出る前に気付くため。

### やること

**1-1. ターミナルを開いて 5 ファイルのフォルダに移動**

```bash
cd [5ファイルのフォルダへのパス]
```

**1-2. 簡易サーバーを起動**

```bash
python3 -m http.server 8000
```

(python3 が無ければ `npx serve .` で代替。Node.js は通常インストール済み)

**1-3. ブラウザで `http://localhost:8000/` を開く**

### 完了条件

- [ ] LP が表示される(包装紙剥がしの preloader → 本編)
- [ ] Footer の「特定商取引法に基づく表記」リンク → 特商法ページが表示される
- [ ] 特商法ページの「← トップへ戻る」で LP に戻れる
- [ ] Footer の「プライバシーポリシー」リンク → プラポリが表示される
- [ ] `http://localhost:8000/robots.txt` を直接開いてテキストが表示される
- [ ] `http://localhost:8000/sitemap.xml` を直接開いて XML が表示される

全て OK なら、ターミナルで **Ctrl+C** でサーバー停止。

---

## Step 2: Vercel にデプロイ

### やること

**2-1. Vercel アカウント作成**(未作成なら)
<https://vercel.com/signup> で Sign Up。**GitHub アカウントでのログインを推奨**(後で GitHub 経由での更新に切り替えやすい)。

**2-2. 新規プロジェクト作成**
<https://vercel.com/new> を開く。

**2-3. ファイルをアップロード**

Vercel の新規プロジェクト画面には、以下のどちらかの入口があります(UI は定期的に変わるので文言はあくまで目安):

- **方法 A(直接アップロード)**: 画面のどこかに「Drag and drop」「Deploy without Git」「Browse」などのボタン / エリアがある
  - 5 ファイル入った**フォルダごと**ドラッグ&ドロップ(または Browse で選択)
  - **重要**: `legal/` フォルダ構造を保ったままアップする必要がある
- **方法 B(GitHub 経由)**: 「Import Git Repository」
  - 先に <https://github.com/new> で `njoooy-lp` リポジトリ(private 推奨)を作成
  - ターミナルで:
    ```bash
    cd [5ファイルのフォルダ]
    git init
    git add .
    git commit -m "v7.8 initial deploy"
    git branch -M main
    git remote add origin https://github.com/YOUR_USERNAME/njoooy-lp.git
    git push -u origin main
    ```
  - Vercel の「Import Git Repository」で `njoooy-lp` を選択
  - Framework Preset: **Other**、Build Command / Output Directory: 空欄

**直接アップロードの UI が見つからなければ方法 B**。方法 B は今後の更新(git push で自動反映)にも楽なので長期的に有利。

**2-4. プロジェクト名を `njoooy` などに設定**(後で変更可)

**2-5. 「Deploy」をクリック**

数十秒でデプロイ完了、`https://njoooy-xxxxx.vercel.app` のような URL が発行される。

### 完了条件

- [ ] Vercel プロジェクト作成済み
- [ ] `*.vercel.app` の Preview URL にアクセスすると LP が表示される
- [ ] Preview URL の Footer → 特商法 / プラポリ 両方開ける
- [ ] Preview URL の `/robots.txt` / `/sitemap.xml` に直接アクセス可能

---

## Step 3: Vercel にドメイン追加

### やること

**3-1. Vercel ダッシュボードで njoooy プロジェクトを開く**

**3-2. Settings → Domains**

**3-3. `njoooy.com` を入力して「Add」**

Vercel が DNS 設定方法として以下のどちらかの画面を表示します(ドメインレジストラに応じて自動判定):

- **「Use Vercel Nameservers」画面**: ネームサーバー 2 つ(例:`ns1.vercel-dns.com`、`ns2.vercel-dns.com`)が表示される
- **「Configure DNS Records」画面**: A レコードや CNAME の具体的な値が表示される

**3-4. 画面に表示された値をメモ**(Step 4 で使用)

画面はそのまま開いておくと Step 4 で参照しやすい。

**3-5. `www.njoooy.com` も追加**(推奨)

同じ Domains 画面で `www.njoooy.com` を入力して Add。Vercel が自動で `www` → `njoooy.com` のリダイレクト設定を提案するので承認。

### 完了条件

- [ ] `njoooy.com` が Vercel プロジェクトの Domains に追加された(ステータスが「Invalid Configuration」または「Pending」。これは Step 4 以降で解消される、正常な状態)
- [ ] 画面に表示されたネームサーバー値 または DNS レコード値をメモした
- [ ] `www.njoooy.com` も追加済み

---

## Step 4: DNS 設定(レジストラ側)

Step 0-3 での判断に応じて **4-A または 4-B のどちらか** に進みます。

### 4-A: Nameservers 方式(メール未使用の場合、簡単)

#### やること

**4-A-1. レジストラの管理画面で `njoooy.com` の「ネームサーバー設定」を開く**

**4-A-2. 現在のネームサーバーを Vercel のものに変更**

Step 3 でメモした Vercel のネームサーバー 2 つに置き換える。通常:

```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

(**実際には Vercel ダッシュボードで表示された値を使ってください**。ネームサーバーはアカウント・リージョンで異なる可能性あり)

**4-A-3. 保存**

#### 完了条件

- [ ] ネームサーバーが Vercel のものに変更された

### 4-B: A / CNAME 方式(メール運用中の場合、既存設定を守る)

#### やること

**4-B-1. レジストラの管理画面で `njoooy.com` の「DNS レコード設定」を開く**

**4-B-2. 既存の MX レコード(メール用)は絶対に触らない**

MX レコードを消すとメール受信が止まります。必ず維持してください。

**4-B-3. A レコードを追加 または 変更**

既に `@`(ルート)の A レコードが他のサイトを指していれば編集。無ければ新規追加。

```
Type: A
Host / Name: @ (または空欄、レジストラにより表記違い)
Value: 76.76.21.21
TTL: Auto または 3600
```

(**実際には Vercel ダッシュボードで表示された IP を使ってください**)

**4-B-4. CNAME レコード `www` を追加**

```
Type: CNAME
Host / Name: www
Value: cname.vercel-dns.com
TTL: Auto または 3600
```

**4-B-5. 保存**

#### 完了条件

- [ ] A レコード(`@` → Vercel の IP)を設定
- [ ] CNAME レコード(`www` → `cname.vercel-dns.com`)を設定
- [ ] MX レコード(メール)は変更なしで維持されている

---

## Step 5: DNS 伝搬待ち

DNS 設定を変更してから、世界中の DNS サーバーに反映されるまで通常 **1〜4 時間**、遅くて 24 時間。この間は待機。

### 進捗確認方法

ターミナルで:

```bash
dig njoooy.com
```

または <https://dnschecker.org/> に `njoooy.com` を入力して、世界各地のサーバーの見え方を可視化。

Vercel の IP(`76.76.21.21` 等、または 4-A 方式ならネームサーバー)が返ってくるようになれば伝搬完了。

### 完了条件

- [ ] `dig njoooy.com` で Vercel の IP / Nameserver が返ってくる
- [ ] ブラウザで `https://njoooy.com/` にアクセスして何か表示される(エラー画面でも可、SSL は Step 6 で)

---

## Step 6: SSL 証明書発行確認

Vercel は Let's Encrypt で無料 SSL を自動発行。DNS が Vercel に向いた後、**数分〜1 時間以内** に有効化。

### やること

**6-1. Vercel ダッシュボードの Domains 画面に戻る**

**6-2. `njoooy.com` の横に緑のチェックマークが付いているか確認**

緑チェック = SSL 発行完了。

**6-3. ブラウザで `https://njoooy.com/` を開き、URL バーに鍵マークが表示されるか確認**

### 完了条件

- [ ] Vercel Domains 画面で `njoooy.com` に緑チェック
- [ ] `https://njoooy.com/` にアクセス、URL バーに鍵マーク付き
- [ ] `https://www.njoooy.com/` もアクセス可能、自動で `https://njoooy.com/` にリダイレクトされる

**🎉 Phase 1(URL アクセス可能化)完了。これで njoooy.com で LP が見られる状態になりました。**

---

## Step 7: 全ページ動作確認

本番環境での最終確認。

### やること

`https://njoooy.com/` で以下を網羅的に確認:

### 完了条件

**LP 本体**
- [ ] Preloader 演出 → 本編が正しく表示される
- [ ] スクロールで各セクションが表示される(About / For Whom / Services / Process / Method / FAQ / Contact)
- [ ] Contact フォームの各入力欄にフォーカス可能(送信は未接続、次セッションで対応)

**Footer リンク**
- [ ] 「特定商取引法に基づく表記」→ `/legal/tokusho.html` が開く
- [ ] 「プライバシーポリシー」→ `/legal/privacy.html` が開く
- [ ] 特商法ページ上部の「njoooy」ロゴ → LP に戻る
- [ ] プラポリページの「← トップへ戻る」→ LP に戻る
- [ ] 特商法ページ下部の「プライバシーポリシー」 → プラポリに遷移
- [ ] プラポリページ下部の「特定商取引法表記」 → 特商法に遷移

**直接アクセス**
- [ ] `https://njoooy.com/robots.txt` → テキスト表示
- [ ] `https://njoooy.com/sitemap.xml` → XML 表示

**モバイル**
- [ ] スマホ実機で `https://njoooy.com/` を開いて正しく表示される
- [ ] スマホで Footer の legal リンクも動作する

**a11y(軽く)**
- [ ] デスクトップで `Tab` キーを押すと左上に「メインコンテンツへスキップ」リンクがスライドイン
- [ ] `Tab` を押し続けると各 CTA / リンクに gold の focus リングが表示される

---

## Step 8: Google Search Console 登録

「njoooy」で検索したときに LP がヒットするための準備。所要時間 15 分。

### やること

**8-1. <https://search.google.com/search-console> にアクセス**
(Google アカウントでログイン)

**8-2. 左上「プロパティを追加」→「ドメイン」を選択**

「URL プレフィックス」ではなく必ず **「ドメイン」** を選ぶ。ドメイン全体を登録できて後で楽。

**8-3. `njoooy.com` を入力**

`https://` や `www` は不要。ドメイン名のみ。

**8-4. TXT レコードが表示されるのでコピー**

```
google-site-verification=XXXXXXXXXXXXXXXX
```

のような文字列。

**8-5. レジストラ(4-A 方式なら Vercel の DNS 画面)で TXT レコードを追加**

- 4-A 方式の場合:Vercel ダッシュボード → Settings → Domains → `njoooy.com` → DNS Records で TXT レコードを追加
- 4-B 方式の場合:レジストラの DNS 設定画面で TXT レコードを追加

```
Type: TXT
Host / Name: @ (または空欄)
Value: google-site-verification=XXXXXXXXXXXXXXXX (実際の値)
```

**8-6. Search Console 画面に戻って「確認」をクリック**

TXT レコードの反映に数分〜1時間かかる場合あり。失敗したら時間をおいて再試行。

**8-7. 所有確認成功後、左メニュー「サイトマップ」を開く**

**8-8. 「新しいサイトマップの追加」に `sitemap.xml` と入力して「送信」**

ファイル名だけ(URL 全体 `https://njoooy.com/sitemap.xml` ではない)。

「成功しました」と表示されれば OK。

**8-9. 左メニュー「URL 検査」を開く**

**8-10. `https://njoooy.com/` を検索ボックスに入力 → 「インデックス登録をリクエスト」**

同様に以下の 2 URL も追加でリクエスト:
- `https://njoooy.com/legal/tokusho.html`
- `https://njoooy.com/legal/privacy.html`

### 完了条件

- [ ] Search Console で njoooy.com の所有確認が完了
- [ ] サイトマップが「成功しました」ステータスで送信済み
- [ ] 3 URL のインデックス登録リクエスト送信済み

**🎉 Phase 2(検索インデックスの準備)完了。**

Google が実際にクロールしてインデックスに載せるまで **1〜14 日**。この間は待機。Search Console の「カバレッジ」レポートで進捗確認可能。

---

## Step 9: Bing Webmaster Tools 登録(任意)

Bing / DuckDuckGo / Ecosia からの流入にも備えるなら。所要時間 5 分、簡単。

### やること

**9-1. <https://www.bing.com/webmasters> にアクセス**(Google アカウントでログイン可)

**9-2. 「Import from Google Search Console」を選択**

Google Search Console 登録済みのサイトを自動 import。所有確認もサイトマップも引き継がれる。

**9-3. `njoooy.com` を選んで import**

### 完了条件

- [ ] Bing Webmaster Tools にプロパティ追加済み(または「任意なのでスキップ」で OK)

---

## 🎉 公開完了

`https://njoooy.com/` で LP が公開され、検索エンジンへの登録準備も完了しました。

Google / Bing からの検索流入は 1〜14 日以内に始まります。Search Console の「検索パフォーマンス」で流入状況を見られるようになります(最初の数日は 0 のまま表示、焦らずに)。

---

## 公開後の次のアクション(精緻化フェーズ、次セッション以降)

優先度順:

1. **favicon 作成**(ブラウザタブのアイコン、無いと寂しい。SVG + PNG 32×32 + iOS 180×180 の 3 形式推奨)
2. **OG image 作成**(1200×630 PNG、SNS シェア時のプレビュー画像)
3. **`[TBD]` コピー確定**(title / description / About 年数 / Why njoooy / Method step 名 / FAQ 答え 等、index.html に 71 箇所残存)
4. **Formspree 接続**(Contact フォームを実際に機能させる。現状は送信時 alert のみのフォールバック動作)
5. **Instagram / note アカウント開設**(現状 `https://instagram.com/njoooy` `https://note.com/njoooy` はダミーリンク)
6. **§2 For Whom の SVG 6枚差替**(現状はプレースホルダー)
7. **その他コピー推敲**(Opening / About timeline / Why njoooy 等)
8. **Kyoto Era 再有効化**(実績蓄積後、HTML コメントアウトを解除)
9. **Next.js 15 化**(更新頻度が上がったタイミング)

これらは次セッション以降で取り組みます。

---

## つまずき対処

### 「Vercel の UI が手順書と違う」
Vercel は UI を頻繁に更新します。画面の文言が違っても、やることは 3 つだけ:
- プロジェクトを作る
- Domains にドメインを追加する
- ファイルがデプロイされていることを確認する

迷ったら公式ドキュメント <https://vercel.com/docs> を参照。

### 「アップロード後、`legal/` が見つからない」
→ `legal/` フォルダ構造を保ったままアップロードされていない可能性
→ Vercel ダッシュボードで該当プロジェクトの「Source」タブを開き、`/legal/tokusho.html` と `/legal/privacy.html` のパスが存在するか確認
→ 無ければ、ローカルで `legal/` フォルダが正しい位置にあることを確認し、親フォルダごと drag & drop で再アップロード

### 「`njoooy.com` にアクセスすると Vercel の 404 画面が出る」
→ DNS は向いているが、Vercel プロジェクトに `njoooy.com` が紐付いていない
→ Vercel ダッシュボード → Settings → Domains で `njoooy.com` が該当プロジェクトの配下にあるか確認
→ 無ければ再度 Add

### 「DNS を設定したが 24 時間経っても反映されない」
→ レジストラ側の設定ミスの可能性
→ レジストラの管理画面でネームサーバーまたは A レコードの値を再確認、Vercel ダッシュボードに表示された値と**完全一致**しているか(前後スペース、末尾ドット等に注意)

### 「`https://njoooy.com` は表示されるが `www.njoooy.com` だけエラー」
→ `www` サブドメインの設定漏れ
→ Step 3 で `www.njoooy.com` を Domains に追加
→ 4-B 方式の場合は、加えて CNAME `www` → `cname.vercel-dns.com` が DNS にあるか確認

### 「Footer の legal リンクをクリックすると 404」
→ `legal/` フォルダのアップロード漏れ(上記「`legal/` が見つからない」を参照)

### 「SSL 証明書が発行されない(`njoooy.com` に鍵マークが付かない)」
→ DNS が正しく Vercel に向いていない可能性
→ `dig njoooy.com` で Vercel の IP が返ってくるか確認
→ DNS は OK なのに SSL が発行されない場合、Vercel ダッシュボードで `njoooy.com` を Remove して再 Add すると再発行が走る(最終手段)

### 「Search Console の所有確認が失敗する」
→ TXT レコードが DNS に反映されていない可能性(数分〜数時間かかる)
→ `dig njoooy.com TXT` で TXT レコードが見えるか確認
→ 見えるのに失敗するなら、TXT の値がコピペ時に前後スペースや改行を含んでいないか再確認
→ 値に `"` (ダブルクォート)が必要なレジストラと、不要なレジストラがある(レジストラのヘルプ参照)

### 「Search Console でサイトマップが読み取れないエラー」
→ `https://njoooy.com/sitemap.xml` に直接アクセスして XML が表示されるか確認
→ 表示されない → sitemap.xml のアップロード漏れ
→ 表示される → Search Console での指定が `sitemap.xml`(URL ではなくファイル名だけ)になっているか確認

### 「preloader がずっと表示されたまま」
→ JavaScript エラーの可能性
→ Chrome デベロッパーツール(Cmd+Option+I / F12)の Console タブでエラー内容を確認
→ Google Fonts の読み込みタイムアウトの場合、時間をおいて再読み込み

### 「想定外のエラーで解決できない」
→ Chrome デベロッパーツール(Cmd+Option+I / F12)の Console タブ + Network タブを開いてエラー詳細を集める
→ スクリーンショットと一緒に次セッションで相談

---

## 参考リンク

- Vercel ドキュメント: <https://vercel.com/docs>
- Vercel ドメイン設定: <https://vercel.com/docs/projects/domains>
- Google Search Console: <https://search.google.com/search-console>
- Bing Webmaster Tools: <https://www.bing.com/webmasters>
- DNS Checker: <https://dnschecker.org/>
- Google Rich Results Test(Schema.org 検証): <https://search.google.com/test/rich-results>

---

*本手順書は v7.8 公開ビルド用。公開後の精緻化フェーズ(Next.js 化、favicon/OG image 作成、[TBD] コピー確定等)は別途対応。*
