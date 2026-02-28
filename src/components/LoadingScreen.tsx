import { useState, useEffect } from 'react'

export function LoadingScreen() {
  const [progress, setProgress] = useState(0)
  const [dots, setDots] = useState('')

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 150)

    const dotsTimer = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'))
    }, 400)

    return () => {
      clearInterval(progressTimer)
      clearInterval(dotsTimer)
    }
  }, [])

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col items-center justify-center"
      style={{
        background: 'linear-gradient(180deg, #0a0a12 0%, #1a1a2e 100%)'
      }}
    >
      {/* Animated grid background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,170,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,170,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'gridScroll 2s linear infinite'
        }}
      />

      {/* Logo */}
      <div
        className="text-2xl md:text-4xl mb-8 md:mb-12"
        style={{
          fontFamily: "'Press Start 2P', cursive",
          color: '#00ffaa',
          textShadow: '0 0 30px rgba(0,255,170,0.8), 0 0 60px rgba(0,255,170,0.4)',
          animation: 'pulse 1.5s ease-in-out infinite'
        }}
      >
        CRYPTO QUEST
      </div>

      {/* Loading bar container */}
      <div className="w-64 md:w-80 relative">
        <div
          className="h-4 md:h-6 relative overflow-hidden"
          style={{
            background: 'rgba(0,0,0,0.5)',
            border: '2px solid rgba(0,255,170,0.5)',
            clipPath: 'polygon(10px 0, 100% 0, 100% 100%, 0 100%, 0 10px)'
          }}
        >
          {/* Progress fill */}
          <div
            className="absolute inset-0 origin-left transition-transform duration-150"
            style={{
              background: 'linear-gradient(90deg, #00ffaa 0%, #00ff88 50%, #00ffaa 100%)',
              transform: `scaleX(${Math.min(progress, 100) / 100})`,
              boxShadow: 'inset 0 0 10px rgba(255,255,255,0.3)'
            }}
          />

          {/* Scanlines on progress bar */}
          <div
            className="absolute inset-0"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)'
            }}
          />
        </div>

        {/* Loading text */}
        <div
          className="mt-4 text-center text-[10px] md:text-xs tracking-widest"
          style={{
            fontFamily: "'Press Start 2P', cursive",
            color: 'rgba(0,255,170,0.7)'
          }}
        >
          LOADING{dots}
        </div>
      </div>

      {/* Insert coin prompt */}
      <div
        className="absolute bottom-12 md:bottom-16 text-[10px] md:text-xs tracking-widest"
        style={{
          fontFamily: "'Press Start 2P', cursive",
          color: 'rgba(255,255,255,0.5)',
          animation: 'blink 1s step-end infinite'
        }}
      >
        INSERT COIN
      </div>

      <style>{`
        @keyframes gridScroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(50px); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}
