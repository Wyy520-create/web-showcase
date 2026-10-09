<template>
  <!-- ===== 报头 ===== -->
  <header class="masthead reveal">
    <div class="mast-top">
      <span>第 47 期</span>
      <span>每月一号出刊</span>
      <span>免费取阅</span>
    </div>
    <h1 class="mast-title">华氏<span>FAHRENHEIT</span></h1>
    <p class="mast-sub">独立书店 · 选书月刊 —— 「我们只卖自己读过的书」</p>
  </header>

  <!-- ===== 本期主打 ===== -->
  <section class="feature">
    <div class="feature-cover reveal">
      <div class="cover-art c1">
        <span class="cover-title">纸上<br />茶馆</span>
        <span class="cover-author">周叙白 著</span>
      </div>
    </div>
    <div class="feature-text">
      <p class="kicker reveal">本期主打 · 散文</p>
      <h2 class="reveal">一杯茶的时间，<br />读一座城。</h2>
      <p class="reveal">《纸上茶馆》写了三十二座城的三十七家茶馆。作者周叙白用五年时间，沿着运河与铁路，把茶馆的方桌、评书的醒木、老板娘的手势一一记在纸上。读它，像坐在慢车里看风景。</p>
      <blockquote class="reveal">「茶馆是城市的客厅，茶凉了，故事才刚开始。」</blockquote>
      <p class="price reveal">¥49.00 · 到店会员九折</p>
    </div>
  </section>

  <!-- ===== 本月书单 ===== -->
  <section class="shelf">
    <h3 class="sec-title reveal">本月书单 · <em>SIX PICKS</em></h3>
    <div class="book-grid">
      <article v-for="(b, i) in books" :key="b.title" class="book reveal">
        <div class="cover" :class="'c' + ((i % 6) + 2)">
          <span class="t">{{ b.title }}</span>
          <span class="a">{{ b.author }}</span>
        </div>
        <p class="cat">{{ b.cat }}</p>
        <p class="desc">{{ b.desc }}</p>
      </article>
    </div>
  </section>

  <!-- ===== 编辑手记 ===== -->
  <section class="editorial">
    <p class="vertical reveal">编辑手记</p>
    <div class="ed-text">
      <p class="reveal">开店的第七年，我们依然坚持每天手写一张「今日推荐」贴在门口。有客人问：你们怎么不做线上算法推荐？</p>
      <p class="reveal">算法知道你可能喜欢什么，但不知道你**此刻**需要什么。而此刻，只有站在书架前、手指划过书脊的你，自己知道。</p>
      <p class="sign reveal">—— 店主 · 华叔</p>
    </div>
  </section>

  <footer>
    <p>华氏书店 FAHRENHEIT BOOKS · 本页为设计演示作品，书目与人物均为虚构</p>
    <p>营业时间 10:00 – 22:00 · 周三店休</p>
  </footer>
</template>

<script setup>
import { onMounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const books = [
  { title: '晚风修理铺', author: '陈麦', cat: '长篇小说', desc: '一条老街上，修手表的老人替整条街保管秘密。' },
  { title: '住在灯塔里的人', author: '阿蘅', cat: '短篇小说集', desc: '十二个与「守望」有关的故事，第十二个没有写完。' },
  { title: '山海经异兽考', author: '谈迁', cat: '人文社科', desc: '用博物学的眼光重读《山海经》，每个异兽都有原型。' },
  { title: '把时间缝进衣服', author: '苏叶', cat: '生活方式', desc: '一个裁缝的十年：量体、剪裁、等待与告别。' },
  { title: '夜航西飞注疏', author: '老谭', cat: '书评笔记', desc: '重读柏瑞尔·马卡姆，一条航线一段人生注脚。' },
  { title: '县城照相馆', author: '方圆', cat: '影像纪实', desc: '1980—2010，一家照相馆底片里的县城变迁。' },
]

onMounted(() => {
  // 滚动进场：淡入 + 上移 + 轻裁切
  gsap.utils.toArray('.reveal').forEach((el) => {
    gsap.from(el, {
      y: 46,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    })
  })
  // 主打书封视差：滚动时缓速上移，制造纵深
  gsap.to('.feature-cover', {
    yPercent: -8,
    ease: 'none',
    scrollTrigger: { trigger: '.feature', start: 'top bottom', end: 'bottom top', scrub: true },
  })
})
</script>

<style>
/* ===== 纸感基调：米色纸面 × 墨黑 × 朱红点缀 ===== */
:root {
  --paper: #f5f1e8;
  --ink: #1e1b16;
  --red: #b3382e;
  --dim: #7a7263;
}
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  background: var(--paper);
  color: var(--ink);
  font-family: "Songti SC", "Noto Serif CJK SC", "SimSun", serif;
  line-height: 1.9;
}

/* ===== 报头 ===== */
.masthead {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2.2rem 1.5rem 1.4rem;
  border-bottom: 3px double var(--ink);
}
.mast-top {
  display: flex;
  justify-content: space-between;
  font-size: .78rem;
  letter-spacing: .3em;
  color: var(--dim);
  border-bottom: 1px solid var(--ink);
  padding-bottom: .6rem;
  margin-bottom: 1.2rem;
}
.mast-title {
  font-size: clamp(3rem, 9vw, 6rem);
  font-weight: 900;
  letter-spacing: .28em;
  text-align: center;
  line-height: 1.1;
}
.mast-title span {
  display: block;
  font-size: clamp(.7rem, 1.6vw, 1rem);
  font-weight: 400;
  letter-spacing: 1.2em;
  color: var(--red);
  text-indent: 1.2em;
  margin-top: .5rem;
  font-family: "Didot", "Times New Roman", serif;
}
.mast-sub {
  text-align: center;
  color: var(--dim);
  font-size: .92rem;
  letter-spacing: .18em;
  margin-top: 1rem;
}

/* ===== 本期主打 ===== */
.feature {
  max-width: 1100px;
  margin: 0 auto;
  padding: 5rem 1.5rem;
  display: grid;
  grid-template-columns: 1fr 1.15fr;
  gap: 4rem;
  align-items: center;
  border-bottom: 1px solid var(--ink);
}
.feature-cover { will-change: transform; }
.cover-art {
  aspect-ratio: 3 / 4;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 2rem;
  box-shadow: 14px 18px 0 -6px var(--paper), 16px 22px 0 -4px var(--ink);
  transition: transform .3s;
}
.cover-art:hover { transform: rotate(-1.2deg) translateY(-4px); }
.c1 { background: linear-gradient(160deg, #2e4a43, #152521); color: #e9e2cf; }
.cover-title {
  font-size: clamp(2.2rem, 5vw, 3.4rem);
  font-weight: 800;
  line-height: 1.25;
  letter-spacing: .12em;
}
.cover-author {
  margin-top: 1rem;
  font-size: .85rem;
  letter-spacing: .3em;
  opacity: .8;
}
.kicker {
  color: var(--red);
  letter-spacing: .35em;
  font-size: .8rem;
  margin-bottom: 1rem;
}
.feature-text h2 {
  font-size: clamp(1.9rem, 4.5vw, 3rem);
  line-height: 1.45;
  margin-bottom: 1.4rem;
}
.feature-text p { color: #3c372e; text-align: justify; }
.feature-text blockquote {
  margin: 1.6rem 0;
  padding-left: 1.2rem;
  border-left: 3px solid var(--red);
  font-size: 1.15rem;
  color: var(--ink);
}
.price {
  font-family: "Didot", Georgia, serif;
  letter-spacing: .1em;
  color: var(--red);
}

/* ===== 书单 ===== */
.shelf {
  max-width: 1100px;
  margin: 0 auto;
  padding: 4.5rem 1.5rem;
  border-bottom: 1px solid var(--ink);
}
.sec-title {
  font-size: 1.7rem;
  letter-spacing: .25em;
  margin-bottom: 2.6rem;
}
.sec-title em {
  font-family: "Didot", Georgia, serif;
  font-style: italic;
  color: var(--red);
  letter-spacing: .15em;
}
.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2.6rem 2rem;
}
.cover {
  aspect-ratio: 3 / 4;
  border-radius: 3px;
  padding: 1.4rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform .3s, box-shadow .3s;
  cursor: default;
}
.cover:hover { transform: translateY(-8px) rotate(-.6deg); box-shadow: 0 22px 36px -18px rgba(30, 27, 22, .45); }
.cover .t {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: .1em;
  line-height: 1.4;
  writing-mode: vertical-rl; /* 书题竖排，书卷气 */
  max-height: 70%;
}
.cover .a { font-size: .8rem; letter-spacing: .25em; opacity: .85; }
.c2 { background: linear-gradient(150deg, #c96f4a, #8f3d2a); color: #fdf3e3; }
.c3 { background: linear-gradient(150deg, #274b6d, #0f2338); color: #dbe7f3; }
.c4 { background: linear-gradient(150deg, #b3382e, #6d1f17); color: #f7e8d8; }
.c5 { background: linear-gradient(150deg, #6d5a8f, #3a2d57); color: #e9e2f5; }
.c6 { background: linear-gradient(150deg, #3f6d4e, #1d3a27); color: #e2f0e3; }
.c7 { background: linear-gradient(150deg, #8f7a4a, #574728); color: #f5eeda; }
.book .cat {
  margin-top: 1rem;
  font-size: .78rem;
  letter-spacing: .3em;
  color: var(--red);
}
.book .desc { font-size: .92rem; color: #4a4438; margin-top: .4rem; }

/* ===== 编辑手记 ===== */
.editorial {
  max-width: 1100px;
  margin: 0 auto;
  padding: 5rem 1.5rem;
  display: flex;
  gap: 2.4rem;
  align-items: flex-start;
}
.vertical {
  writing-mode: vertical-rl;
  font-size: 1.6rem;
  font-weight: 800;
  letter-spacing: .5em;
  color: var(--red);
  border-right: 2px solid var(--ink);
  padding-right: 1.2rem;
}
.ed-text p { font-size: 1.12rem; text-align: justify; margin-bottom: 1.2rem; }
.sign { text-align: right; color: var(--dim); font-style: italic; }

footer {
  border-top: 3px double var(--ink);
  text-align: center;
  padding: 2rem 1rem 2.6rem;
  font-size: .8rem;
  letter-spacing: .2em;
  color: var(--dim);
  line-height: 2.2;
}

@media (max-width: 820px) {
  .feature { grid-template-columns: 1fr; gap: 2.4rem; }
}
</style>
