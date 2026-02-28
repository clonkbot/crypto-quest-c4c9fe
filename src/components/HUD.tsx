import { useEffect, useState } from 'react'

interface HUDProps {
  score: number
  combo: number
  coinsCollected: number
}

function AnimatedNumber({ value, prefix = '' }: { value: number; prefix?: string }) {
  const [displayValue, setDisplayValue] = useState(value)

  useEffect(() => {
    if (displayValue === value) return

    const diff = value - displayValue
    const step = Math.ceil(Math.abs(diff) / 10)
    const timer = setInterval(() => {
      setDisplayValue(prev => {
        const next = prev + (diff > 0 ? step : -step)
        if ((diff > 0 && next >= value) || (diff < 0 && next <= value)) {
          clearInterval(timer)
          return value
        }
        return next
      })
    }, 30)

    return () => clearInterval(timer)
  }, [value, displayValue])

  return (
    <span className="tabular-nums">
      {prefix}
      {displayValue.toLocaleString().padStart(8, '0')}
    </span>
  )
}

export function HUD({ score, combo, coinsCollected }: HUDProps) {
  const [showComboFlash, setShowComboFlash] = useState(false)

  useEffect(() => {
    if (combo > 1) {
      setShowComboFlash(true)
      const timer = setTimeout(() => setShowComboFlash(false), 200)
      return () => clearTimeout(timer)
    }
  }, [combo])

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Top HUD Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* Score */}
          <div
            className="relative px-4 py-2 md:px-6 md:py-3"
            style={{
              background: 'linear-gradient(135deg, rgba(0,255,170,0.1) 0%, rgba(0,0,0,0.8) 100%)',
              border: '2px solid rgba(0,255,170,0.5)',
              clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'
            }}
          >
            <div
              className="text-[10px] md:text-xs tracking-[0.3em] mb-1"
              style={{
                color: 'rgba(0,255,170,0.6)',
                fontFamily: "'Press Start 2P', cursive"
              }}
            >
              SCORE
            </div>
            <div
              className="text-lg md:text-2xl"
              style={{
                color: '#00ffaa',
                fontFamily: "'Press Start 2P', cursive",
                textShadow: '0 0 20px rgba(0,255,170,0.8), 0 0 40px rgba(0,255,170,0.4)'
              }}
            >
              <AnimatedNumber value={score} />
            </div>

            {/* Corner accents */}
            <div
              className="absolute top-0 left-0 w-3 h-3 md:w-4 md:h-4"
              style={{
                borderTop: '2px solid #00ffaa',
                borderLeft: '2px solid #00ffaa'
              }}
            />
            <div
              className="absolute bottom-0 right-0 w-3 h-3 md:w-4 md:h-4"
              style={{
                borderBottom: '2px solid #00ffaa',
                borderRight: '2px solid #00ffaa'
              }}
            />
          </div>

          {/* Combo */}
          <div
            className={`relative px-4 py-2 md:px-6 md:py-3 transition-transform duration-100 ${
              showComboFlash ? 'scale-110' : 'scale-100'
            }`}
            style={{
              background: combo > 1
                ? 'linear-gradient(135deg, rgba(255,170,0,0.2) 0%, rgba(0,0,0,0.8) 100%)'
                : 'linear-gradient(135deg, rgba(100,100,100,0.1) 0%, rgba(0,0,0,0.8) 100%)',
              border: `2px solid ${combo > 1 ? 'rgba(255,170,0,0.7)' : 'rgba(100,100,100,0.3)'}`,
              clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)'
            }}
          >
            <div
              className="text-[10px] md:text-xs tracking-[0.3em] mb-1"
              style={{
                color: combo > 1 ? 'rgba(255,170,0,0.8)' : 'rgba(100,100,100,0.6)',
                fontFamily: "'Press Start 2P', cursive"
              }}
            >
              COMBO
            </div>
            <div
              className="text-lg md:text-2xl"
              style={{
                color: combo > 1 ? '#ffaa00' : '#666666',
                fontFamily: "'Press Start 2P', cursive",
                textShadow: combo > 1
                  ? '0 0 20px rgba(255,170,0,0.8), 0 0 40px rgba(255,170,0,0.4)'
                  : 'none'
              }}
            >
              x{combo}
            </div>
          </div>
        </div>
      </div>

      {/* Coins collected - Bottom left */}
      <div className="absolute bottom-16 md:bottom-20 left-4 md:left-6">
        <div
          className="flex items-center gap-2 md:gap-3 px-3 py-2 md:px-4 md:py-2"
          style={{
            background: 'rgba(0,0,0,0.7)',
            border: '1px solid rgba(255,215,0,0.4)',
            borderRadius: '4px'
          }}
        >
          {/* Coin icon */}
          <div
            className="w-5 h-5 md:w-6 md:h-6 rounded-full"
            style={{
              background: 'linear-gradient(135deg, #ffd700 0%, #cc8800 100%)',
              boxShadow: '0 0 10px rgba(255,215,0,0.5)'
            }}
          />
          <span
            className="text-sm md:text-base"
            style={{
              color: '#ffd700',
              fontFamily: "'Press Start 2P', cursive",
              textShadow: '0 0 10px rgba(255,215,0,0.5)'
            }}
          >
            {coinsCollected}
          </span>
        </div>
      </div>

      {/* Instructions - Bottom right */}
      <div className="absolute bottom-16 md:bottom-20 right-4 md:right-6">
        <div
          className="text-right text-[8px] md:text-[10px] leading-relaxed"
          style={{
            color: 'rgba(0,255,170,0.5)',
            fontFamily: "'Press Start 2P', cursive"
          }}
        >
          <div className="hidden md:block">CLICK COINS TO COLLECT</div>
          <div className="hidden md:block">DRAG TO ROTATE VIEW</div>
          <div className="md:hidden">TAP COINS</div>
          <div className="md:hidden">SWIPE TO ROTATE</div>
        </div>
      </div>

      {/* Side decorations */}
      <div className="hidden md:block absolute top-1/2 left-4 -translate-y-1/2">
        <div
          className="w-1 h-32"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, #00ffaa 50%, transparent 100%)',
            opacity: 0.3
          }}
        />
      </div>
      <div className="hidden md:block absolute top-1/2 right-4 -translate-y-1/2">
        <div
          className="w-1 h-32"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, #ff00aa 50%, transparent 100%)',
            opacity: 0.3
          }}
        />
      </div>
    </div>
  )
}
