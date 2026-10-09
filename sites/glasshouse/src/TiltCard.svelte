<!-- 3D 倾斜玻璃卡：鼠标位置驱动 rotateX/rotateY，附随动光泽 -->
<script>
  export let name
  export let en
  export let notes
  export let price
  export let no
  export let tint

  let rx = 0, ry = 0, gx = 50, gy = 50

  function onMove(e) {
    const r = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width   // 0~1
    const py = (e.clientY - r.top) / r.height
    ry = (px - 0.5) * 22
    rx = (0.5 - py) * 18
    gx = px * 100
    gy = py * 100
  }
  function onLeave() { rx = 0; ry = 0; gx = 50; gy = 50 }
</script>

<div
  class="card"
  style="--tint:{tint}; transform: perspective(900px) rotateX({rx}deg) rotateY({ry}deg);"
  role="img"
  aria-label="{name}"
  on:mousemove={onMove}
  on:mouseleave={onLeave}
>
  <div class="glare" style="background: radial-gradient(circle at {gx}% {gy}%, rgba(255,255,255,.55), transparent 55%);"></div>
  <span class="no">{no}</span>
  <div class="bottle">
    <div class="cap"></div>
    <div class="body"></div>
  </div>
  <h3>{name}<small>{en}</small></h3>
  <p class="notes">{notes}</p>
  <p class="price">{price}</p>
</div>

<style>
  .card {
    position: relative;
    border-radius: 24px;
    padding: 2rem 1.6rem 1.8rem;
    min-height: 340px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(150deg, color-mix(in srgb, var(--tint) 38%, #ffffff 62%) 0%, rgba(255, 255, 255, .55) 100%);
    border: 1px solid rgba(255, 255, 255, .75);
    box-shadow: 0 24px 48px -18px rgba(90, 70, 130, .35), inset 0 1px 0 rgba(255,255,255,.9);
    backdrop-filter: blur(18px);
    transition: transform .18s ease-out, box-shadow .3s;
    cursor: default;
    overflow: hidden;
    will-change: transform;
  }
  .card:hover {
    box-shadow: 0 40px 72px -20px rgba(90, 70, 130, .5), inset 0 1px 0 rgba(255,255,255,.9);
  }
  .glare {
    position: absolute; inset: 0;
    pointer-events: none;
    opacity: .9;
    transition: opacity .3s;
  }
  .no {
    position: absolute; top: 1rem; right: 1.3rem;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 2.6rem;
    color: rgba(255, 255, 255, .85);
    text-shadow: 0 2px 10px rgba(90, 70, 130, .35);
  }
  /* 香氛瓶：纯 CSS 画一个玻璃瓶 */
  .bottle { margin-top: 1.6rem; height: 120px; display: flex; flex-direction: column; align-items: center; }
  .cap {
    width: 26px; height: 20px; border-radius: 6px 6px 2px 2px;
    background: linear-gradient(#e9e2f5, #b9a8d8);
  }
  .body {
    width: 64px; height: 96px; border-radius: 14px 14px 18px 18px;
    background: linear-gradient(160deg, var(--tint) 0%, color-mix(in srgb, var(--tint) 60%, #ffffff) 100%);
    border: 1px solid rgba(255,255,255,.8);
    box-shadow: inset 6px 0 12px rgba(255,255,255,.65), inset -8px 0 14px rgba(120, 90, 160, .28), 0 10px 24px -8px rgba(90,70,130,.4);
  }
  h3 {
    margin-top: 1.3rem;
    font-family: Georgia, "Songti SC", "SimSun", serif;
    font-size: 1.35rem;
    letter-spacing: .18em;
    color: #3d3252;
    text-align: center;
  }
  h3 small {
    display: block;
    font-size: .68rem;
    letter-spacing: .42em;
    color: #8d7fb0;
    margin-top: .3rem;
    font-family: "Avenir Next", "Helvetica Neue", sans-serif;
  }
  .notes {
    margin-top: .8rem;
    font-size: .82rem;
    color: #6d5f92;
    letter-spacing: .12em;
    text-align: center;
  }
  .price {
    margin-top: auto;
    padding-top: 1rem;
    font-family: Georgia, serif;
    font-size: 1.05rem;
    color: #3d3252;
    letter-spacing: .08em;
  }
</style>
