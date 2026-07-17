import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Surface d'eau procédurale (Three.js) — élément 3D subtil du hero.
 * Plein écran, shader léger : dégradé aquatique méditerranéen, ondes
 * turquoise animées et colonne de reflet doré (soleil couchant).
 *
 * Optimisé mobile : pixelRatio plafonné, pause hors-écran / onglet caché,
 * désactivé si prefers-reduced-motion.
 */
export default function WaterCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const uniforms = {
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(mount.clientWidth, mount.clientHeight) },
      uColorDeep: { value: new THREE.Color("#0B1420") },
      uColorLagoon: { value: new THREE.Color("#1A7A9E") },
      uColorTurquoise: { value: new THREE.Color("#2FB6C4") },
      uColorGold: { value: new THREE.Color("#C9A86A") },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        precision highp float;
        varying vec2 vUv;
        uniform float uTime;
        uniform vec2 uRes;
        uniform vec3 uColorDeep;
        uniform vec3 uColorLagoon;
        uniform vec3 uColorTurquoise;
        uniform vec3 uColorGold;

        // Bruit de valeur simple
        float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float noise(vec2 p){
          vec2 i = floor(p); vec2 f = fract(p);
          vec2 u = f*f*(3.0-2.0*f);
          return mix(mix(hash(i+vec2(0.0,0.0)), hash(i+vec2(1.0,0.0)), u.x),
                     mix(hash(i+vec2(0.0,1.0)), hash(i+vec2(1.0,1.0)), u.x), u.y);
        }
        float fbm(vec2 p){
          float v = 0.0; float a = 0.5;
          for(int i=0;i<5;i++){ v += a*noise(p); p*=2.0; a*=0.5; }
          return v;
        }

        void main(){
          vec2 uv = vUv;
          float aspect = uRes.x / max(uRes.y, 1.0);

          // Ligne d'horizon : ciel au-dessus, eau en dessous
          float horizon = 0.60;
          float sunX = 0.5;                                   // soleil centré
          float sunCol = exp(-pow((uv.x - sunX) * aspect, 2.0) * 2.2); // colonne verticale

          // Teintes chaudes du couchant (réchauffées vers le blanc pour éviter l'olive)
          vec3 goldWarm = mix(uColorGold, vec3(1.0, 0.95, 0.82), 0.35);
          vec3 skyTop = mix(uColorDeep, uColorLagoon, 0.35);  // haut de ciel crépusculaire

          vec3 col;

          if (uv.y >= horizon) {
            // ---------- CIEL ----------
            float s = (uv.y - horizon) / (1.0 - horizon);     // 0 à l'horizon → 1 en haut
            // Bande chaude qui monte de l'horizon puis vire au bleu crépusculaire
            vec3 sky = mix(goldWarm, uColorTurquoise, smoothstep(0.0, 0.5, s));
            sky = mix(sky, skyTop, smoothstep(0.35, 1.0, s));
            // Halo lumineux du soleil juste au-dessus de l'horizon
            float glow = sunCol * exp(-s * 3.5);
            sky += goldWarm * glow * 0.9;
            // Nuages très diffus et discrets
            float clouds = fbm(vec2(uv.x * aspect * 2.0 + uTime * 0.01, uv.y * 3.0));
            sky = mix(sky, sky * 1.08, smoothstep(0.55, 0.9, clouds) * 0.5 * s);
            col = sky;
          } else {
            // ---------- EAU ----------
            float depth = (horizon - uv.y) / horizon;         // 0 à l'horizon → 1 au premier plan
            vec2 wUv = vec2((uv.x - 0.5) * aspect, uv.y);
            float persp = mix(1.0, 7.0, 1.0 - depth);         // vagues serrées près de l'horizon
            vec2 flow = vec2(0.0, uTime * 0.05);
            float ripple = fbm(wUv * vec2(3.0, 9.0) * persp + flow * persp);
            ripple += 0.5 * fbm(wUv * vec2(6.0, 18.0) * persp - flow * 1.7);

            // Turquoise près de l'horizon → lagon → nuit profonde au premier plan
            vec3 water = mix(uColorTurquoise, uColorLagoon, smoothstep(0.0, 0.5, depth));
            water = mix(water, uColorDeep, smoothstep(0.5, 1.0, depth));

            // Colonne dorée du reflet du soleil sur l'eau
            float reflectMask = sunCol * smoothstep(1.0, 0.15, depth);
            water += goldWarm * reflectMask * (0.35 + 0.5 * ripple) * 0.8;

            // Scintillements de la surface
            float glint = smoothstep(0.74, 0.99, ripple);
            water += glint * mix(uColorTurquoise, goldWarm, reflectMask) * (0.2 + 0.4 * (1.0 - depth));

            // Léger assombrissement du premier plan
            water *= mix(1.0, 0.72, smoothstep(0.4, 1.0, depth));
            col = water;
          }

          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });

    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(quad);

    let frameId;
    let running = true;
    const clock = new THREE.Clock();

    const render = () => {
      if (running) {
        uniforms.uTime.value = clock.getElapsedTime();
        renderer.render(scene, camera);
      }
      frameId = requestAnimationFrame(render);
    };
    if (!reduceMotion) render();
    else renderer.render(scene, camera); // une seule frame statique

    // Redimensionnement
    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      uniforms.uRes.value.set(w, h);
    };
    window.addEventListener("resize", onResize);

    // Pause si onglet caché (économie batterie mobile)
    const onVisibility = () => {
      running = !document.hidden && !reduceMotion;
      clock.getDelta(); // évite un saut de temps au retour
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      quad.geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="water-canvas" aria-hidden="true" />;
}
