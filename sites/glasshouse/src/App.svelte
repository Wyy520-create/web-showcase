<!-- 璃光 GLASSHOUSE · 东方香氛 —— 玻璃拟态品牌页 -->
<script>
  import TiltCard from './TiltCard.svelte'

  // 鼠标视差：背景光斑随指针漂移
  let mx = 50, my = 40
  function onMove(e) {
    mx = (e.clientX / window.innerWidth) * 100
    my = (e.clientY / window.innerHeight) * 100
  }

  const products = [
    { name: '初雪',   en: 'FIRST SNOW',   notes: '白茶 · 青竹 · 白麝香', price: '¥428', no: '01', tint: '#a8c8e8' },
    { name: '远山',   en: 'DISTANT PEAK', notes: '雪松 · 岩兰草 · 冷杉', price: '¥468', no: '02', tint: '#9fb8a8' },
    { name: '花信',   en: 'FLOWER LETTER',notes: '山茶 · 梨花 · 麝香',   price: '¥398', no: '03', tint: '#e8b8c8' },
    { name: '月色',   en: 'MOONLIT',      notes: '桂花 · 檀木 · 琥珀',   price: '¥458', no: '04', tint: '#c8b8e0' },
  ]
</script>

<svelte:window on:mousemove={onMove} />

<div class="page" style="--mx:{mx}%; --my:{my}%;">
  <div class="glow g1"></div>
  <div class="glow g2"></div>

  <header class="hero">
    <p class="brand-en">GLASSHOUSE · 璃光</p>
    <h1>把光，封进<span>玻璃</span>里</h1>
    <p class="hero-sub">东方植物香氛 —— 以四季为灵感，四款香型，四种光的质地。</p>
    <div class="hero-tags">
      <i>纯素配方</i><i>手工罐装</i><i>可回收玻璃</i>
    </div>
    <a class="cta" href="#collection">浏览香氛 ↓</a>
  </header>

  <section id="collection" class="collection">
    <h2>四季香氛 · 四款</h2>
    <p class="sec-sub">移动鼠标，感受玻璃的折射。</p>
    <div class="grid">
      {#each products as p}
        <TiltCard {...p} />
      {/each}
    </div>
  </section>

  <section class="story">
    <div class="story-card">
      <h2>关于璃光</h2>
      <p>璃光相信，气味是光的另一种形态 —— 初雪的清、远山的稳、花信的甜、月色的暖。</p>
      <p>四款香型取自东方四季物候：春山茶、夏青竹、秋桂花、冬雪松。玻璃罐体由手工吹制，每一只的厚度与气泡都不相同，正如每一季的光。</p>
      <p class="sign">— 璃光调香室 · 杭州</p>
    </div>
  </section>

  <footer>
    <p>GLASSHOUSE 璃光 · 本页为设计演示作品，品牌与产品均为虚构</p>
  </footer>
</div>

<style>
  :global(*) { margin: 0; padding: 0; box-sizing: border-box; }
  :global(body) { font-family: "Songti SC", "Noto Serif CJK SC", Georgia, serif; }

  .page {
    min-height: 100vh;
    position: relative;
    overflow: hidden;
    color: #3d3252;
    background:
      linear-gradient(160deg, #f6f2fb 0%, #eef2f9 45%, #f9f1f4 100%);
  }

  /* 视差光斑：位置由 --mx/--my 驱动 */
  .glow {
    position: fixed;
    width: 46vmax; height: 46vmax;
    border-radius: 50%;
    filter: blur(90px);
    pointer-events: none;
    transition: transform .35s ease-out;
  }
  .g1 {
    background: radial-gradient(circle, rgba(190, 170, 235, .30), transparent 65%);
    left: calc(var(--mx) - 55%); top: calc(var(--my) - 60%);
  }
  .g2 {
    background: radial-gradient(circle, rgba(235, 190, 205, .26), transparent 65%);
    right: calc(var(--mx) - 45%); bottom: calc(var(--my) - 50%);
  }

  .hero {
    min-height: 92vh;
    display: flex; flex-direction: column;
    justify-content: center; align-items: center;
    text-align: center;
    padding: 2rem 1.5rem;
    position: relative;
  }
  .brand-en {
    letter-spacing: .6em;
    font-size: .8rem;
    color: #8d7fb0;
    text-indent: .6em;
    margin-bottom: 1.6rem;
  }
  .hero h1 {
    font-size: clamp(2.6rem, 7vw, 5.2rem);
    font-weight: 600;
    letter-spacing: .1em;
    line-height: 1.3;
  }
  .hero h1 span {
    background: linear-gradient(120deg, #a78bfa, #f0a6c0);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .hero-sub { margin-top: 1.4rem; color: #6d5f92; letter-spacing: .15em; }
  .hero-tags { display: flex; gap: .8rem; margin-top: 1.8rem; }
  .hero-tags i {
    font-style: normal;
    font-size: .75rem;
    letter-spacing: .2em;
    padding: .35rem .95rem;
    border-radius: 999px;
    color: #4a3d68;
    background: rgba(255, 255, 255, .68);
    border: 1px solid rgba(255, 255, 255, .9);
    backdrop-filter: blur(8px);
  }
  .cta {
    margin-top: 2.6rem;
    display: inline-block;
    text-decoration: none;
    color: #fff;
    letter-spacing: .3em;
    text-indent: .3em;
    font-size: .92rem;
    padding: .95rem 2.6rem;
    border-radius: 999px;
    background: linear-gradient(120deg, #a78bfa, #e88bb1);
    box-shadow: 0 18px 36px -12px rgba(150, 110, 200, .55);
    transition: transform .25s, box-shadow .25s;
  }
  .cta:hover { transform: translateY(-3px); box-shadow: 0 26px 44px -12px rgba(150, 110, 200, .7); }

  .collection {
    max-width: 1180px;
    margin: 0 auto;
    padding: 4rem 1.5rem 5rem;
    text-align: center;
    position: relative;
  }
  .collection h2 { font-size: 2rem; letter-spacing: .25em; font-weight: 600; }
  .sec-sub { color: #8d7fb0; margin-top: .6rem; letter-spacing: .2em; font-size: .88rem; }
  .grid {
    margin-top: 3rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.6rem;
  }

  .story { padding: 2rem 1.5rem 6rem; display: flex; justify-content: center; }
  .story-card {
    max-width: 640px;
    padding: 3rem 3rem 2.6rem;
    border-radius: 28px;
    background: rgba(255, 255, 255, .45);
    border: 1px solid rgba(255, 255, 255, .8);
    backdrop-filter: blur(16px);
    box-shadow: 0 24px 60px -24px rgba(90, 70, 130, .35);
  }
  .story-card h2 { letter-spacing: .3em; margin-bottom: 1.2rem; }
  .story-card p { color: #5d5078; line-height: 2; margin-top: .9rem; text-align: justify; }
  .sign { text-align: right; font-style: italic; color: #8d7fb0 !important; }

  footer {
    text-align: center;
    padding: 2rem 1rem 2.6rem;
    font-size: .78rem;
    letter-spacing: .15em;
    color: #9a8cb8;
  }
</style>
