// 黑洞场景：事件视界（黑球）+ 吸积盘（自定义 GLSL）+ 光子环 + 星野
import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'

/* ---------- 吸积盘着色器：极坐标螺旋噪声，亮白 → 炽橙 ---------- */
const DISC_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const DISC_FRAG = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    vec2 p = vUv - 0.5;
    float r = length(p) * 2.0;                    // 0(心) ~ 1(缘)
    float a = atan(p.y, p.x);
    // 三旋臂螺旋纹，随时间向内旋转
    float spiral = sin(a * 3.0 + pow(r, -0.6) * 6.0 - uTime * 1.6) * 0.5 + 0.5;
    float swirl  = sin(a * 7.0 - r * 22.0 + uTime * 2.2) * 0.5 + 0.5;
    // 内缘（靠近黑洞）被潮汐力撕碎发亮，外缘渐暗
    float inner = smoothstep(0.16, 0.34, r);
    float outer = smoothstep(1.02, 0.45, r);
    float glow = inner * outer;
    float energy = (spiral * 0.65 + swirl * 0.35);
    vec3 hot  = vec3(1.00, 0.92, 0.72);
    vec3 mid  = vec3(1.00, 0.55, 0.22);
    vec3 cool = vec3(0.72, 0.18, 0.06);
    vec3 col = mix(cool, mid, energy);
    col = mix(col, hot, pow(energy, 3.0) * inner);
    float alpha = glow * (0.28 + 0.72 * energy);
    gl_FragColor = vec4(col * (0.7 + 1.1 * energy), alpha);
  }
`

/* ---------- 辉光着色器：黑洞外围的柔光球 ---------- */
const GLOW_FRAG = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float rim = 1.0 - abs(dot(normalize(vNormal), normalize(vView)));
    float g = pow(rim, 3.2);
    vec3 col = mix(vec3(1.0, 0.62, 0.28), vec3(1.0, 0.9, 0.7), g);
    gl_FragColor = vec4(col * g * 1.6, g * 0.85);
  }
`
const GLOW_VERT = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = -mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`

export default function BlackHole() {
  const disc = useRef()
  const glow = useRef()
  const holePos = [0, 0.2, 0]

  const discMat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: DISC_VERT,
    fragmentShader: DISC_FRAG,
    uniforms: { uTime: { value: 0 } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  }), [])

  const glowMat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: GLOW_VERT,
    fragmentShader: GLOW_FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
  }), [])

  useFrame((_, dt) => {
    discMat.uniforms.uTime.value += dt
    if (disc.current) disc.current.rotation.z += dt * 0.12   // 盘整体缓转
  })

  return (
    <group position={holePos}>
      {/* 事件视界：纯黑球，不接收任何光 */}
      <mesh>
        <sphereGeometry args={[0.62, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* 光子环：贴近视界的亮环 */}
      <mesh rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[0.66, 0.022, 16, 128]} />
        <meshBasicMaterial color="#ffe9c4" toneMapped={false} />
      </mesh>

      {/* 柔光辉光 */}
      <mesh ref={glow} scale={1.45} material={glowMat}>
        <sphereGeometry args={[0.62, 48, 48]} />
      </mesh>

      {/* 吸积盘：略倾斜，增强纵深感 */}
      <mesh ref={disc} rotation={[-Math.PI / 2 + 0.28, 0, 0]} material={discMat}>
        <planeGeometry args={[7.5, 7.5]} />
      </mesh>

      {/* 星野背景 */}
      <Stars radius={90} depth={50} count={5200} factor={4} saturation={0} fade speed={0.6} />
    </group>
  )
}
