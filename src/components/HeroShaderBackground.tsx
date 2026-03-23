import * as React from "react"
import { ShaderGradientCanvas, ShaderGradient, presets } from "@shadergradient/react"

function useDocumentDark(): boolean {
  const [dark, setDark] = React.useState(false)

  React.useEffect(() => {
    const read = () => setDark(document.documentElement.classList.contains("dark"))
    read()
    const obs = new MutationObserver(read)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => obs.disconnect()
  }, [])

  return dark
}

/**
 * 히어로: 라이트/다크 모두 nightyNight와 동일한 질감(그레인·waterPlane·밀도·회전).
 * 다크는 프리셋 그대로, 라이트는 색만 밝은 톤으로 덮어씀.
 */
const HeroShaderBackground: React.FC = () => {
  const [mounted, setMounted] = React.useState(false)
  const dark = useDocumentDark()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const gradientProps = React.useMemo(() => {
    const base = presets.nightyNight.props
    if (dark) {
      return {
        ...base,
        brightness: 0.95,
      }
    }
    return {
      ...base,
      color1: "#e2e8f0",
      color2: "#f1f5f9",
      color3: "#dbeafe",
      brightness: 1.1,
    }
  }, [dark])

  if (!mounted) {
    return (
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-br from-white via-sky-50 to-slate-50 dark:from-slate-800 dark:to-indigo-950"
        aria-hidden
      />
    )
  }

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      <ShaderGradientCanvas
        className="!absolute inset-0 h-full w-full"
        style={{ width: "100%", height: "100%" }}
        pointerEvents="none"
        lazyLoad={false}
        fov={45}
      >
        <ShaderGradient control="props" {...gradientProps} />
      </ShaderGradientCanvas>
    </div>
  )
}

export default HeroShaderBackground
