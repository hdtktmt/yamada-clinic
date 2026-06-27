# CLAUDE.md — 山田クリニック サイト開発ルール

このファイルを読んでから作業を開始すること。新しいチャットでも同じ品質で開発できるよう、すべての設計判断を記録している。

---

## ディレクトリ構成

```
dist 2/
├── index.html            # トップページ（ヒーロー・KVスライダー・診察時間）
├── about.html            # 当院について
├── first-visit.html      # はじめての方へ
├── facility.html         # 施設基準
├── privacy.html          # 情報セキュリティ基本方針
├── CLAUDE.md
└── assets/
    ├── css/
    │   ├── reset.css      # マージン/パディングリセット + h1-h6 font-weight:inherit
    │   ├── variables.css  # CSS カスタムプロパティ（色・フォント・スペーシング）
    │   ├── base.css       # body・a・共通ユーティリティ
    │   ├── components.css # 全ページ共通（ヘッダー・フッター・モバイルメニュー等）
    │   ├── layout.css     # index.html 専用（ヒーロー・KV・セクション）
    │   └── pages.css      # about.html・first-visit.html 専用
    ├── js/
    │   └── support.js     # 唯一のJSファイル（後述）
    └── images/
        ├── care/          # WebP のみ（ケアセクション）
        ├── common/        # WebP のみ（外観など共通）
        ├── doctor/        # WebP のみ（院長写真）
        ├── facility/      # WebP のみ（設備写真）
        ├── kv/            # WebP のみ（KVスライダー）
        └── _originals/    # PNG/JPG 元ファイル保管庫（CSS/HTML から参照禁止）
```

### CSS ファイルの責務

| ファイル | 読み込むページ | 内容 |
|---|---|---|
| reset.css | 全ページ | ユニバーサルリセット |
| variables.css | 全ページ | CSS カスタムプロパティ定義 |
| base.css | 全ページ | body・a・アニメーション |
| components.css | 全ページ | ナビ・モバイルメニュー・フッター・ページヒーロー等 |
| layout.css | index.html のみ | ヒーロー・KV・セクション固有スタイル |
| pages.css | about.html・first-visit.html のみ | 各ページ固有スタイル |

---

## CSS ルール

### カスタムプロパティ（variables.css）

```css
/* 色 */
--c-green: #7f9a91       /* アクセントグリーン */
--c-dark: #26312c        /* 最暗色 */
--c-primary: #2f3d37     /* ブランドグリーン */
--c-text: #1f2a26        /* 本文テキスト */
--c-body: #46514b        /* 本文薄め */
--c-muted: #8b958f       /* ミュート */
--c-sub: #9aa39e
--c-mid: #566f67
--c-desc: #66706a
--c-border: #e3e9e6
--c-bg-light: #f6f8f7
--c-warn: #bf6a45

/* フッター色 */
--c-footer: #2a352f
--c-footer-text: #cfd8d3
/* ...その他フッター変数 */

/* フォント */
--f-ja: 'Zen Kaku Gothic New', sans-serif  /* 本文・見出し */
--f-en: 'Jost', sans-serif                 /* 英字装飾 */

/* スペーシング */
--sp-side: 7%            /* ページ左右余白（基本） */
--sp-sec: clamp(64px,8vw,100px)  /* セクション縦余白 */
--w-max: 1180px          /* コンテンツ最大幅 */
--container-px: max(var(--sp-side), calc((100% - var(--w-max)) / 2))
/* ↑ 最大幅を超えたらコンテナセンタリングに切り替わる水平パディング */
```

**カスタムプロパティは必ず使うこと。** 色・スペーシング・フォントをハードコードしない。

### コンテナ幅の扱い

- セクションの水平パディングには `--container-px` を使う
- `.container` / `.inner-wrap` クラスは `max-width:var(--w-max); margin:0 auto` のエイリアス
- 固定 px パディングと `--container-px` を混在させない

### レスポンシブブレークポイント

```css
@media (max-width:900px)  /* タブレット・スマホ：ナビ → ハンバーガー */
@media (max-width:640px)  /* スマホ小：フォントサイズ・グリッド調整 */
@media (max-width:760px)  /* フッター列方向変更 */
@media (max-width:420px)  /* フッターリンク間隔調整 */
```

### hover スタイル

**`style-hover` 属性は使用禁止。** 必ず CSS の `:hover` セレクタで記述する。

```css
/* ✅ 正しい */
.nav a:not(.cta):hover { color: var(--c-primary); }

/* ❌ 禁止 */
<a style-hover="color:#2f3d37">
```

### font-weight ルール

- **Zen Kaku Gothic New**：`400`（本文・見出し）と `500`（ブランド名・強調）のみ使用
- **Jost**：`300`（step-num 等の装飾数字）と `400`（その他英字）のみ使用
- `700`（bold）は使用しない。`h1〜h6` は `reset.css` で `font-weight:inherit` 済みのためブラウザ bold が当たらない

### mix-blend-mode 注意事項（index.html の `.hd`）

`.hd`（透明オーバーレイヘッダー）の子要素に `mix-blend-mode:difference` を適用している。

**重要**: `.hd` 自体に `z-index` を設定すると独立したスタッキングコンテキストが生まれ、KV 画像との合成が機能しなくなる。`.hd` は `z-index` なし（auto）を維持すること。

```css
/* ✅ .hd-brand と非CTA nav リンクにのみ適用 */
.hd-brand { mix-blend-mode: difference; }
.hd-nav a:not(.hd-cta) { mix-blend-mode: difference; }

/* ❌ .hd 自体への z-index 追加は禁止 */
.hd { z-index: 2; }  /* ← 絶対ダメ */
```

---

## 命名規則

### CSS クラス名

- **ケバブケース**（`kebab-case`）を使う
- BEM 風だが厳密な BEM ではない
- モディファイア（バリアント）は `--` で表す：`page-title--sm`、`facility-desc--mt16`
- 状態クラスは `is-` プレフィックス：`is-active`
- JS で付与するクラスはシンプルな単語：`scrolled`

```css
/* ✅ 例 */
.sec-care {}
.care-ph-1 {}
.page-title--sm {}
.kv-slide.is-active {}
.hd2.scrolled {}

/* ❌ NG */
.secCare {}        /* キャメルケース禁止 */
.sec_care {}       /* スネークケース禁止 */
.Section--Care {}  /* 大文字始まり禁止 */
```

### CSS ID

- ケバブケース
- アンカーポイントには意味のある名前：`#top`、`#hours`、`#access`、`#doctor`
- KV スライドには連番：`#kv1`、`#kv2`、`#kv3`…

### ファイル名

- CSS・HTML・JS・画像すべて**ケバブケース**
- 複数単語はハイフン区切り：`first-visit.html`、`kv-1.webp`

---

## 画像命名規則

### 形式

- **CSS / HTML から参照する画像はすべて WebP**
- PNG / JPG 元ファイルは `assets/images/_originals/` に保管し、**CSS・HTML からは参照しない**

### 命名パターン

```
[カテゴリ]-[説明].webp
[カテゴリ]-[説明]-sp.webp   ← モバイル版（SP = smartphone）
```

| 用途 | 例 |
|---|---|
| KV スライダー（デスクトップ） | `kv-1.webp`、`kv-2.webp` |
| KV スライダー（モバイル） | `kv-1-sp.webp`、`kv-2-sp.webp` |
| ケアセクション | `care-specialty.webp`、`care-access.webp` |
| 設備写真 | `equipment-bmd.webp`、`equipment-abi.webp` |
| 院長写真 | `doctor-portrait.webp` |
| 外観 | `clinic-exterior.webp` |

### KV スライダー画像と ID の対応

```
id="kv1" ← CSS: #kv1 { background-image: url('...kv-1.webp') }
id="kv2" ← CSS: #kv2 { background-image: url('...kv-2.webp') }
```

KV 画像を追加するときは **ID 番号と画像番号を一致させる**。

### 新規画像追加時

1. WebP に変換してから `assets/images/[カテゴリ]/` に配置
2. 元ファイルは `assets/images/_originals/[カテゴリ]/` に保管
3. CSS から `url('../images/[カテゴリ]/ファイル名.webp')` で参照

---

## HTML ルール

### 基本構造（全ページ共通）

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>x-dc{display:none!important}</style>   <!-- FOUCを防ぐ（必須・位置を変えない） -->
  <script src="assets/js/support.js" defer></script>  <!-- defer 必須 -->
</head>
<body class="subpage">  <!-- index.html のみ class="home" -->
<x-dc>
<helmet>
  <!-- CSS・フォント・SEOメタ・JSON-LD をここに記述 -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;500&family=Jost:wght@300;400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/reset.css">
  <link rel="stylesheet" href="assets/css/variables.css">
  <link rel="stylesheet" href="assets/css/base.css">
  <link rel="stylesheet" href="assets/css/components.css">
  <link rel="stylesheet" href="assets/css/pages.css">  <!-- about/first-visit のみ -->
  <title>ページタイトル｜山田クリニック｜寝屋川市香里園</title>
  <meta name="description" content="120〜160文字の説明">
  <link rel="canonical" href="https://80da.jp/ページ名.html">
  <!-- OGP・Twitter Card・JSON-LD -->
</helmet>

<!-- モバイルメニュー用チェックボックス（チェックボックスhack） -->
<input id="navtoggle" class="navtoggle" type="checkbox" hidden>

<header class="site-header">...</header>
<div class="mnav">...</div>

<main>...</main>
<footer class="site-footer">...</footer>
</x-dc>
</body>
</html>
```

### `<x-dc>` と `<helmet>` の仕組み

- `<x-dc>` は support.js が処理して DOM に展開する独自ラッパー
- `<helmet>` の子要素は support.js が `<head>` に注入する
- `<style>x-dc{display:none!important}</style>` は即時適用でコンテンツのチラツキを防ぐ（必須）
- support.js に `defer` が付いていることで HTML パースをブロックしない

### モバイルメニュー（チェックボックスhack）

全ページで同じ構造。JS 不要で CSS のみで動作する。

```html
<!-- head の直後（x-dc 内の最初） -->
<input id="navtoggle" class="navtoggle" type="checkbox" hidden>

<!-- モバイルメニュー本体 -->
<div class="mnav">
  <label for="navtoggle" class="mbackdrop"></label>
  <div class="mpanel">
    <label for="navtoggle" class="mclose" aria-label="閉じる">
      <span class="mclose-x">×</span>
      <span class="mclose-t">閉じる</span>
    </label>
    <a href="index.html">トップ</a>
    <!-- ナビリンク -->
    <a href="first-visit.html#access" class="mnav-access">アクセス</a>
    <div class="mfoot">
      <a href="privacy.html">情報セキュリティ基本方針</a>
      <a href="facility.html">施設基準</a>
    </div>
  </div>
</div>
```

CSS のトリガー：
```css
.navtoggle:checked ~ .mnav .mpanel { transform: translateX(0); }
```

### 禁止事項

- `style="..."` インライン属性（CSS ファイルに書く）
- `style-hover="..."` 属性（CSS の `:hover` セレクタで書く）
- HTML ファイル内のインライン `<script>`（JSON-LD を除く）
- `<img>` タグでの画像表示（現在すべて CSS `background-image` で実装）

### SEO 必須要素（全ページ）

```html
<title>ページ固有タイトル｜山田クリニック｜寝屋川市香里園</title>
<meta name="description" content="120〜160文字。医療誇大表現禁止">
<link rel="canonical" href="https://80da.jp/ファイル名.html">
<meta property="og:type" content="website">
<meta property="og:site_name" content="山田クリニック">
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:url" content="https://80da.jp/ファイル名.html">
<meta property="og:image" content="https://80da.jp/assets/images/kv/kv-1.webp">
<meta property="og:locale" content="ja_JP">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="...">
<meta name="twitter:description" content="...">
<meta name="twitter:image" content="https://80da.jp/assets/images/kv/kv-1.webp">
<script type="application/ld+json">{ "@type": "MedicalClinic", ... }</script>
```

---

## JavaScript ルール

### support.js の責務（唯一の JS ファイル）

```
1. <helmet> 処理        → 子要素を <head> に注入
2. <x-dc> 展開          → 子要素をDOMに移動
3. hash ナビゲーション  → initHashNav()（ヘッダー分 84px オフセット）
4. 追従ヘッダー制御     → initStickyHeader()（.kv-sentinel 監視、.scrolled トグル）
5. KV スライダー        → initKvSlider()（スローズーム付き 5.2 秒切替）
```

### 追加・変更のルール

- **新しい機能を追加するときは support.js の末尾に関数を追加し、`boot()` 内から呼ぶ**
- グローバル変数を作らない（IIFE 内に閉じ込める）
- `document.querySelector` は DOMContentLoaded 後（`boot()` 内）に実行する
- 外部ライブラリ・CDN 依存は追加しない（React・jQuery 等）
- `eval()` / `new Function()` 禁止

### 禁止事項

- HTML ファイルへのインラインスクリプト追加（JSON-LD を除く）
- CDN からのスクリプト読み込み追加
- `support.js` から `defer` を外すこと（レンダーブロックになる）

---

## 今後ページを追加するときのルール

### 手順

1. **HTML ファイルを作成**
   - 既存サブページ（例：facility.html）をコピーして編集
   - `<body class="subpage">` を維持
   - `<helmet>` 内の CSS リンク一覧（pages.css の有無はページ内容で判断）
   - pages.css が必要なのは about.html と first-visit.html 系のスタイルを使う場合のみ

2. **ナビゲーションを全ページ更新**
   - `<nav class="nav">` と `<div class="mnav">` の両方を全5ページ（＋新ページ）で更新

3. **CSS を追加する場所**
   - 全ページ共通スタイル → `components.css`
   - index.html 専用 → `layout.css`
   - about/first-visit 系 → `pages.css`
   - 新ページ専用で量が多い場合 → `assets/css/[ページ名].css` を新規作成し `<helmet>` で読む

4. **SEO を設定する**
   - タイトル・description・canonical・OGP・Twitter Card・JSON-LD を必ず設定
   - JSON-LD は MedicalClinic 型を使用（住所・電話番号は既存ページからコピー）

5. **フッターリンクを全ページで更新**
   - 必要に応じて `<nav class="foot-links">` にリンクを追加

---

## デザイン変更時のルール

### 色を変更する

必ず `variables.css` のカスタムプロパティ値を変更する。CSS ファイル内のハードコード色は変更しない。

```css
/* ✅ variables.css の値を変える */
--c-green: #7f9a91;  ← ここを変更

/* ❌ 個別ファイルで上書きしない */
.some-class { color: #7f9a91; }
```

例外：ブレンドモード用の白（`#fff`）など、意図的にハードコードしているケースがある。コメントを読んで判断すること。

### フォントを変更する

1. `variables.css` の `--f-ja` / `--f-en` を変更
2. 全 HTML ファイルの Google Fonts URL を同時に更新（font-weight も確認）
3. **font-weight を追加するときは使用箇所を CSS で確認してから Google Fonts URL に追加する**

### スペーシング・レイアウトを変更する

- まず `--sp-side`・`--sp-sec`・`--w-max` の変更で対応できないか検討する
- セクションに直接 `padding` を足す前に、変数で解決できないか確認

### レスポンシブを変更する

- 既存ブレークポイント（900px / 640px / 760px / 420px）で解決できないか検討してから新しいブレークポイントを追加する
- 追加する場合は既存ブレークポイントの直後に記述する

---

## 絶対に変更してはいけない事項

### 1. `<head>` 内の `<style>x-dc{display:none!important}</style>`

`support.js` が `defer` で動作するため、このインラインスタイルがないと `<x-dc>` の生の HTML が一瞬表示される（FOUC）。削除・移動禁止。

### 2. `<script src="assets/js/support.js" defer>` の `defer` 属性

`defer` を外すとレンダーブロックが発生する。外すことで見かけ上動作しても削除禁止。

### 3. `.hd` に `z-index` を設定しない（index.html のみ）

`z-index` を設定すると独立したスタッキングコンテキストが生まれ、`mix-blend-mode:difference` が KV 画像ではなく `.hd` の背景色に対して合成されてしまう。ヘッダーテキストが正しい色で描画されなくなる。

### 4. チェックボックスhackの構造

`id="navtoggle"` のチェックボックスは `<x-dc>` の直後（`.mnav` の直前の兄弟）に配置されていなければ CSS の `~` セレクタが機能しない。位置を変更禁止。

### 5. `reset.css` の `h1,h2,h3,h4,h5,h6 { font-weight: inherit }`

削除するとブラウザデフォルトの `bold (700)` が h1〜h6 に適用される。Zen Kaku Gothic New の 700 は読み込んでいないためフォント合成になる。

### 6. Google Fonts の読み込み weight

```
Zen Kaku Gothic New: wght@400;500  のみ
Jost: wght@300;400  のみ
```

300/700 を追加しない。CSS に 300/700 の font-weight が必要になった場合は、代替 weight で近いものを使うか Google Fonts URL を更新してセットで追加する。

### 7. KV スライダーの ID と画像の対応

```
id="kv1" ↔ #kv1 { background-image: url('...kv-1.webp') }
id="kv2" ↔ #kv2 { background-image: url('...kv-2.webp') }
```

ID 番号と CSS セレクタ番号と画像ファイル番号を必ず一致させる。

### 8. 画像は WebP のみ参照する

`assets/images/_originals/` の PNG/JPG ファイルを CSS・HTML から参照しない。新規画像は WebP に変換してから `assets/images/[カテゴリ]/` に配置する。

### 9. support.js への外部依存追加禁止

React・jQuery・Alpine.js 等の外部ライブラリを追加しない。サイト規模・パフォーマンス・メンテナビリティの観点からバニラ JS のみで実装する。

---

## クリニック情報（変更時は全ページ JSON-LD も更新）

```
名称: 山田クリニック
住所: 〒572-0084 大阪府寝屋川市香里南之町10-22
電話: 072-831-3917
最寄り: 京阪本線 香里園駅 徒歩5分
診療科: 糖尿病内科・内科・放射線科
院長: 山田 敬行
本番URL: https://80da.jp/
```

## 医療コンテンツルール

- **誇大表現禁止**：「治る」「必ず」「最高」等の断定表現を使わない
- meta description・本文ともに医療法の広告規制に準拠した表現を使う
- JSON-LD の `medicalSpecialty` は実際の診療科のみ記載する
