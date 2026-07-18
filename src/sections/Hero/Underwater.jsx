import { useEffect, useRef } from "react";
import {
  Scene,
  OrthographicCamera,
  WebGLRenderer,
  ShaderMaterial,
  Color,
  Vector2,
  Mesh,
  PlaneGeometry,
  Clock,
} from "three";
import "./Underwater.css";

/**
 * Scène SOUS-MARINE (Act 4 du plongeon).
 * - Shader Three.js : dégradé de profondeur bleu-turquoise, caustiques
 *   animées (lumière filtrée par la surface) et rais de lumière (god rays).
 * - Bulles remontantes en overlay CSS (léger, GPU).
 *
 * Optimisé : pixelRatio plafonné, pause onglet caché, moins de bulles sur mobile.
 */
export default function Underwater() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new Scene();
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new WebGLRenderer({ antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const uniforms = {
      uTime: { value: 0 },
      uRes: { value: new Vector2(mount.clientWidth, mount.clientHeight) },
      uDeep: { value: new Color("#05121d") },
      uMid: { value: new Color("#0d3a52") },
      uLight: { value: new Color("#2FB6C4") },
    };

    const material = new ShaderMaterial({
      uniforms,
      transparent: true,
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main(){ vUv = uv; gl_Position = vec4(position, 1.0); }
      `,
      fragmentShader: /* glsl */ `
        precision highp float;
        varying vec2 vUv;
        uniform float uTime;
        uniform vec2 uRes;
        uniform vec3 uDeep;
        uniform vec3 uMid;
        uniform vec3 uLight;

        float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
        float noise(vec2 p){
          vec2 i=floor(p), f=fract(p);
          vec2 u=f*f*(3.0-2.0*f);
          return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),
                     mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);
        }
        float fbm(vec2 p){ float v=0.,a=.5; for(int i=0;i<5;i++){v+=a*noise(p);p*=2.02;a*=.5;} return v; }

        // Caustiques : cellules lumineuses mouvantes
        float caustics(vec2 uv, float t){
          vec2 p = uv * 3.5;
          float c = 0.0;
          for(int i=0;i<3;i++){
            float fi = float(i);
            vec2 q = p + vec2(fbm(p+ t*0.15 + fi), fbm(p - t*0.12 - fi));
            float d = abs(sin(q.x*1.7 + t*0.6) * sin(q.y*1.7 - t*0.5));
            c += smoothstep(0.82, 1.0, 1.0 - d);
            p *= 1.4;
          }
          return c;
        }

        void main(){
          vec2 uv = vUv;
          float aspect = uRes.x/max(uRes.y,1.0);
          vec2 auv = vec2((uv.x-0.5)*aspect+0.5, uv.y);

          // Profondeur : plus clair vers le haut (surface), très sombre en bas
          vec3 col = mix(uDeep, uMid, smoothstep(0.0, 0.85, uv.y));
          col = mix(col, uLight, smoothstep(0.55, 1.0, uv.y) * 0.5);

          // Rais de lumière descendants (god rays), plus forts en haut
          float rays = 0.0;
          for(int i=0;i<3;i++){
            float fi=float(i);
            float x = 0.25 + 0.25*fi;
            float w = 0.10 + 0.03*fi;
            float streak = smoothstep(w, 0.0, abs(auv.x - (x + 0.05*sin(uTime*0.2+fi))));
            rays += streak;
          }
          rays *= smoothstep(0.0, 0.9, uv.y);
          col += uLight * rays * 0.12;

          // Caustiques, surtout dans la moitié haute
          float ca = caustics(auv, uTime);
          col += uLight * ca * (0.18 + 0.35*uv.y);

          // Assombrissement des bords (vignette douce)
          float vig = smoothstep(1.2, 0.3, distance(uv, vec2(0.5)));
          col *= mix(0.7, 1.0, vig);

          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });

    const quad = new Mesh(new PlaneGeometry(2, 2), material);
    scene.add(quad);

    let frameId, running = true;
    const clock = new Clock();
    const render = () => {
      if (running) { uniforms.uTime.value = clock.getElapsedTime(); renderer.render(scene, camera); }
      frameId = requestAnimationFrame(render);
    };
    if (!reduceMotion) render(); else renderer.render(scene, camera);

    const onResize = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      renderer.setSize(w, h); uniforms.uRes.value.set(w, h);
    };
    window.addEventListener("resize", onResize);
    const onVis = () => { running = !document.hidden && !reduceMotion; clock.getDelta(); };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
      quad.geometry.dispose(); material.dispose(); renderer.dispose();
      if (renderer.domElement.parentNode) mount.removeChild(renderer.domElement);
    };
  }, []);

  // Bulles (moins nombreuses sur mobile)
  const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 760px)").matches;
  const count = isMobile ? 14 : 26;
  const bubbles = Array.from({ length: count }, (_, i) => {
    const size = 3 + Math.random() * 12;
    return {
      key: i,
      left: `${Math.random() * 100}%`,
      size,
      duration: 6 + Math.random() * 9,
      delay: -Math.random() * 12,
      drift: `${(Math.random() * 2 - 1) * 40}px`,
      opacity: 0.12 + Math.random() * 0.32,
    };
  });

  return (
    <div className="underwater" aria-hidden="true">
      <div ref={mountRef} className="underwater__canvas" />
      <div className="underwater__bubbles">
        {bubbles.map((b) => (
          <span
            key={b.key}
            className="bubble"
            style={{
              left: b.left,
              width: `${b.size}px`,
              height: `${b.size}px`,
              opacity: b.opacity,
              "--dur": `${b.duration}s`,
              "--delay": `${b.delay}s`,
              "--drift": b.drift,
            }}
          />
        ))}
      </div>
    </div>
  );
}
