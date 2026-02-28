import { useRef, useMemo, useState, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Stars, Float, Text } from '@react-three/drei'
import * as THREE from 'three'

interface CoinData {
  id: number
  position: [number, number, number]
  collected: boolean
  speed: number
  rotationSpeed: number
}

interface GameSceneProps {
  onCoinCollect: () => void
  onMiss: () => void
}

function GoldenCoin({
  position,
  onCollect,
  collected,
  speed,
  rotationSpeed
}: {
  position: [number, number, number]
  onCollect: () => void
  collected: boolean
  speed: number
  rotationSpeed: number
}) {
  const meshRef = useRef<THREE.Group>(null!)
  const [hovered, setHovered] = useState(false)
  const [animateOut, setAnimateOut] = useState(false)
  const scaleRef = useRef(1)

  useFrame((state, delta) => {
    if (!meshRef.current) return

    // Rotation
    meshRef.current.rotation.y += delta * rotationSpeed

    // Floating motion
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed + position[0]) * 0.3

    // Collect animation
    if (animateOut) {
      scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, 0, delta * 8)
      meshRef.current.scale.setScalar(scaleRef.current)
      meshRef.current.position.y += delta * 5
    } else if (hovered) {
      scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, 1.3, delta * 10)
      meshRef.current.scale.setScalar(scaleRef.current)
    } else {
      scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, 1, delta * 5)
      meshRef.current.scale.setScalar(scaleRef.current)
    }
  })

  const handleClick = useCallback(() => {
    if (collected || animateOut) return
    setAnimateOut(true)
    onCollect()
  }, [collected, animateOut, onCollect])

  if (collected && scaleRef.current < 0.05) return null

  return (
    <group
      ref={meshRef}
      position={position}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Main coin body */}
      <mesh castShadow>
        <cylinderGeometry args={[0.8, 0.8, 0.15, 32]} />
        <meshStandardMaterial
          color={hovered ? '#ffee00' : '#ffd700'}
          metalness={0.9}
          roughness={0.1}
          emissive={hovered ? '#ff8800' : '#cc8800'}
          emissiveIntensity={hovered ? 0.8 : 0.3}
        />
      </mesh>

      {/* Coin edge detail */}
      <mesh>
        <torusGeometry args={[0.75, 0.08, 8, 32]} />
        <meshStandardMaterial
          color="#ffcc00"
          metalness={0.95}
          roughness={0.05}
        />
      </mesh>

      {/* Bitcoin symbol - front */}
      <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.2, 0.35, 32]} />
        <meshStandardMaterial
          color="#cc8800"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Glow effect */}
      <pointLight
        color={hovered ? '#ffee00' : '#ffd700'}
        intensity={hovered ? 2 : 0.5}
        distance={3}
      />
    </group>
  )
}

function CryptoText3D() {
  const textRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (!textRef.current) return
    textRef.current.position.y = 5 + Math.sin(state.clock.elapsedTime * 0.5) * 0.2
  })

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <Text
        ref={textRef}
        position={[0, 5, -5]}
        fontSize={2}
        color="#00ffaa"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/pressstart2p/v15/e3t4euO8T-267oIAQAu6jDQyK3nVivM.woff"
        outlineWidth={0.05}
        outlineColor="#003322"
      >
        CRYPTO QUEST
      </Text>
    </Float>
  )
}

function NeonGrid() {
  const gridRef = useRef<THREE.GridHelper>(null!)

  useFrame((state) => {
    if (!gridRef.current) return
    // Scroll effect
    const material = gridRef.current.material as THREE.LineBasicMaterial
    if (material.opacity !== undefined) {
      material.opacity = 0.3 + Math.sin(state.clock.elapsedTime) * 0.1
    }
  })

  return (
    <>
      <gridHelper
        ref={gridRef}
        args={[50, 50, '#00ffaa', '#004433']}
        position={[0, -2, 0]}
      />
      {/* Fog floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.01, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshBasicMaterial
          color="#0a0a12"
          transparent
          opacity={0.9}
        />
      </mesh>
    </>
  )
}

function ArcadePlatform() {
  return (
    <group position={[0, -1.5, 0]}>
      {/* Main platform */}
      <mesh receiveShadow>
        <boxGeometry args={[12, 0.5, 12]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Neon edge lights */}
      {[[-6, 0], [6, 0], [0, -6], [0, 6]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0, z]}>
          <boxGeometry args={[x === 0 ? 12 : 0.1, 0.6, z === 0 ? 12 : 0.1]} />
          <meshStandardMaterial
            color="#00ffaa"
            emissive="#00ffaa"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}

      {/* Corner pillars */}
      {[[-5.5, -5.5], [5.5, -5.5], [-5.5, 5.5], [5.5, 5.5]].map(([x, z], i) => (
        <mesh key={i} position={[x, 1, z]}>
          <boxGeometry args={[0.5, 3, 0.5]} />
          <meshStandardMaterial
            color="#2a2a4e"
            metalness={0.5}
            roughness={0.5}
          />
        </mesh>
      ))}
    </group>
  )
}

function FloatingCrystals() {
  const crystalsRef = useRef<THREE.Group>(null!)

  useFrame((state) => {
    if (!crystalsRef.current) return
    crystalsRef.current.rotation.y = state.clock.elapsedTime * 0.1
  })

  const crystals = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      angle: (i / 8) * Math.PI * 2,
      radius: 8,
      height: 2 + Math.random() * 2,
      color: ['#ff00aa', '#00aaff', '#ffaa00', '#aa00ff'][i % 4]
    }))
  }, [])

  return (
    <group ref={crystalsRef}>
      {crystals.map((crystal, i) => (
        <Float key={i} speed={1 + i * 0.2} rotationIntensity={0.5}>
          <mesh
            position={[
              Math.cos(crystal.angle) * crystal.radius,
              crystal.height,
              Math.sin(crystal.angle) * crystal.radius
            ]}
          >
            <octahedronGeometry args={[0.5, 0]} />
            <meshStandardMaterial
              color={crystal.color}
              emissive={crystal.color}
              emissiveIntensity={0.5}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          <pointLight
            position={[
              Math.cos(crystal.angle) * crystal.radius,
              crystal.height,
              Math.sin(crystal.angle) * crystal.radius
            ]}
            color={crystal.color}
            intensity={0.5}
            distance={5}
          />
        </Float>
      ))}
    </group>
  )
}

export function GameScene({ onCoinCollect, onMiss }: GameSceneProps) {
  const { camera } = useThree()
  const [coins, setCoins] = useState<CoinData[]>(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 8,
        1 + Math.random() * 2,
        (Math.random() - 0.5) * 8
      ] as [number, number, number],
      collected: false,
      speed: 1 + Math.random() * 2,
      rotationSpeed: 2 + Math.random() * 3
    }))
  )

  const handleCoinCollect = useCallback((id: number) => {
    setCoins(prev =>
      prev.map(coin =>
        coin.id === id ? { ...coin, collected: true } : coin
      )
    )
    onCoinCollect()

    // Respawn coin after delay
    setTimeout(() => {
      setCoins(prev =>
        prev.map(coin =>
          coin.id === id
            ? {
                ...coin,
                collected: false,
                position: [
                  (Math.random() - 0.5) * 8,
                  1 + Math.random() * 2,
                  (Math.random() - 0.5) * 8
                ] as [number, number, number]
              }
            : coin
        )
      )
    }, 2000)
  }, [onCoinCollect])

  return (
    <>
      {/* Background */}
      <color attach="background" args={['#0a0a12']} />
      <fog attach="fog" args={['#0a0a12', 15, 35]} />

      {/* Stars */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.5}
        color="#ffffff"
        castShadow
      />
      <pointLight position={[0, 5, 0]} color="#00ffaa" intensity={1} distance={15} />
      <pointLight position={[-5, 3, -5]} color="#ff00aa" intensity={0.5} distance={10} />
      <pointLight position={[5, 3, 5]} color="#00aaff" intensity={0.5} distance={10} />

      {/* Scene elements */}
      <CryptoText3D />
      <NeonGrid />
      <ArcadePlatform />
      <FloatingCrystals />

      {/* Coins */}
      {coins.map(coin => (
        <GoldenCoin
          key={coin.id}
          position={coin.position}
          onCollect={() => handleCoinCollect(coin.id)}
          collected={coin.collected}
          speed={coin.speed}
          rotationSpeed={coin.rotationSpeed}
        />
      ))}

      {/* Controls */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={5}
        maxDistance={25}
        maxPolarAngle={Math.PI / 2.1}
        enablePan={false}
      />
    </>
  )
}
