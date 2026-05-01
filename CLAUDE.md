# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

モダンなUI/UXのぷよぷよゲームアプリ。Next.js 16 + React 19 + TypeScript + Tailwind CSS v4 で構築。

## Commands

```bash
npm run dev      # 開発サーバー起動 (http://localhost:3000)
npm run build    # 本番ビルド
npm run lint     # ESLint
```

## Architecture

- **App Router** (`src/app/`) — Next.js App Router を使用。`layout.tsx` がルートレイアウト、`page.tsx` がエントリポイント。
- **ゲームロジック** (`src/lib/`) — ぷよぷよのコアロジック（ボード状態、落下判定、連鎖計算など）を純粋関数として配置。UI に依存しない。
- **コンポーネント** (`src/components/`) — ゲームUI を構成する React コンポーネント群。ゲームボード、ネクストぷよ、スコア表示など。
- **フック** (`src/hooks/`) — ゲームループ、キー入力、アニメーション状態管理などのカスタムフック。

## Key Conventions

- `@/*` は `src/*` へのエイリアス
- Tailwind CSS v4 を使用（`@import "tailwindcss"` 形式、設定ファイル不要）
- `"use client"` はインタラクティブなコンポーネント・フックにのみ付与
- ゲームの状態は `useReducer` で管理し、ロジックと UI を分離する

## 要件定義

### ゲーム仕様（機能要件）

**ボード仕様**
- サイズ: 6列 × 12行（表示）、物理13行（行0は隠し領域）
- ゲームオーバー判定: 隠し行（行0）にぷよが積まれたとき

**ぷよの種類**
- プレイぷよ: 赤・青・緑・黄・紫（5色）
- おじゃまぷよ: 自分では消せない。隣接するぷよが消えると一緒に消滅

**ぷよペア操作**
- 操作単位は「ぷよペア」（pivot + satellite の2つ）
- スポーン位置: 列2–3の最上部（隠し行）
- 移動: 左右・ソフトドロップ（↓）・ハードドロップ（↑/スペース）
- 回転: 時計回り（X）・反時計回り（Z）、ウォールキック対応

**消滅ルール**
- 同色4つ以上が上下左右に隣接して連結 → 消滅
- 消滅グループに隣接するおじゃまぷよも同時消滅

**連鎖**
- ぷよ消滅 → 重力適用 → 再消滅チェックを繰り返す
- 連鎖ごとに `chainCount` をインクリメント

**スコア計算式**
```
score += popped × 10 × max(CHAIN_POWER[chain] + GROUP_BONUS[groups] + COLOR_BONUS[colors], 1)

CHAIN_POWER: [0, 0, 8, 16, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448, 480, 512]
GROUP_BONUS: [0, 0, 3, 6, 12, 24]   (グループ数、5以上は24固定)
COLOR_BONUS: [0, 0, 3, 6, 12, 24]   (色数、5以上は24固定)
```
- ソフトドロップ: +1点/行、ハードドロップ: +落下距離×2点

**レベルシステム**
- レベル = 1 + floor(総消去行数 / 30)、最大 Lv20
- 重力速度 = max(100, 800 − (level − 1) × 60) ms

**キュー管理**
- 常時3ペア先まで生成、UI上は NEXT（次）と 2ND（次の次）を表示

### 状態遷移

```
idle → (START) → falling
falling → (TICK/着地なし) → falling
falling → (着地) → popping（pop対象あり）or falling（なし、次ピース生成）
popping → (450ms後) → gravity
gravity  → (200ms後) → popping（連鎖あり）or falling（連鎖なし）
falling  → (ゲームオーバー条件) → gameover
gameover → (START/RESET) → idle
```

### UI/UX 要件（非機能要件）

**ビジュアル**
- ダーク系グラデーション背景 + 浮遊する3つのアンビエントオーブ（7s / 9s / 11s周期）
- 各色ぷよ: 放射状グラデーション（3段階）+ グロウ `box-shadow`
- ボード背景: 深い紫青グラデーション + 半透明グラスモーフィズム

**アニメーション**

| アニメーション | 詳細 |
|---|---|
| `puyo-pop` (0.45s) | 消滅時: 拡大(1→1.3)→縮小→フェードアウト |
| `chain-flash` (0.35s) | 連鎖時: 画面全体の黄白フラッシュ |
| `chain-badge` (0.3s) | 2連鎖以上で「N連鎖!!」バッジがバウンスイン |
| `float-a/b/c` | 背景オーブの永続ループ浮遊 |

**画面構成**
```
[スコアパネル]  [ゲームボード 6×12]  [ネクストパネル]
```
- スタート画面: タイトル・操作説明・STARTボタン（Enterキー対応）
- ゲームオーバー画面: スコア・最大連鎖数・RETRYボタン

**キーバインド**

| キー | 機能 |
|---|---|
| ← → | 左右移動 |
| ↓ | ソフトドロップ |
| ↑ / Space | ハードドロップ |
| Z | 反時計回り回転 |
| X | 時計回り回転 |
| Enter | ゲーム開始 / リトライ |
