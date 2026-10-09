'use client'
// 拾遗 SHIYI · 数字博物馆 —— 单页长滚动叙事
// 视觉系统：宣纸底色 × 墨色 × 朱砂；卷轴式幕间展开 + 书法描边动画 + 水墨粒子背景
import { useEffect, useRef } from 'react'

const RELICS = [
  {
    char: '爵',
    name: '青铜爵',
    era: '商 · 晚期',
    title: '三千年前的一杯酒',
    story: '爵是礼器，也是温酒器。三足立于火塘之上，口沿的两根立柱或许用来悬滤网、滤去酒糟。器身布满饕餮纹 —— 那不是装饰，是商人通神的二维码。一爵酒，先祭天，再敬人。',
    seal: '礼',
  },
  {
    char: '瓷',
    name: '龙泉青瓷瓶',
    era: '南宋',
    title: '雨过天青云破处',
    story: '粉青釉色，是铁的氧化物在一千二百五十度还原焰里的偶然。宋人把偶然做成了必然：厚釉、慢冷、多次施釉。瓶身没有一笔多余 —— 宋人的极简，比北欧早了一千年。',
    seal: '雅',
  },
  {
    char: '琴',
    name: '仲尼式古琴',
    era: '唐',
    title: '声音还在',
    story: '琴面圆拱象天，琴底平直象地；十三个徽位，是泛音的坐标。这张琴的断纹如蛇腹、如流水 —— 木纹会老，漆灰会裂，但上弦一试，唐人的音高仍从七根丝弦上站起来。',
    seal: '和',
  },
]

/* ---------- 水墨粒子背景：墨团缓慢漂移、呼吸 ---------- */
function InkCanvas() {
  const ref = useRef(null)
  useEffect(() => {
    const cv = ref.current
    const ctx = cv.getContext('2d')
    let w, h, raf
    const DPR = Math.min(window.devicePixelRatio || 1, 2)

    function resize() {
      w = cv.clientWidth * DPR
      h = cv.clientHeight * DPR
      cv.width = w
      cv.height = h
    }
    resize()
    window.addEventListener('resize', resize)

    // 生成 14 团淡墨：位置、半径、漂移方向、呼吸相位
    const blobs = Array.from({ length: 14 }, () => ({
      x: Math.random(), y: Math.random(),
      r: 120 + Math.random() * 220,
      dx: (Math.random() - 0.5) * 0.00018,
      dy: (Math.random() - 0.5) * 0.00012,
      ph: Math.random() * Math.PI * 2,
      sp: 0.15 + Math.random() * 0.25,
    }))

    function paint(t) {
      ctx.clearRect(0, 0, w, h)
      for (const b of blobs) {
        b.x = (b.x + b.dx + 1) % 1
        b.y = (b.y + b.dy + 1) % 1
        const breathe = 0.75 + 0.25 * Math.sin(t * 0.0004 * b.sp + b.ph)
        const R = b.r * DPR * breathe
        const g = ctx.createRadialGradient(b.x * w, b.y * h, 0, b.x * w, b.y * h, R)
        g.addColorStop(0, 'rgba(28, 24, 18, 0.045)')
        g.addColorStop(0.7, 'rgba(28, 24, 18, 0.02)')
        g.addColorStop(1, 'rgba(28, 24, 18, 0)')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(b.x * w, b.y * h, R, 0, Math.PI * 2)
        ctx.fill()
      }
      raf = requestAnimationFrame(paint)
    }
    raf = requestAnimationFrame(paint)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={ref} className="ink-bg" aria-hidden="true" />
}

/* ---------- 滚动进场：卷轴展开 ---------- */
function useScrollReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('revealed') }),
      { threshold: 0.22 }
    )
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

export default function Page() {
  useScrollReveal()
  return (
    <main>
      <InkCanvas />

      {/* ===== 卷首 ===== */}
      <header className="hero">
        <p className="hero-kicker">数字博物馆 · DIGITAL MUSEUM</p>
        <svg className="calligraphy" viewBox="0 0 640 320" role="img" aria-label="拾遗">
          <text x="50%" y="52%" textAnchor="middle" dominantBaseline="central">拾遗</text>
        </svg>
        <p className="hero-sub">沧海拾遗，山河故人 —— 三件文物的前世今生</p>
        <div className="hero-rule"><i>卷一</i></div>
        <p className="hero-scroll">向下徐展</p>
      </header>

      {/* ===== 三幕 ===== */}
      {RELICS.map((r, i) => (
        <section className="act reveal" key={r.char}>
          <div className="act-no">{String(i + 1).padStart(2, '0')}</div>
          <div className="scroll-frame">
            <div className="rod rod-top" />
            <div className="parchment">
              <div className="glyph">{r.char}</div>
              <div className="act-text">
                <p className="act-era">{r.era}</p>
                <h2>{r.name}</h2>
                <h3>{r.title}</h3>
                <p className="story">{r.story}</p>
                <span className="seal">{r.seal}</span>
              </div>
            </div>
            <div className="rod rod-bottom" />
          </div>
        </section>
      ))}

      {/* ===== 卷尾 ===== */}
      <footer className="epilogue reveal">
        <p className="ep-line">器有魂魄，物有归处。</p>
        <p className="ep-note">拾遗 SHIYI · 本馆为设计演示作品，器物信息取真实考古常识</p>
      </footer>
    </main>
  )
}
