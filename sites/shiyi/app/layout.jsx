import './globals.css'

export const metadata = {
  title: '拾遗 SHIYI · 数字博物馆',
  description: '三件文物的前世今生 —— 青铜爵、龙泉青瓷、唐琴',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
