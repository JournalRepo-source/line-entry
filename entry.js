/*
 * LINE の入口ページ（額縁）の共通部品。ページごとに window.ENTRY を置いてから読み込む:
 *   window.ENTRY = { liffId: "...", gasUrl: "https://script.google.com/macros/s/.../exec", pass: ["p"] };
 * 流れ: LIFF で本人の証明（ID トークン）をもらう → 隠しフォームで GAS の doPost へ送り、窓（iframe）に画面を出す。
 * GAS を窓の中で開くので、GAS を直接開いたときの「Google Apps Script のユーザーによって…」の帯が出ない。
 * ※ この倉庫は公開。合鍵・鍵・トークン・個人データをここに書かない（合鍵は LINE のメニューの URL から受け取って窓へ渡すだけ）。
 */
(function () {
  "use strict";
  // iPhone・iPad は確認が済むまで今までの道（GAS へそのまま移る）へ流す。確かめたら false に
  var IOS_FALLBACK = true;

  var C = window.ENTRY || {};
  var msgEl = document.getElementById("msg");
  function say(text, isErr) {
    if (!msgEl) return;
    msgEl.textContent = text;
    msgEl.className = isErr ? "err" : "";
    msgEl.hidden = !text;
  }

  // URL の問い合わせから、渡してよい名前（C.pass）だけを拾う
  function picked() {
    var out = {}, q = new URLSearchParams(location.search);
    (C.pass || []).forEach(function (k) { if (q.has(k)) out[k] = q.get(k); });
    // LIFF が liff.state をほどく前に来たときの予備
    var st = q.get("liff.state");
    if (st) {
      var q2 = new URLSearchParams(String(st).replace(/^[?\/]+/, ""));
      (C.pass || []).forEach(function (k) { if (!(k in out) && q2.has(k)) out[k] = q2.get(k); });
    }
    return out;
  }
  function qs(o) {
    return Object.keys(o).map(function (k) { return encodeURIComponent(k) + "=" + encodeURIComponent(o[k]); }).join("&");
  }
  function isIOS() {
    var ua = navigator.userAgent || "";
    return /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  }

  var vals = picked();
  if (!C.gasUrl) { say("このページの設定がありません。事務所へご連絡ください。", true); return; }
  if (IOS_FALLBACK && isIOS()) {
    var q = qs(vals);
    location.replace(C.gasUrl + (q ? "?" + q : ""));
    return;
  }
  if (!window.liff || !C.liffId) { say("LINE の部品を読み込めませんでした。通信のよい所で、LINE のメニューから開き直してください。", true); return; }

  liff.init({ liffId: C.liffId }).then(function () {
    if (!liff.isLoggedIn()) { say("LINE のログインへ移ります…"); liff.login({ redirectUri: location.href }); return; }
    var idt = liff.getIDToken();
    if (!idt) { say("LINE から本人の確認が取れませんでした。LINE のメニューから開き直してください。", true); return; }
    var f = document.createElement("form");
    f.method = "post"; f.action = C.gasUrl; f.target = "gas"; f.style.display = "none";
    var all = { idt: idt };
    Object.keys(vals).forEach(function (k) { all[k] = vals[k]; });
    Object.keys(all).forEach(function (k) {
      var i = document.createElement("input");
      i.type = "hidden"; i.name = k; i.value = all[k];
      f.appendChild(i);
    });
    document.body.appendChild(f);
    var fr = document.getElementById("gas");
    fr.addEventListener("load", function () { say(""); }, { once: true });
    f.submit();
  }).catch(function (e) {
    say("LINE の準備に失敗しました（" + (e && e.message ? e.message : e) + "）。LINE のメニューから開き直してください。", true);
  });
})();
