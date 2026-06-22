import * as React from "react"

// ── vertex shader (full-screen quad) ──────────────────────────────────────
const VERT = `
attribute vec2 a_pos;
varying   vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`

// ── scene fragment shader ─────────────────────────────────────────────────
// 도메인 워핑 + 홀로그래픽(iridescence) + 붓터치
const FRAG_SCENE = `
precision highp float;
varying vec2 v_uv;
uniform vec2  u_res;
uniform float u_time;
uniform float u_dark;
uniform vec2  u_mouse;

float hash1(vec2 p){ return fract(sin(dot(p, vec2(41.3,289.1)))*43758.5453); }
vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453);
}
float gnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(dot(hash2(i+vec2(0,0)), f-vec2(0,0)),
        dot(hash2(i+vec2(1,0)), f-vec2(1,0)), u.x),
    mix(dot(hash2(i+vec2(0,1)), f-vec2(0,1)),
        dot(hash2(i+vec2(1,1)), f-vec2(1,1)), u.x),
  u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) {
    v += a * gnoise(p);
    p  = m * p;
    a *= 0.5;
  }
  return v;
}

// IQ's cosine palette — 홀로그래픽 색 이동 (thin-film iridescence 흉내)
vec3 iridescent(float t) {
  vec3 a = vec3(0.50, 0.50, 0.55);
  vec3 b = vec3(0.50, 0.50, 0.45);
  vec3 c = vec3(1.00, 1.00, 1.00);
  vec3 d = vec3(0.00, 0.33, 0.67);
  return a + b * cos(6.28318 * (c * t + d));
}

void main() {
  vec2 frag = gl_FragCoord.xy / u_res;
  vec2 uv   = gl_FragCoord.xy / u_res * 2.8;
  float t   = u_time * 0.14;

  // 커서 영향
  float aspect = u_res.x / u_res.y;
  vec2 d  = (frag - u_mouse) * vec2(aspect, 1.0);
  float m = (u_mouse.x < 0.0) ? 0.0 : exp(-dot(d,d)*8.0);

  // 도메인 워핑
  vec2 q = vec2(
    fbm(uv + t * vec2(0.7, 0.3)),
    fbm(uv + t * vec2(0.2, 0.8))
  );
  vec2 r = vec2(
    fbm(uv + 4.0*q + t*vec2(0.4, 0.5) + vec2(1.7, 9.2)),
    fbm(uv + 4.0*q + t*vec2(0.5, 0.2) + vec2(8.3, 2.8))
  );
  r += m * 0.9 * vec2(fbm(uv*1.5 + t), fbm(uv*1.5 - t));

  float f = 0.5 + 0.5 * fbm(uv + 3.5 * r);
  f = clamp(f, 0.0, 1.0);

  // ridge + 붓 방향
  float e = 1.2 / u_res.y;
  float fx = (0.5+0.5*fbm(uv+vec2(e,0.0)+3.5*r)) - (0.5+0.5*fbm(uv-vec2(e,0.0)+3.5*r));
  float fy = (0.5+0.5*fbm(uv+vec2(0.0,e)+3.5*r)) - (0.5+0.5*fbm(uv-vec2(0.0,e)+3.5*r));
  float gLen  = length(vec2(fx,fy)) + 1e-4;
  float ridge = pow(clamp(gLen*12.0, 0.0, 1.0), 2.0);

  vec2 tangent = vec2(-fy, fx) / gLen;
  vec2 normal  = vec2( fx, fy) / gLen;
  float along  = dot(uv, tangent) * 14.0;
  float across = dot(uv, normal)  * 22.0;
  float strokeBand = 0.5 + 0.5 * sin(across + gnoise(uv*2.0)*2.0);
  float strokeSeg  = 0.5 + 0.5 * sin(along  + gnoise(uv*1.5)*2.5);
  float stroke = strokeBand * (0.65 + 0.35 * strokeSeg);
  float gap = smoothstep(0.15, 0.35, strokeBand) * smoothstep(0.85, 0.65, strokeBand);

  vec3 col;

  if (u_dark > 0.5) {
    vec3 c1 = vec3(0.035, 0.055, 0.130);
    vec3 c2 = vec3(0.075, 0.130, 0.420);
    vec3 c3 = vec3(0.035, 0.260, 0.380);
    vec3 c4 = vec3(0.120, 0.380, 0.600);
    vec3 c5 = vec3(0.280, 0.720, 0.900);

    col = mix(c1, c2, smoothstep(0.00, 0.28, f));
    col = mix(col, c3, smoothstep(0.28, 0.52, f));
    col = mix(col, c4, smoothstep(0.52, 0.76, f));
    col = mix(col, c5, smoothstep(0.76, 1.00, f) * 0.85);

    // ── 홀로그래픽: 능선·고점에 무지개 이동색 섞기 ──
    // 위상 = 위치 + 시간 + warp값 → 천천히 색이 이동
    float phase = f * 1.2 + dot(r, vec2(0.3)) + u_time*0.04 + frag.y*0.3;
    vec3 iri = iridescent(phase);
    col = mix(col, iri, ridge * 0.55);
    col += iri * pow(f, 4.0) * 0.18;

    col += ridge * 0.30 * c5;
    col += m * 0.18 * vec3(0.95, 0.85, 0.55);

    col *= 0.92 + 0.12 * stroke;
    col *= 1.0 - 0.08 * (1.0 - gap);
  } else {
    vec3 c1 = vec3(0.945, 0.965, 0.995);
    vec3 c2 = vec3(0.800, 0.898, 0.992);
    vec3 c3 = vec3(0.491, 0.827, 0.980);
    vec3 c4 = vec3(0.737, 0.894, 0.988);
    vec3 c5 = vec3(0.975, 0.990, 1.000);

    col = mix(c1, c2, smoothstep(0.00, 0.30, f));
    col = mix(col, c3, smoothstep(0.30, 0.58, f));
    col = mix(col, c4, smoothstep(0.58, 0.80, f));
    col = mix(col, c5, smoothstep(0.80, 1.00, f));

    // 라이트: 홀로그래픽은 연하게 (가독성 우선)
    float phase = f * 1.2 + dot(r, vec2(0.3)) + u_time*0.04;
    vec3 iri = iridescent(phase);
    col = mix(col, iri, ridge * 0.22);

    col -= ridge * 0.08;
    col += m * 0.08 * vec3(1.0, 0.95, 0.80);

    col *= 0.95 + 0.06 * stroke;
    col *= 1.0 - 0.04 * (1.0 - gap);
  }

  // 양자화 힌트
  vec3 posterized = floor(col * 14.0) / 14.0;
  col = mix(col, posterized, u_dark > 0.5 ? 0.18 : 0.12);

  // 미세 grain
  float g = hash1(gl_FragCoord.xy + u_time*60.0) - 0.5;
  col += g * (u_dark > 0.5 ? 0.010 : 0.006);

  gl_FragColor = vec4(col, 1.0);
}
`

// ── post shader: bloom + chromatic aberration + tonemap ───────────────────
const FRAG_POST = `
precision highp float;
varying vec2 v_uv;
uniform sampler2D u_scene;
uniform vec2  u_res;
uniform float u_dark;

// 13-tap radial bright-blur: 밝은 픽셀만 추출해서 wide halo
vec3 brightBlur(vec2 uv){
  vec3 sum = vec3(0.0);
  float total = 0.0;
  float threshold = u_dark > 0.5 ? 0.55 : 0.85;
  // 여러 반경에서 샘플
  for(int i=0; i<13; i++){
    float fi = float(i);
    float ang = fi * 2.4;                       // 황금각 근사
    float rad = (0.004 + fi * 0.003);           // 점점 멀어짐
    vec2 off = vec2(cos(ang), sin(ang)) * rad;
    // 종횡비 보정
    off.x *= u_res.y / u_res.x;
    vec3 c = texture2D(u_scene, uv + off).rgb;
    // bright-pass: threshold 초과분만
    float lum = dot(c, vec3(0.299, 0.587, 0.114));
    vec3 b = max(c - threshold, 0.0);
    float w = 1.0 / (1.0 + fi*0.5);
    sum += b * w;
    total += w;
  }
  return sum / total;
}

// ACES 근사 톤매핑 — HDR 느낌
vec3 aces(vec3 x){
  float a=2.51, b=0.03, c=2.43, d=0.59, e=0.14;
  return clamp((x*(a*x+b))/(x*(c*x+d)+e), 0.0, 1.0);
}

void main(){
  // ── 색수차: R/B 채널을 중앙에서 바깥으로 살짝 벌림 ──
  vec2 toCenter = v_uv - 0.5;
  float caAmount = u_dark > 0.5 ? 0.004 : 0.0025;
  vec2 caOff = toCenter * caAmount;

  vec3 scene;
  scene.r = texture2D(u_scene, v_uv + caOff * 1.0).r;
  scene.g = texture2D(u_scene, v_uv                 ).g;
  scene.b = texture2D(u_scene, v_uv - caOff * 1.0).b;

  // ── Bloom ──
  vec3 bloom = brightBlur(v_uv);
  float bloomAmt = u_dark > 0.5 ? 2.6 : 1.2;
  vec3 col = scene + bloom * bloomAmt;

  // ── tone map (다크 모드에서 HDR 광택) ──
  if (u_dark > 0.5) {
    col = aces(col * 1.2);
  }

  // 비네트: 가장자리 살짝 어둡게
  float vig = 1.0 - dot(toCenter, toCenter) * (u_dark > 0.5 ? 0.9 : 0.25);
  col *= clamp(vig, 0.0, 1.0);

  gl_FragColor = vec4(col, 1.0);
}
`

// ── dark mode hook ────────────────────────────────────────────────────────
function useDocumentDark(): boolean {
  const [dark, setDark] = React.useState(false)
  React.useEffect(() => {
    const read = () =>
      setDark(document.documentElement.classList.contains("dark"))
    read()
    const obs = new MutationObserver(read)
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })
    return () => obs.disconnect()
  }, [])
  return dark
}

// ── component ─────────────────────────────────────────────────────────────
const HeroShaderBackground: React.FC = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = React.useState(false)
  const dark      = useDocumentDark()
  const darkRef   = React.useRef(dark)
  React.useEffect(() => { darkRef.current = dark }, [dark])

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false })
    if (!gl) return

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s))
      return s
    }
    const link = (vs: string, fs: string) => {
      const p = gl.createProgram()!
      gl.attachShader(p, compile(gl.VERTEX_SHADER, vs))
      gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs))
      gl.linkProgram(p)
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) console.error(gl.getProgramInfoLog(p))
      return p
    }

    const progScene = link(VERT, FRAG_SCENE)
    const progPost  = link(VERT, FRAG_POST)

    // fullscreen quad (single buffer shared by both programs)
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER,
      new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW)

    const bindQuad = (prog: WebGLProgram) => {
      const loc = gl.getAttribLocation(prog, "a_pos")
      gl.enableVertexAttribArray(loc)
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    }

    // scene uniforms
    const uRes   = gl.getUniformLocation(progScene, "u_res")!
    const uTime  = gl.getUniformLocation(progScene, "u_time")!
    const uDark  = gl.getUniformLocation(progScene, "u_dark")!
    const uMouse = gl.getUniformLocation(progScene, "u_mouse")!

    // post uniforms
    const pScene   = gl.getUniformLocation(progPost, "u_scene")!
    const pRes     = gl.getUniformLocation(progPost, "u_res")!
    const pDark    = gl.getUniformLocation(progPost, "u_dark")!

    // ── offscreen FBO (scene render target) ──
    const sceneTex = gl.createTexture()!
    gl.bindTexture(gl.TEXTURE_2D, sceneTex)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    const sceneFBO = gl.createFramebuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, sceneFBO)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, sceneTex, 0)

    // 마우스
    const mouse  = { x: -1, y: -1 }
    const target = { x: -1, y: -1 }
    const onMove = (cx: number, cy: number) => {
      const rect = canvas.getBoundingClientRect()
      target.x = (cx - rect.left) / rect.width
      target.y = 1 - (cy - rect.top) / rect.height
    }
    const onLeave = () => { target.x = -1; target.y = -1 }
    const mm = (e: MouseEvent) => onMove(e.clientX, e.clientY)
    const tm = (e: TouchEvent) => { if(e.touches[0]) onMove(e.touches[0].clientX, e.touches[0].clientY) }
    window.addEventListener("mousemove", mm)
    window.addEventListener("touchmove", tm, { passive: true })
    canvas.addEventListener("mouseleave", onLeave)
    canvas.addEventListener("touchend",   onLeave)

    const dpr = Math.min(devicePixelRatio, 1.5)
    let W = 0, H = 0
    const resize = () => {
      W = Math.max(2, Math.floor(canvas.offsetWidth  * dpr))
      H = Math.max(2, Math.floor(canvas.offsetHeight * dpr))
      canvas.width = W; canvas.height = H
      // 씬 텍스처 크기 = 화면 크기
      gl.bindTexture(gl.TEXTURE_2D, sceneTex)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, W, H, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
    }
    resize()
    window.addEventListener("resize", resize)

    const start = performance.now()
    let rafId = 0
    let firstFrameDrawn = false

    const draw = () => {
      // 마우스 lerp
      if (target.x < 0) { mouse.x = -1; mouse.y = -1 }
      else if (mouse.x < 0) { mouse.x = target.x; mouse.y = target.y }
      else {
        mouse.x += (target.x - mouse.x) * 0.08
        mouse.y += (target.y - mouse.y) * 0.08
      }

      const darkVal = darkRef.current ? 1.0 : 0.0

      // ── Pass 1: scene → FBO ──
      gl.bindFramebuffer(gl.FRAMEBUFFER, sceneFBO)
      gl.viewport(0, 0, W, H)
      gl.useProgram(progScene)
      bindQuad(progScene)
      gl.uniform2f(uRes,  W, H)
      gl.uniform1f(uTime, (performance.now() - start) / 1000)
      gl.uniform1f(uDark, darkVal)
      gl.uniform2f(uMouse, mouse.x, mouse.y)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

      // ── Pass 2: post → screen ──
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      gl.viewport(0, 0, W, H)
      gl.useProgram(progPost)
      bindQuad(progPost)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, sceneTex)
      gl.uniform1i(pScene, 0)
      gl.uniform2f(pRes, W, H)
      gl.uniform1f(pDark, darkVal)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

      if (!firstFrameDrawn) {
        firstFrameDrawn = true
        setReady(true)
      }

      rafId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", mm)
      window.removeEventListener("touchmove", tm)
      canvas.removeEventListener("mouseleave", onLeave)
      canvas.removeEventListener("touchend",   onLeave)
      gl.deleteProgram(progScene)
      gl.deleteProgram(progPost)
      gl.deleteFramebuffer(sceneFBO)
      gl.deleteTexture(sceneTex)
      gl.deleteBuffer(buf)
    }
  }, [])

  const fallbackBackground = dark
    ? "radial-gradient(circle at 25% 20%, rgba(71, 184, 230, 0.32), transparent 34%), radial-gradient(circle at 75% 28%, rgba(99, 102, 241, 0.28), transparent 32%), linear-gradient(135deg, #091122 0%, #10245a 48%, #063b54 100%)"
    : "radial-gradient(circle at 24% 18%, rgba(125, 211, 250, 0.42), transparent 34%), radial-gradient(circle at 76% 24%, rgba(191, 219, 254, 0.48), transparent 34%), linear-gradient(135deg, #f8fbff 0%, #dceeff 52%, #bfe8fb 100%)"

  return (
    <div
      className="absolute inset-0 -z-10 overflow-hidden"
      aria-hidden
      style={{ background: fallbackBackground }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          opacity: ready ? 1 : 0,
          transition: "opacity 220ms ease",
        }}
      />
    </div>
  )
}

export default HeroShaderBackground
