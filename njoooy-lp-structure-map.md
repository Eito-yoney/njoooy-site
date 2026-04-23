# njoooy LP — セクション構造マップ

**対象バージョン**: v7.10(2026-04-23、Block 3 技術穴埋め完了)
**目的**: 修正指示を出すときの参照用。「§2-03 の SVG」「§FAQ の Q.05」「§Method 01」など、番号かアドレスで一意に指せるようにする。

**v7.10 での主な変更**(Block 3、CVR ブロッカー全除去):
- **Cloudflare Email Obfuscation 残留除去**(§7-02、line 1962 の `__cf_email__` → `hello@njoooy.com` 生テキスト)
- **Instagram href の landmine 除去**(§7-01 カード + Footer Channels、弟さん合流まで `#contact` placeholder 化、`[TBD]` 維持)
- **Web3Forms 接続**(§7-form、`action="https://api.web3forms.com/submit"`、access_key 埋込、botcheck honeypot、fetch ベース inline success/error 表示、onsubmit alert fallback 除去)
- **favicon 3種生成**(`/favicon.svg` + `/favicon-32x32.png` + `/apple-touch-icon.png`、Fraunces italic "n" + gold breathing dot、R-7 遵守)
- **OG image 生成**(`/og-image.png`、1200×630、Fraunces italic "njoooy" ワードマーク + Tokyo·Est.MMXXVI + VOL.001·DOCUMENTATION + njoooy.com、R-7 遵守で新規コピーなし)
- **inactive link styling**(`[data-inactive="true"]`、新 CSS rule)、submit disabled 状態、`.contact-form-status` + success/error variants の CSS 追加

**v7.9 での主な構造変更**(Block 2、CVR 改善目的):
- **章順を「相談直結型」に再編成**:Services を §0 直後に繰り上げ、About を Method 後に降格
  - 旧:Opening → About → For Whom → Services → Flow → Method → FAQ → Contact
  - 新:Opening → **Services** → For Whom → Flow → Method → **About** → FAQ → Contact
- **Chapter 番号を新順序に合わせて振り直し**:Services=01、For Whom=02、Flow=03、Method=04、About=05、FAQ=06、Contact=07
- **Nav / Footer Channels の順序を新章順に合わせて更新**
- **Scroll Index フォールバック値を 09 → 08**(JS で動的上書きされるが no-JS 時の整合)
- **意図**:A 個人 / B 法人の両セグメントに対し「何を・いくらから」を最速で見せ、About(人物背景)は判断材料として後段に降格
- 可視コンテンツ・コピー・CSS・Marquee 文言は変更なし([TBD] も全保持)
- 行数:2160 行(v7.8 と同一、並び替えのみで増減なし)

**v7.8 での主な構造変更**(参考):
- **Footer Legal リンク実パス接続**(§F-4、3/3 項目中 2 項目を `/legal/*.html` に接続、利用規約のみ [TBD] 継続)
- **legal/ 配下に 2 HTML ページ追加**(特商法 / プラポリ、LP と同一 design token)
- **robots.txt / sitemap.xml 追加**(Vercel root、公開必須ファイル)
- **開発ファイル名を `preview.html` → `index.html` に統一**(Vercel 直接 serve 用)

**v7.7 での主な構造変更**(参考):
- Head/meta scaffold 補完、Skip-link 追加、Focus-visible ring 全対話要素へ、外部リンク aria-label + rel noopener noreferrer + target _blank 整備

**v7.6 での主な構造変更**(参考):
- §For Whom を縦スタック → 2カラムカードグリッド(6ケース × SVG + テキスト)に刷新
- 各カードに SVG ビジュアル領域(ユーザー差替予定のプレースホルダー)
- 他の構造(7章、Kyoto コメントアウト、FAQ 矢印、Contact フォーム)は v7.5 から継続

---

## 0. グローバル要素(全ページ共通、section の外)

### 0-H. Head / Meta(v7.7 追加、SEO + SNS + a11y 技術基盤)

| # | 要素 | 内容 |
|---|---|---|
| H-1 | Primary meta | `<title>` + `<meta description>` + `robots` + `theme-color`(light/dark 2値)+ `canonical` |
| H-2 | Open Graph | `og:type`, `site_name`, `title`, `description`, `url`, `locale=ja_JP`, `image`(1200×630 slot), `image:width/height/alt` |
| H-3 | Twitter Card | `twitter:card=summary_large_image`, `title`, `description`, `image`。[TBD: site/creator をアカウント取得後] |
| H-4 | Favicon slot | SVG 優先 `/favicon.svg`、PNG 32×32 `/favicon-32x32.png`、iOS 180×180 `/apple-touch-icon.png` |
| H-5 | Fonts | Google Fonts preconnect 2 + stylesheet(Fraunces / JetBrains Mono / Noto Sans JP / Shippori Mincho) |
| H-6 | Schema.org JSON-LD | `@graph` 2 エンティティ:`ProfessionalService`(@id `#business`、name/url/email/priceRange/areaServed/serviceType)+ `Person`(@id `#founder`、name 米山丈偉/jobTitle/worksFor/knowsLanguage)|

### 0-A. アクセシビリティ系(v7.7 追加)

| # | 要素 | id / class | 役割 |
|---|---|---|---|
| A-1 | **Skip link** | `.skip-link` | `<body>` 直後、Tab 最初で `translateY(0)` でスライドイン、target は `#top` |
| A-2 | **Main focus target** | `<main id="top" tabindex="-1">` | skip-link の遷移先、focus 時の outline は無し(視覚ノイズ回避) |
| A-3 | **Focus-visible ring** | (CSS only) | `a / button / summary / [tabindex]` に gold-bright 2px outline + offset 3px、keyboard 時のみ |
| A-4 | **External link aria** | §7-01 Instagram, F-3 Instagram, F-3 note | `aria-label="Instagram/note @njoooy(新しいタブで開きます)"` + `rel="noopener noreferrer"` + `target="_blank"` |

### 0-G. UI / インタラクション要素

| # | 要素 | id / class | 役割 |
|---|---|---|---|
| G-1 | **Preloader**(包装紙剥がし演出) | `#preloader` | 入口のブランド提示。上下2ハーフにジグザグで分割、3.4s 表示後にパカッと剥がれる |
| G-2 | **Cursor**(カスタムカーソル) | `.cursor-dot` / `.cursor-ring` | マウス追従の dot + ring |
| G-3 | **Cursor Preview**(ホバー画像) | `#cursorPreview` | `[data-preview]` 要素上で浮かぶミニ画像 |
| G-4 | **Scroll Progress**(上部バー) | `#scrollProgress` | ページ全体の進捗を1px 線で表示 |
| G-5 | **Scroll Index**(右下固定) | `#scrollIndex` | `Scroll / NN / TT` 現在章表示。mix-blend-mode: difference |
| G-6 | **Nav / Header** | `#nav` | 固定ヘッダー。logo + 6リンク(**v7.9**:Services / For Whom / Method / About / FAQ / Contact)+ ご相談へ CTA |

---

## 1. 本文セクション(可視章 7 + Opening + 1 非表示)

### §0. Opening(章番号なし、導入)

| アドレス | 要素 | 内容 |
|---|---|---|
| §0-head | `.opening-top` meta | 「njoooy — Tokyo, JP」「Est. MMXXVI · Tokyo」 |
| §0-1 | `.opening-headline` | 「東京着地、2026年4月。」(word-by-word kinetic reveal) |
| §0-2 | `.opening-sub` | 英文サブ「— cocktail & non-alcoholic, designed with equal intensity.」 |
| §0-3 | `.opening-bottom` | 日本語説明「京都で学び、2026年東京へ。カクテルもノンアルも、同じ設計精度で。」 |
| §0-4 | `.opening-cta-row` | 2 CTA:「お問い合わせ」(paper) + 「Services & Prices ↓」(ghost) |
| §0-5 | `.opening-fact-strip` | 3項目:拠点 / 得意領域 / 対応言語 |
| §0-M | **Marquee**(Opening 直後) | Cocktail & Non-Alcoholic · 同じ設計精度で · njoooy — Tokyo, JP · 出張バー／メニュー開発／店舗相談 · Est. MMXXVI · 京都仕込み、東京着地 |

---

> **§-アドレス体系の変更(v7.9)**:§N はすべて Chapter N と一致するように remap しました。
> 旧 §1(About)→ 新 §5 / 旧 §3(Services)→ 新 §1 / 旧 §4(Flow)→ 新 §3 / 旧 §5(Method)→ 新 §4。
> §2 For Whom / §6 FAQ / §7 Contact は番号据え置き。過去 changelog(v7.8 以前)に出てくる §-番号は旧体系であることに注意。

---

### §1. Services / Archive 01–04(Chapter 01)— **v7.9 で Opening 直後に繰上げ**

`class="archive" id="#services"`

| アドレス | 要素 | 内容 |
|---|---|---|
| §1-head | `.archive-head`(中央揃え) | Chapter 01 ラベル + タイトル「njoooy が いま開いている、ひらかれたカウンター。」+ 説明 |
| §1-WHY | `.why-njoooy` | **Why njoooy — 選ばれる3つの理由**:01 ノンアルも同じ設計精度で / 02 京都ホテルバー基礎 × 東京柔軟性 / 03 少人数特化 × バイリンガル対応 |
| §1-01 | **Folio 01 njoooy Bar**(出張バー) | Packages: Private ¥50,000〜 / Corporate ¥130,000〜 / Premium ¥280,000〜 |
| §1-01-SM | Folio 01 内 **Sample Menu**(3種) | 01 Kyoto Old Fashioned / 02 Hinoki Garden / 03 Tokyo Midnight Martini — horizontal scroll |
| §1-02 | **Folio 02 njoooy Menu**(メニュー開発) | Packages: Starter ¥130,000 / Standard ¥480,000 / Non-Alc Package ¥380,000 / Retainer ¥130,000/月 |
| §1-03 | **Folio 03 njoooy Counsel**(店舗相談) | Packages: 単発(2h)¥35,000 / 月次伴走 ¥100,000/月 |
| §1-04 | **Folio 04 njoooy Class**(研修プログラム)— プレースホルダー | Coming Soon 2026 夏。告知希望 CTA |

---

### §2. For Whom(Chapter 02 — こんな場面に)

`class="for-whom" id="#for-whom"`、6ケースは **2カラムカードグリッド**(`.case-grid` → `.case-card`、v7.6 以来)

| アドレス | 要素 | 内容 | SVG 状態 |
|---|---|---|---|
| §2-head | `.fw-head`(中央揃え) | Chapter 02 ラベル + タイトル「njoooy が迎えにゆく、6つの場面。」+ 説明(v7.9:Services への link を "Chapter 01 Services" に更新) | — |
| §2-01 | case-card 01 | 記念日・誕生日ディナー / Anniversary & Birthday Dinner — Bar Private / ノンアル対応 | 🔶 [TBD: 差替] カクテルグラス暫定 SVG |
| §2-02 | case-card 02 | 法人レセプション・周年イベント / Corporate Reception — Bar Corporate / 英語対応 | 🔶 [TBD: 差替] ビル・窓の暫定 SVG |
| §2-03 | case-card 03 | ブランド発表会・PR・メディア / Brand Activation — Bar Premium / スタイリング | 🔶 [TBD: 差替] 同心円スポット暫定 SVG |
| §2-04 | case-card 04 | ウェディング二次会・アフターパーティ / Wedding After-Party — Bar Private / シグネチャー1杯 | 🔶 [TBD: 差替] 交差円暫定 SVG |
| §2-05 | case-card 05 | 飲食店のメニュー刷新・ノンアル強化 / Beverage Refresh — Menu Starter / Standard | 🔶 [TBD: 差替] ボトル3本暫定 SVG |
| §2-06 | case-card 06 | 新店・新業態のコンセプト設計 / New Concept Advisory — Counsel / 月次伴走可 | 🔶 [TBD: 差替] 設計図暫定 SVG |
| §2-FV | `.first-visit` | コンパクトストリップ:「初めての方 → Counsel 2時間」「少人数 → Bar Private」「店舗 → Menu Starter」+ CTA「どれか迷ったら、直接ご相談 →」 | — |

**SVG 差替方法**: 各 case-card の `<div class="case-card-visual">` 内の `<svg>` 要素を差替。各カードに `[TBD: SVG 差し替え]` マーカー(mono 9px)が右下に表示。

---

### §3. ご依頼の流れ / Business Flow(Chapter 03)

`class="process" id="#process"`

| アドレス | 要素 | 内容 |
|---|---|---|
| §3-head | `.process-head`(中央揃え) | Chapter 03 ラベル + タイトル「ご相談から、当日・そしてその先まで。」+ 説明 |
| §3-01 | Step 01 | Inquiry(お問い合わせ)— DM/メール、24h 以内返信 |
| §3-02 | Step 02 | Hearing(ヒアリング)— 15-30分 Online、48h 以内実施 |
| §3-03 | Step 03 | Proposal(ご提案・お見積り)— 2-3案 + 見積 PDF、48h 以内送付 |
| §3-04 | Step 04 | Contract(契約)— 業務委託契約書 + 前金50% |
| §3-05 | Step 05 | Event Day(当日)— 1-2h 前現地入り、設営→サービス→撤収 |
| §3-06 | Step 06 | Follow-up(フォローアップ)— 残額請求書を7日以内発行 |
| §3-M | **Marquee**(Process 直後) | 業務の流れから、一杯の設計へ / 味を聞く、構造を組む、手から届ける / The njoooy Method |

---

### §4. 一杯の哲学 / The njoooy Method(Chapter 04)

`class="method" id="#method"`

| アドレス | 要素 | 内容 |
|---|---|---|
| §4-head | `.method-head`(中央揃え) | Chapter 04 ラベル + kicker「The njoooy Method」+ タイトル「一杯を、こうして組みます。」+ 説明(Chapter 03 との差別化、v7.9:cross-ref が Chapter 04→03 に更新) |
| §4-01 | Step One | **味を聞く** / Tasting the scene. — tags: Scene / Guests / Mood / Dietary |
| §4-02 | Step Two | **構造を組む** / Building the structure. — tags: Balance / Aroma / Arc / Pacing |
| §4-03 | Step Three | **手から届ける** / Serving, hand to hand. — tags: Counter / Dialogue / Rhythm / Care |
| §4-sig | `.method-sign-brand` | 署名風「— njoooy  Method, Vol. 001」+ footnote |
| §4-M | **Marquee dark**(Method 直後) | 味を聞く／構造を組む／手から届ける / Tasting · Structure · Service / 出張バー / Menu Design / 店舗相談 / Tokyo 23 Wards |

---

### §5. About the Founder(Chapter 05)— **v7.9 で Method 後に降格**

`class="about-section" id="#about"`

| アドレス | 要素 | 内容 |
|---|---|---|
| §5-head | `.about-head-centered`(中央揃え、grid 外) | Chapter 05 ラベル + タイトル「はじめまして、njoooy です。」 |
| §5-img | `.about-image` | 左カラム(sticky)、Portrait プレースホルダー(SVG、差し替え予定) |
| §5-body-1 | `.about-body`(上段) | 京都で[TBD年数]→ 2026年4月東京。**21歳**の自己紹介 |
| §5-pull | `.about-pull` | Pull quote「飲む日も、飲まない日も、同じ温度で一杯を渡せる場所を。」 |
| §5-body-2 | `.about-body`(下段) | 出張バー・メニュー開発・店舗アドバイザリーの提供範囲 |
| §5-TL | `.about-timeline` | 歩み:2024 / 2025 / 2026.04(current、gold breathing dot)/ 2026+ |

---

### 🚫 §? 京都での日々 / Kyoto Era(再有効化時 Chapter 06、**v7.5 以来 HTML コメントアウト・非表示**)

`<!-- <section class="past" id="past"> ... </section> -->`

**現状:HTML 内に保存されているが、ブラウザでは非表示。** 1件目の東京案件が獲得できた時点で再有効化予定。v7.9 の新章順では §5 About の直後に配置されている(コメント位置不変)。

再有効化の手順(`<!-- ... -->` の冒頭コメントに明記):
1. HTML コメントマーカー `<!--` と `-->` を削除
2. §FAQ の Chapter 番号を 06 → 07 に更新
3. §Contact の Chapter 番号を 07 → 08 に更新
4. 本 structure-map も同時更新

コメント内の Kyoto ラベルは **「Chapter 06」に pre-set** 済み(再有効化時の修正不要、v7.9 でも継続)。

---

### §6. FAQ / 事前にお伝えできること(Chapter 06)

`class="faq" id="#faq"`

| アドレス | 要素 | 内容 |
|---|---|---|
| §6-head | `.faq-head`(中央揃え) | Chapter 06 ラベル + タイトル「よくある、ご質問。」+ 説明 |
| §6-Q01 | Q.01 | お見積りは無料ですか?/ Is the quote free? |
| §6-Q02 | Q.02 | 対応エリアはどこまでですか?/ Travel area? |
| §6-Q03 | Q.03 | ノンアルのみのイベントも対応できますか?/ Non-alc only events? |
| §6-Q04 | Q.04 | 英語対応は可能ですか?/ Can you serve in English? |
| §6-Q05 | Q.05 | アレルギーや特別食対応はできますか?/ Dietary accommodations? |
| §6-Q06 | Q.06 | キャンセル料金はどうなりますか?/ Cancellation policy? |
| §6-toggle | `.faq-toggle` | SVG 下向き矢印、ホバーで wine 塗り + halo + Q 変色、open 時 180deg 回転(v7.5 以来) |

---

### §7. Contact(Chapter 07)

`class="contact" id="#contact"`

| アドレス | 要素 | 内容 |
|---|---|---|
| §7-head | `.contact-head`(中央揃え) | Chapter 07 ラベル + タイトル「njoooy への依頼・相談」+ 説明 |
| §7-01 | Instagram カード | @njoooy(Primary — DM)。**v7.10**:href を `#contact` placeholder に変更(他人の `@njoooy` への誤誘導回避)、`[TBD: アカウント準備中、href は公開時に差戻し]` note を維持。弟さんと合流後、実アカウント取得したら href と aria-label を復元 |
| §7-02 | Email カード | hello@njoooy.com(**v7.10** で Cloudflare Email Obfuscation 汚染を除去、生テキスト化。Cloudflare Email Routing で `hello@njoooy.com` の受信が有効) |
| §7-form | **Contact フォーム**(`.contact-form`) | 4 field(お名前 / Email / ご相談種別 select / ご相談内容 textarea)+ 送信ボタン + status message 領域。**v7.10**:Web3Forms 接続済(`action="https://api.web3forms.com/submit"`、access_key hidden input 埋込、botcheck honeypot、fetch ベース inline success/error 表示)。onsubmit alert fallback は除去済 |

---

## 2. Footer(section 外、ページ末尾)

| アドレス | 要素 | 内容 |
|---|---|---|
| F-1 | `.footer-logo` | 大型ワードマーク「njoooy」+ breathing dot(gold) |
| F-2 | `.footer-tagline` | 「— cocktail & non-alcoholic, designed with equal intensity. Based in Tokyo.」 |
| F-3 | Footer links(Channels) | Instagram ↗ / note ↗ / About / Services / Method / FAQ / Contact(v7.5 で Method リンク復帰) |
| F-4 | Footer links(Legal)(**v7.8 接続済**) | 特定商取引法表記 → `/legal/tokusho.html` / プライバシーポリシー → `/legal/privacy.html` / 利用規約 [TBD 継続] |
| F-5 | Copyright | © MMXXVI njoooy — Tokyo, JP |
| F-6 | Vol. line | Vol. 001 · 2026.04 · Documentation |

---

## 2.5. 独立ページ / サイトルート配置ファイル(v7.8 追加)

LP 本体(`index.html`)とは別に、サイトルート配下に配置されるファイル群。Vercel upload の対象。

### 2.5.1 Legal ページ(LP と同一 design token、独立 HTML)

| アドレス | パス | 内容 |
|---|---|---|
| L-1 | `/legal/tokusho.html` | 特定商取引法に基づく表記。9 セクション構成(販売事業者 / 販売価格 / その他費用 / 支払方法 / 支払時期 / 役務提供時期 / 返品キャンセル特約 / その他特記)。[TBD] 5 箇所維持 |
| L-2 | `/legal/privacy.html` | プライバシーポリシー。12 セクション構成(事業者情報 / 取得情報 / 利用目的 / 第三者提供 / 委託 / 安全管理 / 開示請求 / Cookie 外部送信 / 保管期間 / 未成年 / 変更 / 窓口)。[TBD] 6 箇所維持 |

Legal ページ共通:
- LP と同一 design token(paper / ink / wine / gold、Fraunces / Shippori Mincho / Noto Sans JP / JetBrains Mono)
- max-width 720px の article 型、skip-link + focus-visible + reduced-motion 継承
- ヘッダー左に `njoooy` ワードマーク(/ に link back)、右に `Legal · 特商法` or `Legal · Privacy` メタ
- フッターは「← トップへ戻る」 + 相互リンク + copyright(3 カラム）
- `robots="index, follow"` で Google にインデックスさせる
- `canonical` 各ページ自身の URL に設定

### 2.5.2 SEO / クローラー向けファイル

| アドレス | パス | 内容 |
|---|---|---|
| S-1 | `/robots.txt` | User-agent `*` に全 Allow、Sitemap 位置を明示 |
| S-2 | `/sitemap.xml` | 3 URL 登録(`/` priority 1.0 / `/legal/tokusho.html` 0.3 / `/legal/privacy.html` 0.3)、lastmod `2026-04-30` |

### 2.5.3 公開済み(v7.10 で追加)

| パス | 内容 | 備考 |
|---|---|---|
| `/favicon.svg` | SVG 版 favicon(Fraunces italic "n" + gold dot、viewBox 512×512) | glyph path 埋込、フォント依存なし、1.5KB |
| `/favicon-32x32.png` | PNG フォールバック(Pillow レンダ、supersample 4x) | 1.1KB |
| `/apple-touch-icon.png` | 180×180 iOS 用(同意匠) | 7.0KB |
| `/og-image.png` | 1200×630 SNS シェア画像(ワードマーク + Tokyo·Est.MMXXVI + VOL.001 + njoooy.com) | 35.6KB、R-7 遵守で新規コピーなし |

### 2.5.4 今後の追加候補

| 予定パス | 内容 | 優先度 |
|---|---|---|

---

## 3. 修正指示の書き方サンプル

- **セクション単位**: 「§5 Method を削除して」「§2 と §3 を入れ替えて」
- **ブロック単位**: 「§3-WHY の2つ目を書き換え」「§7-form の select に1項目追加」
- **行単位**: 「§6-Q03 の答えに 1行追加」「§5-01 のタグ 'Dietary' を 'アレルギー' に」「§4-01 の desc を調整」
- **グローバル**: 「G-1 Preloader の剥がれるタイミングを 2秒早く」「G-6 Header のリンク順を変更」

---

## 4. 既知の [TBD] 主要項目

- §0-3 Opening bottom コピーの最終推敲
- §0-5 Fact 値の最終調整
- §5 About:京都の年数、2024/2025 タイムラインのエピソード
- §1-WHY 各項目の最終推敲
- §1-01〜03 の price(インボイス登録後、消費税の明記)
- §1-04 Class の開講日
- §3-01〜06 各 Step の desc 最終確認
- §4-01〜03 の step 名・命名の最終確認
- §6-Q01〜Q06 の答えの最終確認
- §7-01 Instagram アカウント実在化(弟さん合流後、href 2箇所を `#contact` → 実URL に差戻し)
- Footer 利用規約のリンク先(必要に応じて `/legal/terms.html` 作成、現在は [TBD] 継続)
- OG タイトル・description(Head meta の [TBD]、v7.10 では画像ファイルのみ対応済)
- Kyoto Era 再有効化(実績蓄積後)

---

*本マップは v7.10 時点(2026-04-23、Block 3 完了)。セクション追加・削除があればバージョン更新時にこのファイルも追随する。*
