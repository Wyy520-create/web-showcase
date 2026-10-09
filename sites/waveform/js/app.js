/* ===== Waveform · 声验室 核心逻辑 =====
 * 纯原生 Web Audio API + Canvas，无第三方依赖。
 * 结构：AudioContext 单例 → 各声源(振荡器/琴键/麦克风) → 总线 Gain → Analyser → 扬声器
 * AnalyserNode 同时喂两个画布：时域波形(示波器) 与 频域柱状图(频谱)。
 */
"use strict";

/* ---------- 音频总线 ---------- */
let actx = null, analyser = null, bus = null;

function ensureAudio() {
  if (!actx) {
    actx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = actx.createAnalyser();
    analyser.fftSize = 2048;
    bus = actx.createGain();
    bus.gain.value = 0.5;               // 总音量，防止多键齐按削波
    bus.connect(analyser);
    analyser.connect(actx.destination);
  }
  if (actx.state === "suspended") actx.resume();
}

/* ---------- 画布通用 ---------- */
function fitCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth;
  const h = canvas.getAttribute("height") / canvas.getAttribute("width") * w;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  return { ctx: canvas.getContext("2d"), w: canvas.width, h: canvas.height };
}
const scopeCv = document.getElementById("scope");
const specCv = document.getElementById("spectrum");
window.addEventListener("resize", () => { scopeView = fitCanvas(scopeCv); specView = fitCanvas(specCv); });
let scopeView = fitCanvas(scopeCv);
let specView = fitCanvas(specCv);

/* ---------- 绘制循环 ---------- */
const timeData = new Uint8Array(2048);
const freqData = new Uint8Array(1024);

function draw() {
  requestAnimationFrame(draw);
  if (!analyser) return;

  // 示波器：时域波形
  analyser.getByteTimeDomainData(timeData);
  const s = scopeView, sc = s.ctx;
  sc.fillStyle = "rgba(5,7,12,0.35)";
  sc.fillRect(0, 0, s.w, s.h);
  sc.strokeStyle = "rgba(0,240,255,0.18)";
  sc.lineWidth = 1;
  sc.beginPath();
  sc.moveTo(0, s.h / 2); sc.lineTo(s.w, s.h / 2);
  sc.stroke();
  sc.strokeStyle = "#00f0ff";
  sc.lineWidth = 2;
  sc.shadowColor = "#00f0ff";
  sc.shadowBlur = 10;
  sc.beginPath();
  const step = s.w / timeData.length;
  for (let i = 0; i < timeData.length; i++) {
    const y = (timeData[i] / 255) * s.h;
    i === 0 ? sc.moveTo(0, y) : sc.lineTo(i * step, y);
  }
  sc.stroke();
  sc.shadowBlur = 0;

  // 频谱：对数频率感的柱状图
  analyser.getByteFrequencyData(freqData);
  const f = specView, fc = f.ctx;
  fc.fillStyle = "rgba(5,7,12,0.4)";
  fc.fillRect(0, 0, f.w, f.h);
  const bars = 96;
  const barW = f.w / bars;
  for (let i = 0; i < bars; i++) {
    // 低频占左半，指数取样让低频细节可见
    const idx = Math.floor(Math.pow(i / bars, 1.6) * freqData.length * 0.7);
    const v = freqData[idx] / 255;
    const h = v * f.h;
    const hue = 190 - v * 70;          // 青 → 紫 渐变
    fc.fillStyle = `hsla(${hue}, 95%, ${45 + v * 20}%, .92)`;
    fc.fillRect(i * barW + 1, f.h - h, barW - 2, h);
  }
}
draw();

/* ---------- 01 信号发生器 ---------- */
let osc = null, oscGain = null, playing = false;
let wave = "sine";
const freqInput = document.getElementById("freq");
const freqLabel = document.getElementById("freqLabel");
const toggleBtn = document.getElementById("toggle");

freqInput.addEventListener("input", () => {
  freqLabel.textContent = freqInput.value + " Hz";
  if (osc) osc.frequency.setTargetAtTime(+freqInput.value, actx.currentTime, 0.01);
});

document.getElementById("waveBtns").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  document.querySelectorAll("#waveBtns button").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  wave = btn.dataset.wave;
  if (osc) osc.type = wave;
});

toggleBtn.addEventListener("click", () => {
  ensureAudio();
  if (!playing) {
    osc = actx.createOscillator();
    osc.type = wave;
    osc.frequency.value = +freqInput.value;
    oscGain = actx.createGain();
    oscGain.gain.setValueAtTime(0, actx.currentTime);
    oscGain.gain.linearRampToValueAtTime(0.6, actx.currentTime + 0.03);
    osc.connect(oscGain).connect(bus);
    osc.start();
    playing = true;
    toggleBtn.textContent = "■ 停止信号";
    toggleBtn.classList.add("on");
  } else {
    oscGain.gain.setTargetAtTime(0, actx.currentTime, 0.02);
    const old = osc;
    setTimeout(() => old.stop(), 120);
    osc = null; playing = false;
    toggleBtn.textContent = "▶ 播放信号";
    toggleBtn.classList.remove("on");
  }
});

/* ---------- 03 键盘琴 ---------- */
// 12 个键：C4 → C5，白键绑定 ASDFGHJK，黑键 WETYU
const KEYS = [
  { note: "C4",  freq: 261.63, key: "A", white: true },
  { note: "C#4", freq: 277.18, key: "W", white: false },
  { note: "D4",  freq: 293.66, key: "S", white: true },
  { note: "D#4", freq: 311.13, key: "E", white: false },
  { note: "E4",  freq: 329.63, key: "D", white: true },
  { note: "F4",  freq: 349.23, key: "F", white: true },
  { note: "F#4", freq: 369.99, key: "T", white: false },
  { note: "G4",  freq: 392.00, key: "G", white: true },
  { note: "G#4", freq: 415.30, key: "Y", white: false },
  { note: "A4",  freq: 440.00, key: "H", white: true },
  { note: "A#4", freq: 466.16, key: "U", white: false },
  { note: "B4",  freq: 493.88, key: "J", white: true },
  { note: "C5",  freq: 523.25, key: "K", white: true },
];
const NOTE_NAME = { C: "do", D: "re", E: "mi", F: "fa", G: "sol", A: "la", B: "si" };
const piano = document.getElementById("piano");
const lastKeyHint = document.getElementById("lastKey");

// 渲染琴键：先摆白键，再按位置叠黑键
let whiteIdx = 0;
KEYS.forEach((k) => {
  if (k.white) {
    const el = document.createElement("div");
    el.className = "wkey";
    el.dataset.key = k.key;
    el.textContent = k.key;
    el.dataset.note = k.note;
    piano.appendChild(el);
    whiteIdx++;
  }
});
KEYS.filter(k => !k.white).forEach((k) => {
  const el = document.createElement("div");
  el.className = "bkey";
  el.dataset.key = k.key;
  el.textContent = k.key;
  el.dataset.note = k.note;
  // 黑键位于前一个白键右侧 70% 处
  const pos = KEYS.slice(0, KEYS.indexOf(k)).filter(x => x.white).length;
  el.style.left = `calc(${(pos / whiteIdx) * 100}% - 3.25%)`;
  piano.appendChild(el);
});

const activeVoices = {}; // key -> {osc, gain}

function noteOn(k) {
  ensureAudio();
  if (activeVoices[k.key]) return;
  const oscN = actx.createOscillator();
  oscN.type = "triangle";                 // 三角波接近钢琴泛音，柔和不刺耳
  oscN.frequency.value = k.freq;
  const g = actx.createGain();
  g.gain.setValueAtTime(0, actx.currentTime);
  g.gain.linearRampToValueAtTime(0.5, actx.currentTime + 0.015);
  oscN.connect(g).connect(bus);
  oscN.start();
  activeVoices[k.key] = { osc: oscN, gain: g };
  document.querySelectorAll(`[data-key="${k.key}"]`).forEach(el => el.classList.add("down"));
  lastKeyHint.textContent = `♪ ${k.note}（${NOTE_NAME[k.note[0]]}）· ${k.freq.toFixed(2)} Hz —— 波形与频谱同步联动`;
}

function noteOff(k) {
  const v = activeVoices[k.key];
  if (!v) return;
  v.gain.gain.setTargetAtTime(0, actx.currentTime, 0.08);
  setTimeout(() => { try { v.osc.stop(); } catch (_) {} }, 400);
  delete activeVoices[k.key];
  document.querySelectorAll(`[data-key="${k.key}"]`).forEach(el => el.classList.remove("down"));
}

document.addEventListener("keydown", (e) => {
  if (e.repeat) return;
  const k = KEYS.find(x => x.key === e.key.toUpperCase());
  if (k) noteOn(k);
});
document.addEventListener("keyup", (e) => {
  const k = KEYS.find(x => x.key === e.key.toUpperCase());
  if (k) noteOff(k);
});
piano.addEventListener("pointerdown", (e) => {
  const el = e.target.closest("[data-key]");
  if (!el) return;
  const k = KEYS.find(x => x.key === el.dataset.key);
  if (k) noteOn(k);
});
piano.addEventListener("pointerup", (e) => {
  const el = e.target.closest("[data-key]");
  if (!el) return;
  const k = KEYS.find(x => x.key === el.dataset.key);
  if (k) noteOff(k);
});

/* ---------- 04 麦克风 ---------- */
const micBtn = document.getElementById("micBtn");
const micHint = document.getElementById("micHint");
let micStream = null, micOn = false;

micBtn.addEventListener("click", async () => {
  ensureAudio();
  if (!micOn) {
    try {
      micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      micHint.textContent = "无法访问麦克风：" + err.message;
      return;
    }
    const src = actx.createMediaStreamSource(micStream);
    src.connect(bus);
    micOn = true;
    micBtn.textContent = "■ 关闭麦克风";
    micBtn.classList.add("on");
    micHint.textContent = "麦克风已开启 —— 说句话、吹个口哨，看波形跳动。";
  } else {
    micStream.getTracks().forEach(t => t.stop());
    micOn = false;
    micBtn.textContent = "🎙 开启麦克风";
    micBtn.classList.remove("on");
    micHint.textContent = "麦克风数据仅在本地处理，不会上传。";
  }
});
