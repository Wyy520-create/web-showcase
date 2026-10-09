// 事件视界 EVENT HORIZON —— 滚动驱动的 3D 交互叙事
// 结构：全屏固定 Canvas（3D 场景） + 滚动的四幕文字（DOM 覆盖层）
import React, { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import BlackHole from './BlackHole.jsx'

/* ---------- 相机装置：页面滚动进度 → 相机轨道（推近黑洞） ---------- */
function Rig({ progress }) {
  const target = useMemo(() => new THREE.Vector3(), [])
  useFrame((state) => {
    const p = progress.current
    // 轨道：z 从 14 推到 5.2，y 微微下沉，带轻微环绕弧线
    const z = 14 - p * 8.8
    const y = 1.4 - p * 1.0
    const x = Math.sin(p * Math.PI) * 1.6
    target.set(x, y, z)
    state.camera.position.lerp(target, 0.07)
    state.camera.lookAt(0, 0.15, 0)
  })
  return null
}

function Scene() {
  // 滚动进度写进 ref：useFrame 每帧直接读，不触发 React 重渲染
  const progress = useRef(0)
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      progress.current = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div className="canvas-wrap">
      <Canvas camera={{ position: [0, 1.4, 14], fov: 55 }} dpr={[1, 1.75]}>
        <color attach="background" args={['#020204']} />
        <Rig progress={progress} />
        <BlackHole />
      </Canvas>
    </div>
  )
}

/* ---------- 四幕文字 ---------- */
const ACTS = [
  {
    no: '第一幕',
    title: '光',
    en: 'THE LIGHT',
    text: '在 2.6 万光年外的人马座 A*，潜伏着一个 430 万个太阳质量的巨兽。它此刻正在吞食一颗路过的恒星。向下滚动，靠近它。',
  },
  {
    no: '第二幕',
    title: '吸积盘',
    en: 'THE ACCRETION DISC',
    text: '气体在坠落前跳最后一支舞。它们在轨道上互相摩擦、升温，发出比千亿颗太阳更亮的光 —— 这是宇宙中最壮观的炼炉。',
  },
  {
    no: '第三幕',
    title: '视界之内',
    en: 'BEYOND THE HORIZON',
    text: '一旦越过事件视界，逃逸速度超过光速 —— 连光也无法回头。这里不是「黑暗」，而是时间的终点：越靠近，流逝越慢。',
  },
  {
    no: '终幕',
    title: '回望',
    en: 'LOOKING BACK',
    text: '我们仍安全地站在远方。黑洞不吞噬远方的光，它只是宇宙在提醒我们：已知的一切，都站在未知的门口。',
  },
]

function Act({ no, title, en, text, last }) {
  return (
    <section className={`act ${last ? 'act-last' : ''}`}>
      <div className="act-inner">
        <p className="act-no">{no}</p>
        <h2 className="act-title">{title}</h2>
        <p className="act-en">{en}</p>
        <p className="act-text">{text}</p>
        {last && <button className="act-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑ 回到星空顶端，再看一遍</button>}
      </div>
    </section>
  )
}

export default function App() {
  return (
    <div className="page">
      <Scene />
      <div className="overlay">
        <header className="hero">
          <p className="hero-kicker">AN INTERACTIVE ODYSSEY</p>
          <h1 className="hero-title">事件视界</h1>
          <p className="hero-en">EVENT HORIZON</p>
          <p className="hero-hint">一场坠向黑洞的滚动旅程 · 共四幕</p>
          <p className="hero-arrow">↓</p>
        </header>
        {ACTS.map((a, i) => (
          <Act key={a.en} {...a} last={i === ACTS.length - 1} />
        ))}
        <footer className="foot">
          <p>EVENT HORIZON · 事件视界 — React + React Three Fiber + 自定义 GLSL · 本页为科学可视化演示，天体参数取真实数量级</p>
        </footer>
      </div>
    </div>
  )
}
