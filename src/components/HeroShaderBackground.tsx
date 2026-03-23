import * as React from "react"
import {
  ShaderGradientCanvas,
  ShaderGradient,
  presets,
  type GradientT,
} from "@shadergradient/react"

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
 * 히어로: nightyNight waterPlane 베이스. 라이트는 밝은 톤.
 * uDensity/uStrength를 프리셋(1.5)보다 살짝 낮춰 노이즈만 부드럽게.
 */
const HeroShaderBackground: React.FC = () => {
  const [mounted, setMounted] = React.useState(false)
  const dark = useDocumentDark()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const gradientProps = React.useMemo((): GradientT => {
    const base = presets.nightyNight.props
    /** 프리셋보다 살짝 느리게 (기본 uSpeed ~0.3) */
    const slow = { uSpeed: 0.16 }
    /** waterPlane 노이즈 살짝만 연하게 (기본 uDensity·uStrength 1.5) */
    const softerNoise = { uDensity: 1.3, uStrength: 1.3, reflection: 0.08 }
    if (dark) {
      return {
        ...base,
        ...slow,
        ...softerNoise,
        brightness: 0.95,
      } as GradientT
    }
    return {
      ...base,
      ...slow,
      ...softerNoise,
      color1: "#e2e8f0",
      color2: "#f1f5f9",
      color3: "#dbeafe",
      brightness: 1.1,
    } as GradientT
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
