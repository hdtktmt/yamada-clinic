---
name: convert-webp
description: 画像ファイルをWebPに変換し、山田クリニックプロジェクトのディレクトリルールに従って配置する。PNG/JPGをWebPに変換したいときに使う。
---

Convert image files to WebP format and organize them according to the Yamada Clinic project rules.

## 手順

### 1. 入力確認
引数（`$ARGUMENTS`）にファイルパスが指定されていれば使用する。指定がなければ、変換対象のファイルを確認する。

### 2. カテゴリの特定
以下のカテゴリから適切なものを選ぶ（ファイル名・用途から判断、不明なら確認する）：

| カテゴリ | 用途 | 例 |
|---|---|---|
| `kv` | KVスライダー画像 | `kv-1.webp`, `kv-1-sp.webp` |
| `care` | ケアセクション | `care-specialty.webp` |
| `facility` | 設備・院内写真 | `equipment-bmd.webp` |
| `doctor` | 院長写真 | `doctor-portrait.webp` |
| `common` | 外観など共通 | `clinic-exterior.webp` |

### 3. 出力ファイル名を決める
命名規則：`[カテゴリ]-[説明].webp`（ケバブケース）
- モバイル版がある場合：`[カテゴリ]-[説明]-sp.webp`
- KV画像の場合：`kv-1.webp` / `kv-2.webp`（番号は既存の連番に合わせる）

### 4. WebPに変換（macOS 標準の sips を使用）
```bash
sips -s format webp "[入力ファイル]" --out "assets/images/[カテゴリ]/[出力ファイル名].webp"
```

複数ファイルの場合はループ：
```bash
for f in [入力ファイル群]; do
  sips -s format webp "$f" --out "assets/images/[カテゴリ]/$(basename "${f%.*}").webp"
done
```

### 5. 元ファイルを _originals/ へ移動
```bash
mv "[入力ファイル]" "assets/images/_originals/[カテゴリ]/"
```
`_originals/[カテゴリ]/` ディレクトリが存在しない場合は `mkdir -p` で作成する。

### 6. 確認・報告
変換後に以下を報告する：
- 作成した WebP ファイルのパスとサイズ
- 元ファイルの移動先
- CSSで使うurl()参照： `url('../images/[カテゴリ]/[ファイル名].webp')`
- KV画像の場合はCSSのIDセレクタも案内：`#kv1 { background-image: url('...') }`

## 注意事項
- `assets/images/_originals/` 内のファイルは CSS・HTML から参照しない
- KV画像を追加する場合、ID番号と画像番号を必ず一致させる（`#kv3` ↔ `kv-3.webp`）
- WebP変換後に元画像より極端にファイルサイズが大きい場合は品質を下げて再変換を検討（`cwebp -q 80` 等）
