# line-entry

サン&Journal事務所の LINE（LIFF）から開く「入口ページ」の置き場（GitHub Pages・住所は https://line.journalrepo.jp/ ）。

- 入口ページは **額縁だけ**。中身（フォーム・台帳・計算）は Google Apps Script のウェブアプリが動かす。
- 額縁に入れると、GAS を直接開いたときに出る「このアプリケーションは Google Apps Script のユーザーによって作成されたものです」の帯が出ない。
- 額縁は LIFF で本人の証明（ID トークン）をもらい、隠しフォームで GAS へ送る（URL に載せない）。GAS が LINE に確かめる。
- **この倉庫は公開。合鍵・鍵・トークン・個人データ・お客様の名前は絶対に入れない。** 入れてよいのは、もともと誰でも開ける GAS の公開 URL と LIFF ID だけ。
- 設計の正本は非公開の倉庫（kyoyu-san-journal）の `設計書_LINE入口.md`。

## ページ

| ファイル | 中身 |
|---|---|
| `entry.js` / `entry.css` | 共通の額縁の部品。ページごとの `window.ENTRY = { liffId, gasUrl, pass }` で動く。iPhone・iPad は確認が済むまで今までの道（GAS へそのまま）へ流す（`IOS_FALLBACK`） |
| `nencho.html` | 年末調整（P10 年調フォーム）。LIFF「年末調整」の行き先。`?p=reg`（LINE のご登録）だけ窓へ渡す |
| `obi-test.html` | 試験用（2026-11-07）。あとで消す |
