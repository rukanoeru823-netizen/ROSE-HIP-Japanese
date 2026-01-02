/* ===========================  共通  =========================== */

/*
  ===========================
  Splash Screen Control
  ===========================
  【目的】
  ・ページ読み込み直後にスプラッシュを表示
  ・ロゴの落下＆バウンドアニメーション完了後に
    サブテキスト（HAIR & TOTAL BEAUTY）を表示
  ・最終的にスプラッシュ全体をフェードアウト

  【演出の流れ】
  1. window の load 完了を待つ
  2. ロゴアニメーションが止まる
  3. 少し遅れてサブテキストを表示
  4. 全演出終了後にスプラッシュを非表示

  【制御方針】
  ・表示／非表示・アニメーションは CSS が担当
  ・JS は「クラスを付けるタイミング」だけを管理
*/

window.addEventListener("load", () => {
  // スプラッシュ要素取得
  const splash = document.querySelector(".splash");

  // ロゴ下に表示するサブテキスト（HAIR & TOTAL BEAUTY）
  const splashSub = document.querySelector(".splash-sub");

  // ロゴ着地後にサブテキストを表示
  setTimeout(() => {
    splashSub.classList.add("is-visible");
  }, 2000);

  // ※ ロゴのバウンドが収まるタイミングに合わせる
  // ロゴアニメーション完了を待ってから非表示
  setTimeout(() => {
    splash.classList.add("is-hidden");
  }, 4000); // ← CSS animation 時間と合わせる
});

/* =========================== header =========================== */

/*
  ===========================
  Hamburger Menu Control
  ===========================
  【目的】
  ・ハンバーガーボタンでSPメニューを開閉
  ・同時にボタンの見た目を × に変形

  【CSS連動】
  ・.hamburger.is-open
  ・.sp-menu.is-open
*/

const hamburger = document.querySelector(".hamburger"); // ボタン
const spMenu = document.querySelector(".sp-menu"); // SPメニュー本体

hamburger.addEventListener("click", () => {
  // ハンバーガー → ×（戻るボタン）へ切り替え
  hamburger.classList.toggle("is-open");

  // SPメニューを表示／非表示
  spMenu.classList.toggle("is-open");
});

/* ===========================  main  =========================== */

/*
  ===========================
  Hero Text Sync Control
  ===========================
  【目的】
  ・再生中の動画時間に合わせて
    ヒーローテキストを同期表示

  【ポイント】
  ・SP / PC 両方の video に対応
  ・実際に「再生中」の video を判定
  ・requestAnimationFrame で常時同期
*/

const videos = document.querySelectorAll(".hero-video"); // ヒーロー動画
const texts = document.querySelectorAll(".hero-text"); // ヒーローテキスト

const SCENE_TIME = 5; // 1シーンの長さ（秒）

/*
  再生中の video を取得
  ・paused / ended を見て判定
*/

function getActiveVideo() {
  // 再生中の video を探す
  for (const video of videos) {
    if (!video.paused && !video.ended) {
      return video;
    }
  }
  return null;
}

/*
  動画の currentTime に応じて
  表示するテキストを切り替える
*/

function syncTextWithVideo() {
  const activeVideo = getActiveVideo();

  // まだ再生されていなければ次フレームで再試行
  if (!activeVideo) {
    requestAnimationFrame(syncTextWithVideo);
    return;
  }

  // 現在の再生時間（秒）
  const currentTime = activeVideo.currentTime;

  // 表示すべきシーン番号を算出
  const sceneIndex = Math.floor(currentTime / SCENE_TIME) % texts.length;

  // 該当テキストだけ is-active を付与
  texts.forEach((text, index) => {
    text.classList.toggle("is-active", index === sceneIndex);
  });
  // 次フレームでも同期を続ける
  requestAnimationFrame(syncTextWithVideo);
}

/*
  動画が再生されたタイミングで
  テキスト同期処理をスタート
*/

videos.forEach((video) => {
  video.addEventListener("play", () => {
    requestAnimationFrame(syncTextWithVideo);
  });
});

/* ===========================  footer  =========================== */
/*
  ===========================
  Footer Toggle Control
  ===========================
  【目的】
  ・ヒーロー下の誘導アイコンをタップして
    フッターをスライドイン表示
  ・フッター内の close 操作、または
    ハンバーガーメニュー操作時にフッターを閉じる

  【CSS連動】
  ・.footer.is-active
    → transform: translateY(0);
*/

/* フッターを開くトリガー（ヒーロー下の矢印アイコン） */
const btn = document.querySelector(".hero-icon-area");

/* フッター本体 */
const footer = document.querySelector(".footer");

/* フッター内の close エリア */
const footerClose = document.querySelector(".footer-close-area");

/* ハンバーガーボタン（SPメニュー操作検知用） */
const hamburgers = document.querySelector(".hamburger");

/*
  フッターを開く
  ・hero-icon-area をタップした時
*/
btn.addEventListener("click", () => {
  footer.classList.add("is-active");
});

/*
  フッターを閉じる
  ・フッター内 close エリアをタップした時
*/
footerClose.addEventListener("click", () => {
  footer.classList.remove("is-active");
});

/*
  フッターを閉じる
  ・ハンバーガーメニュー操作時
  （SPメニューとフッターの同時表示防止）
*/
hamburgers.addEventListener("click", () => {
  footer.classList.remove("is-active");
});
