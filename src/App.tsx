import { Canvas } from '@react-three/fiber'
import { Suspense, useState } from 'react'
import { GameScene } from './components/GameScene'
import { HUD } from './components/HUD'
import { LoadingScreen } from './components/LoadingScreen'

export default function App() {
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(1)
  const [coinsCollected, setCoinsCollected] = useState(0)

  const handleCoinCollect = () => {
    setScore(prev => prev + 100 * combo)
    setCoinsCollected(prev => prev + 1)
    setCombo(prev => Math.min(prev + 1, 10))
  }

  const resetCombo = () => {
    setCombo(1)
  }

  return (
    <div className="w-screen h-screen bg-black overflow-hidden relative">
      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)',
          mixBlendMode: 'overlay'
        }}
      />

      {/* CRT vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, transparent 60%, rgba(0,0,0,0.8) 100%)',
        }}
      />

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 3, 12], fov: 60 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#0a0a12' }}
      >
        <Suspense fallback={null}>
          <GameScene
            onCoinCollect={handleCoinCollect}
            onMiss={resetCombo}
          />
        </Suspense>
      </Canvas>

      {/* Loading Screen */}
      <Suspense fallback={<LoadingScreen />}>
        <HUD score={score} combo={combo} coinsCollected={coinsCollected} />
      </Suspense>

      {/* Footer */}
      <footer className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 z-30">
        <p
          className="text-[10px] md:text-xs tracking-widest uppercase"
          style={{
            color: 'rgba(0, 255, 170, 0.4)',
            fontFamily: "'Press Start 2P', cursive",
            textShadow: '0 0 10px rgba(0, 255, 170, 0.3)'
          }}
        >
          Requested by @brandonn2221 · Built by @clonkbot
        </p>
      </footer>
    </div>
  )
}
