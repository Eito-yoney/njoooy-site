# njoooy LP — v7.8

Next.js 15 + React 19 + Tailwind CSS v4 で構築された njoooy(旧 joi)の LP(プレビューはスタンドアロン HTML で iterate。**v7.8 から開発用ファイル名を `index.html` に統一**、Vercel 直接デプロイ用)。

## Changelog

比較リファレンス駆動で精緻化。各バージョンで採用/却下を記録。

### v7.8 (2026-04-22) — 公開ビルド(Vercel 直接デプロイ用)

**背景**: ユーザー指示「一旦 LP を公開したい。njoooy.com で検索したら LP が表示される状態にしたい。そしたらもう 1 段階精緻化しよう」。方針決定:

- **A ルート**:スタンドアロン HTML を Vercel で直接公開、Next.js 化は精緻化フェーズに後回し
- **ii**:title / description 等のコピーは全て `[TBD]` 維持のまま公開(R-1 厳格遵守、Google snippet は自動生成待ち)

Claude 単独で進められる「公開に必要な技術雑務」を 1 ターンで全部終わらせる方針。

**変更内容**:

1. **Footer Legal リンクを実パスに接続**(1 箇所、2行修正)
   - 旧: `<a href="#">特定商取引法 [TBD]</a>` / `<a href="#">プライバシー [TBD]</a>`
   - 新: `<a href="/legal/tokusho.html">特定商取引法に基づく表記</a>` / `<a href="/legal/privacy.html">プライバシーポリシー</a>`
   - 利用規約は [TBD] のまま維持(スコープ外、R-6 遵守)

2. **特商法 HTML 作成**(`/home/claude/legal/tokusho.html`)
   - `njoooy-legal-tokusho.md` を HTML に変換
   - LP と同一 design token(paper/ink/wine/gold、serif-jp / serif-en / sans-jp / mono)
   - Skip-link / focus-visible / reduced-motion 対応(LP と同等の a11y)
   - レイアウト:max-width 720px の article 型、装飾控えめで typography 優先
   - 構成:ヘッダー(njoooy ワードマーク + "Legal · 特商法")→ H1 タイトル + 施行日 → hr → 9 セクション → Footer(← トップへ戻る / プラポリへの相互リンク / copyright)
   - `[TBD]` マーカーは `<span class="tbd">` で wine 色強調、R-8 遵守で全 4 箇所維持
   - `<meta description>` のみ事実ベースで Claude 記載(「販売価格、支払方法、役務提供時期、返品・キャンセルに関する特約」の羅列、creative copy ではない)
   - `robots="index, follow"`(Google にインデックスさせる)、`canonical` 設定

3. **プラポリ HTML 作成**(`/home/claude/legal/privacy.html`)
   - `njoooy-legal-privacy.md` を HTML に変換、特商法と同じ CSS スタック
   - ヘッダー表示は "Legal · Privacy"、Footer 相互リンクは「特定商取引法表記」
   - 12 セクション(事業者情報 / 取得情報 / 利用目的 / 第三者提供 / 委託 / 安全管理 / 開示請求 / Cookie / 保管期間 / 未成年 / 変更 / 窓口)
   - `[TBD]` マーカーは 7 箇所維持
   - `mailto:hello@njoooy.com` リンクを §1 / §7 / §12 に配置
   - 外部リンク(Google オプトアウト URL)には `target="_blank" rel="noopener noreferrer"` 整備

4. **robots.txt 作成**(`/home/claude/robots.txt`、6 行)
   - `User-agent: * / Allow: /` で全クローラー許可
   - `Sitemap: https://njoooy.com/sitemap.xml` で sitemap 位置明示

5. **sitemap.xml 作成**(`/home/claude/sitemap.xml`、3 URL 登録)
   - `/`(priority 1.0, weekly)
   - `/legal/tokusho.html`(priority 0.3, yearly)
   - `/legal/privacy.html`(priority 0.3, yearly)
   - `lastmod` は公開予定日 `2026-04-30`

6. **preview.html → index.html リネーム**(v7.8 以降の開発ファイル名統一)
   - 理由:Vercel は root の `index.html` を自動 serve するため、ファイル名を統一すると「開発 → 公開」で混乱しない
   - 旧呼称 `preview.html` は v7.8 以降使用しない(次セッション handover で明記)
   - ファイル内容は v7.7 から Footer Legal 接続のみの変更(他の [TBD] / コピー / CSS / JS は不変)

7. **デプロイ手順書作成**(`/home/claude/njoooy-deploy-guide.md`、10 章)
   - Phase 1(DNS 接続)と Phase 2(検索インデックス)を明確に分離
   - Vercel デプロイ 2 パターン(直接 Upload / GitHub 経由)
   - DNS 設定 2 方式(Nameservers / A+CNAME レコード)、判断基準付き
   - Google Search Console 登録 + sitemap 送信の具体手順
   - トラブルシューティング 5 ケース
   - Day 1 / Day 1-2 / Week 1 / Week 2+ の作業チェックリスト
   - Bing Webmaster Tools も言及(Bing/DuckDuckGo 流入)

**保持したもの**: v7.7 の head/meta scaffold(description / OG / Twitter / canonical / favicon slot / Schema.org JSON-LD / theme-color / robots)、skip-link / focus-visible / 外部リンク aria-label、Kyoto Era の HTML コメントアウト状態、全ての `[TBD]` マーカー(73 → 本体は不変、legal 2 ページで追加 11 マーカー)、preview.html 本体の全コピー・構造

**手を付けなかった項目**(意図的):
- title / description の [TBD] コピー → R-1 遵守、ユーザー確定待ち
- favicon / OG image 実ファイル作成 → 公開後の精緻化フェーズで対応
- 利用規約 HTML 化 → 今回スコープ外、R-6 遵守
- Formspree 接続 → ユーザー endpoint 取得後
- Next.js 化 → 公開後の精緻化フェーズ

**数値まとめ**:
- v7.7 2160行(preview.html) → v7.8 2160行(index.html、Footer Legal 接続のみ、行数変化なし)
- 新規ファイル 5:`legal/tokusho.html`(434行)、`legal/privacy.html`(431行)、`robots.txt`(6行)、`sitemap.xml`(21行)、`njoooy-deploy-guide.md`(331行)
- 総納品ファイル(outputs):index.html + robots.txt + sitemap.xml + legal/2 + README + structure-map + deploy-guide = 8 ファイル

**JSON-LD / HTML 構造検証**: index.html の JSON-LD は v7.7 から変更なし、legal 2 ページは HTML5 validator でエラーなし想定(inline CSS / 基本タグのみ、複雑な構造なし)

**次セッションへの引き継ぎ**:
- ユーザーが `njoooy-deploy-guide.md` に従ってデプロイ作業を実行(Vercel アカウント / DNS / Search Console)
- 公開確認後、Phase 2(精緻化)を開始
- 精緻化の想定タスク:favicon / OG image 作成、[TBD] コピー確定、Formspree 接続、Next.js 化、§2 For Whom SVG 差替、コピー推敲(About / Why njoooy / Method)、Kyoto Era 再有効化判断
- ファイル呼称:v7.8 以降は `index.html`(preview.html は使用しない)
- legal 2 ページも同様に今後の更新対象(施行日更新、[TBD] 確定 等)

### v7.7 (2026-04-22) — Head/meta scaffold 補完 + a11y 細部強化

**背景**: 4/30 公開前の精緻化パスとして、handover §4 の公開必須項目から「コピー確定を伴わず Claude 単独で進められる」技術的土台を 2 トラック同時に処理。Track A(Head/meta の完全欠損を scaffold で埋める)と Track C(キーボード・スクリーンリーダー利用者への基本配慮)。B(v7.4 デッドコード掃除)と D(narrative 診断)は今回は保留。

**変更内容**:

1. **Track A — Head/meta scaffold 補完**(`<head>` 内 5 ブロック追加)
   - **Primary meta**: `description` / `robots="index, follow"` / `theme-color`(light/dark 2値) / `canonical="https://njoooy.com/"`
   - **Open Graph**: `type` / `site_name` / `title` / `description` / `url` / `locale="ja_JP"` / `image`(1200×630 slot) / `image:width` / `image:height` / `image:alt`
   - **Twitter Card**: `card="summary_large_image"` / `title` / `description` / `image`(OG と共通 or 別素材)
   - **Favicon slot 3種**: SVG 優先(`/favicon.svg`)、PNG 32×32 fallback、iOS 180×180(`/apple-touch-icon.png`)
   - **Schema.org JSON-LD**(`@graph` で 2 エンティティ):
     - `ProfessionalService`(@id `#business`):name / url / email / priceRange `¥35,000 – ¥480,000` / areaServed Tokyo / serviceType 3種(Mobile Bartending / Beverage Menu Development / Bar Consulting)/ founder 参照
     - `Person`(@id `#founder`):name `米山丈偉` / jobTitle / worksFor 参照 / knowsLanguage `["ja", "en"]`
     - `description` / `image` / `sameAs`(Instagram/note URL)は公開前に追加する旨を HTML コメントで明記
   - **コピー確定を伴う値(description / OG title 等)は全て `[TBD]` を維持**(R-1, R-8 遵守)
   - **事実ベースで Claude が埋めた値**: 屋号(`njoooy`)/ ドメイン(`njoooy.com`)/ email(`hello@njoooy.com`)/ 氏名(`米山丈偉`、tokusho.md から)/ 価格レンジ(tokusho.md の ¥35K–¥480K)/ Tokyo / 3 serviceType / ja/en
   - 挿入位置: title と preconnect の間、および fonts stylesheet と `<style>` の間

2. **Track C — a11y 細部強化**
   - **Skip-link**: `<body>` 直後に `<a class="skip-link" href="#top">メインコンテンツへスキップ</a>`、通常は `translateY(-120%)` で画面外に退避、Tab 最初の focus 時のみ `translateY(0)` でスライドイン
   - **Skip-link target**: `<main id="top">` に `tabindex="-1"` を追加、プログラム的 focus を可能に。`main:focus` / `main:focus-visible` は `outline: none`(スクロールだけ移動、視覚ノイズ回避)
   - **Focus-visible ring**: `a / button / summary / [tabindex]` に `outline: 2px solid var(--gold-bright) + offset 3px`。cursor: none !important 環境でもキーボードユーザーに位置を伝える
   - **Form input focus-visible**: 既存の `:focus` スタイル(`outline: none` + box-shadow)を活かしつつ、キーボード操作時のみ outline を可視化(mouse click では従来通り、Tab では outline + box-shadow)
   - **外部リンク aria-label + rel 整備**: 3 箇所(Contact card Instagram、Footer Instagram、Footer note)
     - `aria-label="Instagram @njoooy(新しいタブで開きます)"` 形式で共通化
     - `rel="noopener"` → `rel="noopener noreferrer"` へ強化(referrer 漏洩防止)
     - Footer リンクに `target="_blank"` を追加(Contact card と挙動統一)

**保持したもの**: 既存の `<title>` の [TBD]、既存 `@media (prefers-reduced-motion: reduce)` ブロック(8 rules、及第点)、既存 aria 属性 18 箇所、既存 form focus スタイル(border + box-shadow)、全セクション・UI 挙動、Kyoto Era の HTML コメントアウト状態

**手を付けなかった項目**(意図的):
- Track B(v7.4 `.howwework-*` 9 rules 残置 CSS の削除)→ 次ターン以降
- Track D(narrative 診断)→ 次ターン以降
- `<title>` タグ本文の推敲 → R-1 遵守、ユーザー確定待ち
- `description` 等の実コピー → R-1 遵守、ユーザー確定待ち

**数値まとめ**: v7.6 2043行 → v7.7 2160行(+117行。Head meta scaffold +70行程度、Schema.org JSON-LD +30行、CSS focus-visible/skip-link +42行、HTML skip-link+aria 整備 差分)

**[TBD] マーカー総数**: 73件(v7.6 時 56 → Track A で +17、Track C での追加なし、コメント内の [TBD: 差替] 等を含む)

**JSON-LD 構文検証**: Python `json.loads` で parse 成功、`@graph` に 2 エンティティ(`#business` + `#founder`)、founder/worksFor で相互参照

**次セッションへの引き継ぎ**:
- ブラウザ確認(特に: skip-link の Tab 最初での露出、focus ring が各 CTA/リンクで視認できるか、mobile でも skip-link が意図通り動作するか、Schema.org を Google の Rich Results Test で検証)
- Track B の `.howwework-*` デッドコード削除(機械的、5分)
- Track D の narrative 診断(5ステップ整理、別ターンで 30-45分)
- Head の [TBD] コピー(description / OG title / OG image alt 等)を公開前に確定
- OG image(1200×630)作成、favicon 3種作成
- Twitter アカウント開設後に `twitter:site` / `twitter:creator` を追記
- Schema.org に `description` / `image` / `sameAs` を公開前追加

### v7.6 (2026-04-22) — §For Whom のカードグリッド化

**背景**: ユーザーから「§For Whom の6つのケースが縦に並んでいて見辛い。SVG(私が調達)も付けつつ見やすく配置し直して」の指示。

**変更内容**:

1. **§For Whom のレイアウト全面刷新**: 縦スタックの `.case-list` → 2列グリッドの `.case-grid`
   - デスクトップ: 2カラム × 3 行(6カード)
   - モバイル(≤720px): 1カラムにスタック
   - 各カードは **SVG ビジュアル領域(上、aspect-ratio 4/3)+ テキスト本体(下)** の縦構成
   - スクロール長が 6行 → 3行に半減、視覚的リズムが生まれる

2. **SVG プレースホルダー実装**(ユーザーが後で差替)
   - 各カードにケースのテーマに沿った暫定 SVG を配置:
     - 01 Anniversary: カクテルグラス + テーブルのシルエット
     - 02 Corporate: ビルのグリッドパターン + 窓の光
     - 03 Brand/PR: 同心円 + 中心光源(スポットライト)
     - 04 Wedding: 2つの交差する円(wedding rings モチーフ) + 光粒
     - 05 Menu Refresh: ボトル3本の並び
     - 06 New Concept: 設計図(点線枠 + 中央ピン + "concept · blueprint" キャプション)
   - 各 SVG は暗色ベース(ink / wine-deep のラジアル/リニアグラデ)、gold-bright アクセント
   - 右下に `[TBD: SVG 差し替え]` マーカー(mono 9px、rgba-40% opacity で控えめに)
   - HTML コメントで差替方法を明記:「`<div class="case-card-visual">` 内の `<svg>` を置換」

3. **カード構造**
   - `<article class="case-card">` 単位、`data-preview` 属性で既存 cursor-preview システムと互換
   - `.case-card-visual` に SVG と大型カード番号(gold-bright, italic, clamp 38-52px)+ TBD ラベル
   - `.case-card-body` に en kicker / jp title(折り返し) / desc / tags
   - タグは `margin-top: auto` + `padding-top: 8px` で底辺揃え、異なる行数の desc でも整列
   - Hover: `translateY(-3px) + box-shadow 0 8px 32px rgba(8,5,3,0.08) + border wine` (浮遊 + 強調)

4. **CSS 全面刷新**(旧 flat layout → card layout)
   - 新規: `.case-grid`, `.case-card`, `.case-card-visual`, `.case-card-num`, `.case-card-svg-tbd`, `.case-card-body`, `.case-card-en`, `.case-card-jp`, `.case-card-desc`, `.case-card-tags`
   - 削除: `.case-list`, `.case-row`, `.case-num`(flat), `.case-body`, `.case-jp`, `.case-en`, `.case-desc`, `.case-meta`, `.case-meta-row`(v7.1 で既に撤去済)
   - 保持: `.case-tag`(新レイアウトでも流用、`margin-*` 削除で `.case-card-tags` 内 gap に依存)

5. **タイトルを意図的に2行で設計**(視覚的リズム)
   - カードのタイトルに `<br/>` を入れて 2 行化:「記念日・<br/>誕生日ディナー」など
   - カード間で高さが揃いやすくなり、grid の行が安定

**保持したもの**: For Whom 章のヘッド(中央揃え、タイトル「njoooy が迎えにゆく、6つの場面。」)、First Visit コンパクトストリップ(末尾、変更なし)、6ケースのコンテンツ(案件名・英題・desc・推奨プランタグ)、Chapter 番号(02)、data-preview による cursor-preview 互換

**数値まとめ**: v7.5 1821行 → v7.6 2043行(+222行。SVG placeholders で 6 × 約 25 行 = 150行程度、CSS 刷新と comment で残り)

**次セッションへの引き継ぎ**:
- v7.6 ブラウザ確認(特に: 2 カラム grid のモバイル折り返し、SVG プレースホルダーの視覚 weight、カード Hover 挙動、カードごとのタイトル行数の揃い方、SVG 番号の視認性)
- ユーザーから正式 SVG を入手、6箇所差替
- Formspree endpoint 差替
- [TBD] コピー確定、legal 2md HTML 化、Vercel 接続、4/30 公開

### v7.5 (2026-04-22) — v7.4 merge の revert + Kyoto 隠蔽 + FAQ 矢印 + Contact フォーム

**背景**: v7.4 で §Process と §Method をマージした「§How We Work」が **ユーザーにとってわかりにくかった**ため revert の指示。あわせて「Kyoto Era は1件目獲得に不要なので実績ができるまで非表示に」「FAQ 展開マークを下向き矢印に + ホバー強調」「Contact フォームを実装(Formspree は後で繋げる)」の4点対応。

**v7.4 からの変更**:

1. **§HowWeWork マージを revert**
   - 新 §4「How We Work / 聞く、組む、届ける」(3 phase × Craft + Business)を削除
   - 旧 §4「ご依頼の流れ / Business Flow」(6 step timeline)を復元
   - 旧 §5「一杯の哲学 / The njoooy Method」(3 step 哲学 + tags)を復元
   - 2章の間の中間 marquee も復帰(「業務の流れから、一杯の設計へ」)
   - v7.4 で追加した `.howwework` 系 CSS クラスは未使用のまま残置(次バージョンで削除予定、ただし現状は害なし)

2. **§Kyoto Era を HTML コメントアウト**(非表示、将来再有効化予定)
   - `<section class="past" id="past">` 全体を `<!-- ... -->` で包み、ブラウザレンダリングから除外
   - コメントブロック上部に **詳細な再有効化手順** を付記:
     - コメントマーカーを外す
     - FAQ(Chapter 06 → 07)と Contact(Chapter 07 → 08)を renumber
     - structure-map を更新
   - コメント内の Kyoto 章ラベルは **「Chapter 06」に pre-set** 済み(再有効化時に修正不要)
   - 理由:1件目の獲得に Kyoto Era の [TBD] だらけのカードは必須ではなく、逆に空虚感を与える。実績や Kyoto の具体内容が揃うまで隠す判断
   - 非表示でも HTML は保持 → 視覚デザイン(past-card のレイアウト、SVG、meta row)は損なわれない、CSS は残置

3. **Chapter 番号を再計算**(v7.4 の7章構成から、Kyoto 非表示により可視6章+Opening)
   - 可視章: 01 About / 02 For Whom / 03 Services / 04 ご依頼の流れ(Business Flow)/ 05 一杯の哲学(The njoooy Method)/ 06 FAQ / 07 Contact
   - Kyoto は HTML 内に「Chapter 06」としてコメント保存、再有効化時に FAQ→07、Contact→08 に移動

4. **ナビを v7.3 風に戻す**(Method リンク復活、How We Work リンク削除)
   - 旧(v7.4): `About / For Whom / Services / How We Work / FAQ / Contact`
   - 新(v7.5): `About / For Whom / Services / Method / FAQ / Contact`(6リンク、About は先頭のまま)
   - Footer Channels リストも同様に更新

5. **FAQ 展開マーカーを下向き矢印に変更 + ホバー強調**
   - 旧: `+` テキスト(wine 枠線の円形ボタン、open 時 `+` が 45deg 回転して `×` 風)
   - 新: **SVG polyline 下向き矢印**(`M 6 9 L 12 15 L 18 9`)、`stroke-linecap: round` で繊細な質感
   - Toggle CSS: `details[open]` で **180deg 回転**(open 時は上向き矢印)、transform transition 0.35s cubic-bezier
   - ホバー強調:
     - Toggle: `background: var(--wine)` + `color: var(--paper)` + `box-shadow: 0 0 0 6px rgba(107,32,36,0.1)`(halo effect)
     - Q テキスト: `.faq-summary:hover .faq-q { color: var(--wine) }` — Q 全体が wine に変色

6. **Contact フォーム実装**(Formspree-ready placeholder)
   - 旧: `.contact-form-note` 1 行の「近日中に Tally 設置予定」dashed メモ
   - 新: **完全な `<form>` markup**
     - 4 field(お名前 / Email / ご相談種別 select / ご相談内容 textarea)
     - 2 カラム grid(お名前 + Email 同列、select/textarea は full-width)
     - 送信ボタン(paper 塗り、hover で gold-bright + translateY)
     - `action="[TBD: Formspree endpoint]" method="POST"` — Formspree 接続時に endpoint を差し替えるだけで稼働
     - `onsubmit` で **仮 alert**(「Form wiring is pending. Please DM / Email for now.」)— 誤送信防止の fallback
     - placeholder: 日英併記(「山田 太郎 / Taro Yamada」「you@example.com」「日程・場所・人数・ご予算感や、ご相談の背景を簡単に」)
     - select options: njoooy Bar / Menu / Counsel / その他の4種
   - **新 CSS**: `.contact-form-wrap`, `.contact-form-label`, `.contact-form`, `.contact-form-grid`, `.contact-form-field(-full)`, `.contact-form-lbl`, input/select/textarea 共通スタイル、`:focus` で gold-bright + box-shadow halo、`.contact-form-submit`, `.contact-form-note-inline`
   - dark Contact 背景に馴染む paper-on-ink style(input 背景は `rgba(245,240,230,0.06)`、border `rgba(245,240,230,0.16)`)
   - 旧 `.contact-form-note` CSS は新 form styles に置換

**保持したもの**: デザイントークン全て、ブランド名 njoooy、Preloader 包装紙剥がし、固定 Scroll Index、§3-WHY(Why njoooy 3項目)、Sample Menu 3種、Opening Fact strip 3項目、About(stats 削除は v7.4 から継続)、Marquee 削減(2本、v7.4 から継続)、FAQ 6問(v7.4 から継続)

**数値まとめ**: v7.4 1745行 → v7.5 1821行(+76行。form markup + CSS で +約100行、HowWeWork CSS 残置、Process+Method 復元で compound delta)

**次セッションへの引き継ぎ**:
- v7.5 ブラウザ確認(特に: FAQ 下向き矢印の視認性と hover 時の halo effect、Contact form のダーク背景での可読性、Process → marquee → Method の流れ感、Kyoto 非表示後の §Method → §FAQ の遷移が自然か)
- Formspree endpoint 取得・差し替え(action 属性 + onsubmit 削除)
- [TBD] コピー確定、legal 2md の HTML 化 + footer リンク、Vercel 接続、4/30 公開
- v7.4 の `.howwework` 系 未使用 CSS のクリーンアップ(将来バージョン)

### v7.4 (2026-04-22) — 改善ループ第2周(T1+T2 全項目)

**背景**: v7.3 完了後、ユーザーから「もう一周改善ループを回してほしい」+「§4 Business Flow と §5 Method の内容が類似しているので統合」の指示。Δ 診断で 7 つの残課題を特定、T1(§4+§5 merge 関連)+ T2(FAQ 縮減・About 軽量化・marquee 整理)の全項目を実装。

**Δ 診断で見つかった v7.3 残課題**:
1. §4 Business Flow と §5 Method が「ステップ型図解」の連続で読む価値が薄まる(ユーザー指摘)
2. §1 About が冒頭で情報量多め(image + text + pull + timeline + stats)
3. §7 FAQ 10問は立ち上げ期には overkill
4. marquee 4本は過剰
5. ナビリンクが v7.3 の About 繰上げに追従していない

**変更内容**:

1. **§Process + §Method を §How We Work にマージ(核心)**
   - 旧 §4「ご依頼の流れ / Business Flow」(6 step)と旧 §5「一杯の哲学 / The njoooy Method」(3 step)を削除
   - 新 §4「How We Work / 聞く、組む、届ける」を構築、kicker は `The njoooy Method × Business Flow`
   - 3 phase 構成(聞く/組む/届ける = Listening/Designing/Delivering)
   - 各 phase 内に **Craft**(一杯のための)+ **Business**(お客様との接点)の 2 cell 構造
   - Craft 側: Method 由来の craft 哲学テキストと tags(Scene/Guests/Mood/Dietary, Balance/Aroma/Arc/Pacing, Counter/Dialogue/Rhythm/Care)
   - Business 側: Process 由来の 6 step を 3 phase に再配分(聞く=Inquiry+Hearing+Proposal、組む=Contract+Preparation、届ける=Event Day+Follow-up)
   - 各 phase 末尾に Timing 行
   - Section 末尾に `— njoooy Method × Business Flow, Vol. 001` 署名
   - Process と Method の間にあった中間 marquee(v7.3 新設)は役割を終えたので削除
   - 結果: 2章 → 1章、narrative が「業務と craft を分けない」という宣言に昇格

2. **新 CSS 追加**: `.howwework`, `.howwework-inner`, `.howwework-head`, `.howwework-kicker`, `.howwework-desc`, `.phases`, `.phase`, `.phase-num`, `.phase-body`, `.phase-header`, `.phase-jp`, `.phase-en`, `.phase-content`, `.phase-cell`, `.phase-sublabel`, `.phase-craft-desc`, `.phase-business-list`, `.phase-meta-row`, `.phase-timing`, `.phase-timing-label`, `.phase-timing-value`, `.phase-tags`, `.phase-tag`, `.howwework-sign`, `.howwework-sign-brand`
   - 中央揃えヘッド utility(`.fw-head, .archive-head, …`)に `.howwework-head` を追加

3. **ナビ更新**(About 繰上げと Method 削除への追従)
   - 旧: `For Whom / Services / Method / About / FAQ / Contact`
   - 新: `About / For Whom / Services / How We Work / FAQ / Contact`
   - Footer の Channels リストも同様に更新

4. **Chapter 再番号**(8章 → 7章)
   - About 01(不変)/ For Whom 02(不変)/ Services 03(不変)/ How We Work 04(new merged)/ Kyoto Era 05(06→05)/ FAQ 06(07→06)/ Contact 07(08→07)

5. **FAQ 10問 → 6問に縮減**
   - 残: Q.01 見積無料 / Q.02 対応エリア / Q.05 ノンアルのみ (→新 Q.03)/ Q.07 英語対応(→新 Q.04)/ Q.08 アレルギー(→新 Q.05)/ Q.09 キャンセル(→新 Q.06)
   - 削除: Q.03 屋外(Q.04 備品と近い)/ Q.04 備品(個別 Contact で応答可)/ Q.06 試飲(Menu/Premium 固有、個別対応可)/ Q.10 深夜料金(specific、個別対応可)
   - FAQ head description の「10件」→「6件」、meta 行の「10 questions」→「6 questions」も更新

6. **§About stats ブロック削除**
   - Experience [TBD] yrs / Location Tokyo, JP / Languages JP / EN
   - これら3項目は既に Opening fact strip、About timeline、Why njoooy と重複 → 削除
   - About が Chapter 01 として冒頭に来る状況で情報密度を下げ、離脱リスク軽減
   - 関連 CSS(`.about-stats`, `.about-stat-label`, `.about-stat-value`)も撤去

7. **marquee 整理(4本 → 2本)**
   - 残: Opening 直後 marquee(brand voice)/ How We Work 直後 marquee dark(craft 哲学のリフレイン)
   - 削除: Process と Method の間の marquee(v7.3 新設、merge で役目終了)/ FAQ と Contact の間の marquee wine(機能薄い)

**保持したもの**: デザイントークン全て、ブランド名 njoooy、Chapter 命名規則、全サービスのプラン詳細と価格、Why njoooy 3項目、Sample Menu 3種、§Kyoto Era の3カード、Contact 3カード、全 [TBD] マーカー、Preloader 包装紙剥がし演出、固定 Scroll Index、他全アニメーション

**数値まとめ**: v7.3 1706行 → v7.4 1745行(+39行。FAQ 縮減・About stats 削除・marquee 2本削減で -約70行、§HowWeWork の phase 3構造で +約110行)

**次セッションへの引き継ぎ**:
- v7.4 ブラウザ確認(特に: §HowWeWork 3 phase の Craft + Business 2cell レイアウトが読みやすいか、phase 番号の大型表示のバランス、Timing 行と Tags の配置、ナビ 6リンクの幅、About stats 削除後の下半分バランス、FAQ 6問の余裕)
- [TBD] コピーの必須箇所確定(About 年数、Kyoto K.01-03、Why njoooy 各項目、HowWeWork 各 phase の Craft テキスト推敲)
- structure-map v7.4 反映
- legal 2md の HTML 化 + LP footer リンク
- Tally フォーム設置、Vercel 接続、4/30 公開

### v7.3 (2026-04-22) — narrative 診断に基づく構造再編(Level A + About 繰上げ + Why njoooy)

**背景**: 「LPに来る人はどんな文脈/期待/知りたいこと?それに LP のストーリーはフィットしているか?」のユーザーからの戦略診断依頼に対して、バイアス抜きで分析:

1. 最大セグメント = Warm lead(比較検討モードの Corporate / Brand / Restaurant 評価者、推定40%)
2. 現 LP の「21歳 Documentary」narrative が premium価格(¥130,000-¥480,000)と衝突 — Warm lead の conversion を阻害
3. §6 Archive "初案件募集中" は実績ゼロを強調、B2B 評価者に離脱シグナル
4. About が §5 と遅い配置 — 個人ブランドサービス業の定石から外れる
5. Why njoooy(差別化ポイント)が明示されていない — 比較検討時の「なぜここか」に答えていない

**採択**: Level A(narrative-price 衝突緩和)+ About §1 繰上げ + Why njoooy 追加。Level C(根本的 narrative 切替)は投資済みブランドアセットを捨てるため見送り。

**変更内容**:

1. **21歳 / Documentation 語彙の出現箇所を絞り込み**
   - Opening top meta: `Est. MMXXVI · No. 001` → `Est. MMXXVI · Tokyo`
   - Opening sub: `— a document of a 21-year-old bartender arriving in Tokyo.` → `— cocktail & non-alcoholic, designed with equal intensity.`
   - Opening bottom: `京都から来た21歳のバーテンダー、njoooy の記録がはじまります` → `京都で学び、2026年東京へ。カクテルもノンアルも、同じ設計精度で。`
   - Marquee 1: `Documentation Vol.001 / 21歳の記録` → `Cocktail & Non-Alcoholic / 同じ設計精度で / 京都仕込み、東京着地`
   - Footer tagline: `a document of a 21-year-old bartender…` → `cocktail & non-alcoholic, designed with equal intensity. Based in Tokyo.`
   - 21歳は About(§1)の自己紹介内のみに留置(narrative として正当な場所)
   - Documentation は Preloader + Footer の儀式位置のみ残置

2. **About を §1 に繰上げ**(個人ブランドサービス業の定石に合わせ、who/why を先行)
   - HTML section 移動 + Chapter 再番号(About=01, ForWhom=02, Services=03, Process=04, Method=05, Kyoto=06, FAQ=07, Contact=08)
   - 本文内の章番号参照も更新(For Whom → "Chapter 03 Services"、Method → "業務の流れ(Chapter 04)")

3. **§6 Past → Kyoto Era に差し替え**(実績ゼロの強調を過去の経験に転換)
   - Chapter ラベル: `Archive / Forthcoming` → `京都での日々 / Kyoto Era`
   - タイトル: `これから、ここに記録が溜まっていきます` → `東京の前、京都で立っていた`
   - 空枠6カード(Reserved / Upcoming)→ 3枚の京都時代カード(K.01 Venue / K.02 Craft / K.03 Lineage)
   - 末尾メタ: `Archive opens on first booking` → `Tokyo records continue from here — No.001 onward`

4. **Opening Fact strip を 5項目 → 3項目に削減**(重複解消)
   - 残: 拠点 / 得意領域 / 対応言語
   - 削除: 開始(About timeline と重複) / 対応規模(Services と重複)

5. **Why njoooy ブロックを §3 Services 先頭に追加**(差別化の明示)
   - 3項目: ノンアルも同じ設計精度で / 京都ホテルバー基礎 × 東京柔軟性 / 少人数特化 × バイリンガル対応
   - 配置: archive-head と最初の folio の間、surface 背景 + 枠線で独立ブロック
   - CSS: `.why-njoooy`, `.why-head`, `.why-grid`, `.why-item`, `.why-num`, `.why-title`, `.why-desc`

6. **Sample Menu を 6種 → 3種 に削減**(情報密度調整)
   - 残: 01 Kyoto Old Fashioned / 02 Hinoki Garden / 03 Tokyo Midnight Martini
   - 削除: 04 Kagé — Shadow Negroni / 05 Sakura Fizz '26 / 06 Hosomichi Pairing
   - 削除分は将来の Sample Menu 拡張時に再追加可能

7. **Process と Method の間に marquee 挿入**(視覚的息抜き + narrative shift 合図)
   - 「業務の流れから、一杯の設計へ / 味を聞く、構造を組む、手から届ける / The njoooy Method」

**保持したもの**: デザイントークン全て、ブランド名 njoooy、Chapter 命名規則、全サービスのプラン詳細と価格、Method 3step、Business Flow 6step、FAQ 10問、Contact 3カード、全アニメーション、既存の [TBD] マーカー

**数値まとめ**: v7.2 1788行 → v7.3 1706行(-82行)

**次セッションへの引き継ぎ**:
- v7.3 ブラウザ確認(特に: Opening から About への直接遷移の流れ、Why njoooy ブロックの視覚 weight、Kyoto Era 3カードのバランス、Process→marquee→Method の切り替わり、Sample Menu 3種のレイアウト)
- [TBD] コピーの必須箇所確定(About 年数、Kyoto K.01-03 の内容、Why njoooy 各項目)
- legal 2md の HTML 化 + LP footer リンク追加
- Tally フォーム設置、Vercel 接続、4/30 公開

### v7.2 (2026-04-22) — 情報構造の重複解消(Cluster 1 D + Cluster 2 E)

**背景**: ユーザーが v7.1 を確認し、以下2点の情報重複を相談として指摘:
- Cluster 1:`For Whom × First Visit × Services` の3章で似た情報が繰り返される
- Cluster 2:`Process × Method` の2章がどちらも「手順/ステップ」に見えて混乱する

診断: Cluster 1 は実際の冗長(プラン名や推奨がシーン・入口・商材の3層で繰り返される)、Cluster 2 は内容は別物だが命名が紛らわしいと判定。ユーザーは D(情報再配置)と E(命名明確化)を選択。

**Cluster 1 対応(D: For Whom はユースケースのみ、仕様は Services に一元化、First Visit は短縮)**:
- **§For Whom の case-meta 削除**: 6ケース行すべてから右カラムの「Party size / Duration / Format / Lead time / Deliverables」を削除。仕様情報は §Services の Folio 内に一元化
- **`.case-row` grid 変更**: `80px 1fr 260px` → `80px 1fr`(右カラム廃止により)
- **§First Visit の全面刷新**: 従来の大型3カード(タイトル + 質問文 + 推奨プラン + CTA ×3)を、単一のコンパクトストリップに置換。ピル型リンク3個(「初めての方 → Counsel」「少人数の集まり → Bar Private」「店舗のメニュー → Menu Starter」)+ 下部に「どれか迷ったら、直接ご相談 →」CTA。各リンクは §Services に飛ぶ(入口 → プラン詳細の自然導線)
- **CSS 刷新**: 旧 `.fv-card-ques/-arrow/-rec/-cta`, `.fv-lead/-lead-meta/-lead-title`, `.fv-rec` を全削除。新 `.fv-compact/-label/-options`, `.fv-opt(-q/-sep/-rec)`, `.fv-compact-cta` を追加
- **役割分担が確立**: For Whom =「シーン起点 catalog」/ Services =「プラン詳細 canonical」/ First Visit =「迷子向け短いショートカット」

**Cluster 2 対応(E: 命名と副題で「流れ」vs「哲学」を区別)**:
- `Chapter 03 — Process / ご利用の流れ` → `Chapter 03 — ご依頼の流れ / Business Flow`(日本語先行、「業務の流れ」と明示)
- `Chapter 04 — The njoooy Method / 一杯を組む、設計の哲学` → `Chapter 04 — 一杯の哲学 / The njoooy Method`(日本語「一杯の哲学」を先頭に、Method は英題扱い)
- method-desc は既に「業務の流れ(Chapter 03)とは別に、ここでは『一杯そのものをどう設計するか』」と明示的差別化を含んでおり、そのまま保持

**数値まとめ**: v7.1 1824行 → v7.2 1788行(-36行、情報密度の重複が実態としても解消)

**保持したもの**: §For Whom の6ケース行コンテンツ(シーン名・英題・説明・推奨プランのcase-tag)、§Services の全プラン詳細と Sample Menu、§Process の6ステップ、§Method の3ステップ哲学と tags、デザイントークン、Chapter 番号(01-08)

**次セッションへの引き継ぎ**:
- v7.2 ブラウザ確認(特に: For Whom の case-row が 2カラム grid で崩れていないか、First Visit コンパクトストリップのピル型リンクがモバイル幅で適切に折り返すか、Chapter 03 と Chapter 04 のラベル差異が十分明確に感じられるか)
- [TBD] コピー確定、legal 2md の HTML 化 + footer リンク、Tally、Vercel、4/30 公開

### v7.1 (2026-04-22) — ユーザー指摘8件の情報構造・インタラクション調整

**背景**: ユーザーがブラウザで v7 を確認し、8件の具体的な改善要望を指摘。構造・演出・視認性の観点でまとめて調整。

**変更リスト**:

1. **§Preloader 包装紙剥がし演出**: 従来の単純 slide-up 退場を、上下2分割のハーフ(jagged clip-path でジグザグに破れる)が80msの時差で反対方向に引き離される演出に置換。Wordmark の内容は両 half に duplicate 配置、退場時にパカッと剥がれて中身(Opening)が現れる
2. **固定 Scroll インジケータ**: 画面右下に pin した「Scroll / NN / TT」を新設(`.scroll-index`)。`mix-blend-mode: difference` で背景色に応じて自動反転、JS でスクロール位置から現在の `<main section>` を判定して current 番号を更新。total はページ内の section 数から自動計算
3. **§01 Intro(Chapter 01 — Hello)削除**: 内容の大半が §Opening と重複していたため削除。CTA 2つ(お問い合わせ / Services & Prices ↓)と Fact 5項目(Based in / Founded / Specialty / Language / Scope)を §Opening 下部に移植
4. **Fact 項目の日本語化**: Based in → 拠点 / Founded → 開始 / Specialty → 得意領域 / Language → 対応言語 / Scope → 対応規模。値も「東京」「カクテル／ノンアル」「日本語／英語 B1」「個人・法人」等に変換(「April 2026」のみ英語維持、欧文書体の装飾が効くため)
5. **セクションヘッド中央揃え標準化**: §For Whom / §Services / §Process / §Method / §About / §Past / §FAQ / §Contact の全8セクションで、Chapter ラベル + 章タイトルが左右2カラム配置だったのを、ラベル上・タイトル下の縦スタック+中央揃えに統一。§About のみ image+text の2カラム構造に影響するため、章ヘッダーを grid の外に出して独立配置
6. **§Services / Archive 04(研修プログラム)の再デザイン**: 従来は小さな coming-soon strip(高さ ~80px の弱い表示)だったのを、他3つの folio と同じ weight のプレースホルダー folio に昇格。Coming Soon チップ、専用 SVG 図案(格子+円+"04"タイポグラフィ)、"Notify me when open" CTA を追加
7. **§FAQ + マーカー視認性向上**: 従来は plain テキスト `+`(wine 色 32px)で地味だったのを、wine 枠線の円形ボタン(36px、ホバー/展開で塗り反転)に変更。展開時は45deg 回転で×になる既存挙動を保持
8. **ヘッダー(nav)常時視認化**: 従来は dark セクション上で透明背景だったが、初期状態から `rgba(8,5,3,0.38)` + `backdrop-filter: blur(10px)` + 下線 `rgba(245,240,230,0.08)` を付与して常時ヘッダーとして機能するよう強化。light モード(cream 背景上)の切替は既存挙動を維持

**Chapter 再番号**: Intro 削除により Chapter 02→01, 03→02, ..., 09→08 にシフト(計8章)

**保持したもの**: ブランド名 njoooy、デザイントークン全て、サービス名(njoooy Bar / Menu / Counsel / Class)、Method 3step、§Services 内の Sample Menu(v7で統合済)、既存アニメーション(breathing dot、reveal、marquee、cursor preview 等)、nav リンク構造、[TBD] マーカー

**次セッションへの引き継ぎ**:
- v7.1 ブラウザ確認(特に: Preloader の剥がれ演出 3.4s + 1.1s タイミング、Scroll インジケータの blend mode 挙動、中央揃えヘッダーのモバイル幅、Class folio の SVG レンダリング、FAQ 円形ボタンのサイズ感)
- [TBD] コピー確定(特に Fact 値の最終調整、About タイムラインの店舗名/年数、OG タイトル)
- legal 2md の HTML 化 + LP footer リンク追加
- Tally フォーム設置、Vercel 接続、4/30 公開

### v7 (2026-04-22) — 情報構造整理 / 章統合・削減

**背景**: ユーザーが v6 をベースに §Cinematic / §Signature / §Bartender-Reveal の3章を追加した派生版(user_v6.html)を作成。v7 では情報構造の精緻化を目的に、冗長・矛盾・抽象具体リズム不整合の問題を解消。

**構造診断 → ユーザー判断**:
- **問題1 冠頭3連続重複**(Cinematic → Opening → Wordmark) → §Cinematic 削除、§Wordmark を Preloader に統合
- **問題2+5 §Signature の位置と Past Case との矛盾**(「定番になりつつある6つ」vs「初案件募集中」) → §Signature 独立章を削除し、§Services / Archive 01 njoooy Bar 内「Sample Menu / 派生例」として再配置。per-drink 価格(¥1,400〜¥2,200)を削除し、per-event パッケージ価格体系との矛盾を解消
- **問題3 §Bartender-Reveal と §About の役割重複** → §Bartender-Reveal 削除、About の既存画像で代替
- **問題4 抽象/具体リズム不整合 + §Philosophy がピンとこない** → §Philosophy 削除、核心タグライン「飲む日も、飲まない日も、同じ温度で」は About の pull quote / Intro / Method で既に多重化されており情報損失なし

**追加・改修**:
- **+ Preloader 刷新**: 従来の小さな logo 表示(60px)から、旧 Wordmark セクション全体(巨大 `njoooy` + No.001 / Tokyo · 2026 / Cocktail & Non-Alc / Documentation Vol.001 —)を preloader 内に統合。表示時間を 2s → 3.4s に延長、wordmark フェードインアニメーション追加
- **+ Folio Sample Menu(Archive 01 njoooy Bar 内)**: 6枚のシグネチャーカード(Kyoto Old Fashioned / Hinoki Garden / Tokyo Midnight Martini / Kagé / Sakura Fizz '26 / Hosomichi Pairing)を horizontal scroll rail で展示。cream 背景向けに sig-name / sig-desc / sig-meta の色を ink / muted に override
- **+ Chapter 番号連番化**: Philosophy 削除により 07→06, 08→07, 09→08, 10→09 にシフト
- **+ JS クリーンアップ**: sigRail ナビゲーション / bartender scroll-triggered image reveal の dead code 削除(element guard で実害はなかったが、念のため)

**保持したもの**: ブランド名 njoooy、デザイントークン全て、サービス名(njoooy Bar / Menu / Counsel / Class)、Method 3step(味を聞く/構造を組む/手から届ける)、Process 6段階、For Whom 6ケース、Past Case 6枠、FAQ 10問、[TBD] マーカー、ナビゲーション構造

**削除・却下**:
- §Cinematic の SVG シーン(キャンドル3本+ワイングラス+瓶、177行) — 情景重複のため削除
- §Wordmark 独立セクション(17行) — Preloader に統合
- §Philosophy 5原則 "Designed, not mixed / Equal intensity / Document publicly / From Tokyo, for the room / Narrow range, deep design"(56行) — 内容は他セクションで多重化されており削除
- §Bartender-Reveal の SVG ポートレート+大型タイポグラフィ "BARTENDER NJOOOY"(100行) — About と役割重複のため削除
- §Signature 独立章(261行) — Archive 01 内に Sample Menu として統合
- 関連 JS(sigRail ナビ / bartender scroll、約70行)

**数値まとめ**: user_v6.html 2075行 → preview.html 1666行(-409行、約20%減)

**次セッションへの引き継ぎ**:
- [TBD] コピー推敲(「現時点で提供可能な派生例」周辺、Sample Menu の 6つのドリンク名・描写など)は兄・弟で後日確定
- サービス名・Method名は [TBD] 維持
- Tally フォーム差し込み(Month 1 後半、handover §セットアップ参照)
- 特商法表記・プライバシーポリシー(今後のクリティカルパス)
- Next.js componentize(app/ と components/ は v2-era のまま)

### v6 (2026-04-22) — ブランド名刷新:joi → njoooy

**経緯**: joi.com が 2003年既取得で .com 確保不可。「.com 必須」制約下で再検討し、創業者ナラティブを重層化した `njoooy` に切り替え。命名の意図3層:
- **enjoy**(英語一般語、飲む喜びの普遍性)
- **ジョイ**(弟の名前の直接 encode)
- **三つの o**(三兄弟の構造的暗示)

**候補探索の所見**: joy 系短綴りの .com は 2000年代前半に枯渇。日本語複合(京/時/墨 + joy)で .com 空きがあるものは著名ブランド衝突(Suntory Toki Whisky、Sumi Jo 等)を抱える。「.com 空き + 独自性 + 3層ナラティブ」を同時に満たすゾーンは njoooy 系変則綴りのみ、という構造的発見。

**LP 変更(機械置換のみ、創造判断なし)**:
- `joi` → `njoooy`(48箇所、wordmark / Hero / Folio名 / Method名 / Meta / Footer 等)
- `joi.tokyo` → `njoooy.com`(ドメイン・email、6箇所)
- `@joi_tokyo` → `@njoooy`(Instagram・note handle、4箇所)
- サービス名は機械派生:joi Bar / Menu / Counsel / Class → njoooy Bar / Menu / Counsel / Class
- Method 名:The joi Method → The njoooy Method(全て [TBD 要推敲] マーカー維持)

**保持したもの**: デザイントークン全て(色・書体・breathing dot)、章構成(§00 Opening〜§10 Contact)、日本語コピー全て、[TBD] マーカー、Method 3step 名(味を聞く/構造を組む/手から届ける)、Philosophy 5原則、FAQ 10問、Process 6段階、For Whom 6ケース、Past Case 6枠。

**次セッションへの引き継ぎ**: SNS ハンドル `@njoooy` / `@njoooy_tokyo` 等の実在性はユーザー側で Instagram / X / TikTok / Threads 手動確認要。日本 J-PlatPat での商標検索は弁理士依頼推奨。ワードマークのタイポグラフィ(njoooy は 6 文字で joi 3 文字より倍長、Fraunces/Shippori との視覚調整)は v7 で精査候補。

### v5 (2026-04-21) — 角度 B + C(個人職人 / トップスタジオ)

リファレンス: PhiloCoffea(粕谷哲)、Sugicoffee Roasting、Awwwards Portfolio SOTD 直近4ヶ月、Muzli Top 100 2025

- **+ §Method (Chapter 05)**: 「The joi Method」として 3ステップ(味を聞く / 構造を組む / 手から届ける)を明文化。Philosophy(原則)と Services(商材)の橋渡し。PhiloCoffea の「4:6メソッド®」パターンの応用
- **+ First Visit ガイド**: §For Whom 末尾に「初めての方へ 3つの入口」カード。迷った人の onboarding
- **+ About タイムライン**: 2024 / 2025 / 2026.04 / 2026+ の4点歩みを wine ドット(過去) + gold ドット(現在・breathing) + muted ドット(未来)で可視化
- **+ カーソル連動画像プリビュー**: `[data-preview]` 要素(§For Whom の6ケース行、§Past Case の6カード)ホバー時に、カーソル横に画像プリビューが浮く。各ケースに専用グラデーション(pv-v1〜pv-v6 / pv-reserved)
- **— Deferred to v6**: Instagram 埋め込み、Case 詳細ページ化、エディトリアル/マガジン角度の検討
- About 画像を `position: sticky` に変更(テキスト側がスクロールしても画像が追従)
- Marquee dark に「味を聞く／構造を組む／手から届ける」のキャッチコピー追加

### v4 (2026-04-21) — 角度:日本出張バー × 米国ビバレッジコンサル

リファレンス: Organic Bartender Association、Cocktails in Motion、Unfiltered Hospitality、Mix & Twist

- **+ §For Whom**: 6ユースケース(記念日/法人/ブランド/ウェディング/メニュー刷新/新業態)を case row 形式で
- **+ §Process**: 6-step timeline(Inquiry → Hearing → Proposal → Contract → Event → Follow-up)
- **+ §Past Case**: Archive Forthcoming、空枠 6 枚で「初案件募集中」を能動的に打ち出す
- **+ §FAQ**: 10問 accordion(見積/エリア/屋外/備品/ノンアル/試飲/英語/アレルギー/キャンセル/深夜)
- **+ Services Pricing 拡充**: 各 Folio に「Packages / Typical setup / Included / Not included」の spec セット

### v3 (2026-04-21) — ポートフォリオ/スタジオサイト路線

- 3段階シネマティック開幕(Opening oxblood → Wordmark ink → Hero cream)
- Services をアーカイブ/図録(Folio 01-03)として扱う
- §Philosophy を水平スクロール5枚カード
- カスタムカーソル / スクロール進捗 / マグネティック CTA / IntersectionObserver リビール
- 抽象 SVG プレースホルダ(写真差し替え前提)

### v2 (2026-04-21)

- 温かみのあるクリームパレット(#F5F0E6 ベース) + wine/gold アクセント
- Fraunces(可変軸セリフ)+ Shippori Mincho + Noto Sans JP + JetBrains Mono の4書体構成
- `Chapter 01 — No.001` 式の章番号表示
- 呼吸する `.` マーク
- Hero word-by-word kinetic reveal

## 反復ループ workflow

1. Angle 選定(ユーザー指定 or 候補提示)
2. web_search + web_fetch で3-4サイト調査
3. 構造/設計パターン抽出 + joi への適用可能性判断
4. 採用/却下を明示して v(n+1) へ統合
5. Changelog に記録

## 最新版のデザイン要約

## 📦 セットアップ

```bash
npm install
npm run dev
# → http://localhost:3000
```

> Node.js 20+ 推奨。

## 🗂 ファイル構成

```
joi-lp/
├─ app/
│  ├─ layout.tsx         # ルートレイアウト、フォント読み込み
│  ├─ page.tsx           # トップページ組立
│  └─ globals.css        # Tailwind v4 + テーマ変数 + アニメーション
├─ components/
│  ├─ Logo.tsx           # joi + breathing dot
│  ├─ Nav.tsx
│  ├─ Hero.tsx           # kinetic word reveal 版
│  ├─ Marquee.tsx        # 水平スクロールテキスト
│  ├─ About.tsx
│  ├─ Services.tsx
│  ├─ Contact.tsx
│  └─ Footer.tsx
├─ preview.html          # スタンドアロン HTML(Tailwind CDN 版)
├─ package.json
├─ tsconfig.json
├─ next.config.ts
└─ postcss.config.mjs
```

## 🎨 デザイントークン

| トークン | 値 | 用途 |
|---|---|---|
| `--color-paper` | `#F5F0E6` | 背景(暖色クリーム) |
| `--color-paper-2` | `#EDE6D6` | Contact セクション背景 |
| `--color-surface` | `#FAF6EC` | Marquee 背景・カード hover |
| `--color-ink` | `#1C1712` | メインテキスト・Footer 背景 |
| `--color-ink-2` | `#3A322A` | 本文テキスト(軽くソフト化) |
| `--color-muted` | `#766B5C` | Meta ラベル・控えめテキスト |
| `--color-muted-2` | `#A89E8D` | 補助テキスト・[TBD] 注記 |
| `--color-rule` | `#D9D0BE` | 罫線 |
| `--color-wine` | `#6B2024` | アクセント(CTA ホバー・ドット・sep) |
| `--color-wine-deep` | `#4A1418` | 予備 |
| `--color-gold` | `#C28B5B` | Footer のドット・ホバー |

| 書体 | 用途 |
|---|---|
| **Fraunces**(可変軸) | 欧文装飾・Hero メタ・サービス英題・Marquee |
| **Shippori Mincho** | 和文見出し(Hero headline・Section heading) |
| **Noto Sans JP** | 和文本文・リスト |
| **JetBrains Mono** | Meta ラベル・価格・章番号・編集情報 |

全て Google Fonts 無料配信。`SOFT` と `WONK` の variation axes を Fraunces に設定して微妙な character 揺れを出している。

## ✏️ コピーの [TBD] 箇所一覧

全てのコピーは**仮置き**です:

- [ ] Hero サブテキスト本文
- [ ] About 第1段落「京都で[TBD: 年数]」
- [ ] About 下部 Fact セル「ホテルバー勤務 [TBD: 年数]」
- [ ] Services 各カード description 末尾 [TBD]
- [ ] Contact の Instagram ハンドル(`@joi_tokyo` 仮)
- [ ] Contact の Email アドレス(`hello@joi.tokyo` 仮)
- [ ] Marquee 1・Marquee 2 のキャッチコピー
- [ ] Meta title / OG description(`app/layout.tsx`)
- [ ] Footer 下部の説明文
- [ ] Legal(特定商取引法・プライバシー)のリンク先ページ

## 🌐 公開手順

### 1. GitHub リポジトリ作成

```bash
git init
git add .
git commit -m "initial commit: joi LP v2"
gh repo create joi-lp --private --source=. --push
```

### 2. Vercel デプロイ

1. https://vercel.com で GitHub 連携
2. `joi-lp` リポジトリを Import → デフォルト設定のままデプロイ
3. `*.vercel.app` URL で動作確認

### 3. ドメイン接続

1. Cloudflare Registrar で `joi.tokyo` 取得(未取得の場合)
2. Vercel の Settings → Domains に `joi.tokyo` を追加
3. Cloudflare で Vercel 指定の A/CNAME レコード設定
4. 数分で HTTPS 自動設定完了

## 🔌 Tally フォーム差し込み

Month 1 後半での差し込み手順:

1. Tally でフォーム作成、embed ID を取得
2. `components/Contact.tsx` の「Form」ブロックを以下に置き換え:

```tsx
<div className="contact-card p-6 md:p-8" style={{ background: "transparent" }}>
  <div className="meta-label mb-3">Form</div>
  <iframe
    src={`https://tally.so/embed/${process.env.NEXT_PUBLIC_TALLY_ID}?hideTitle=1`}
    loading="lazy"
    width="100%"
    height="500"
    title="joi お問い合わせ"
  />
</div>
```

3. `.env.local` に `NEXT_PUBLIC_TALLY_ID=xxx` を設定

## 🧪 プレビュー(Next.js セットアップ前の即確認)

`preview.html` をブラウザで直接開くと、同じ見た目を確認できます(Tailwind CDN + Google Fonts CDN 版)。デザイン確認だけしたい場合や、Next.js 環境をまだ用意していない場合に使用。

## 🚫 Month 1 では作らない(Month 2+ の課題)

- `/services/[slug]` 個別商材ページ
- `/cases` 事例集ページ
- `/notes` ブログ・お知らせ一覧
- `/legal/tokushoho`・`/legal/privacy`
- OG 画像(1200 × 630)の差し替え
- サイトマップ / robots.txt の最適化
- 多言語対応(英語ページ)
