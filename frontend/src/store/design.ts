import { create } from 'zustand'
import type { DesignParams, LockableParam, LockState, PatternType } from '../types'
import { THEMES } from '../themes/palettes'

const PATTERN_TYPES: PatternType[] = ['spiral', 'fractal', 'wave', 'circles', 'noise']

const DEFAULT_LOCK: LockState = {
  pattern: false,
  seed: false,
  iterations: false,
  scale: false,
  rotation: false,
  strokeWidth: false,
  opacity: false,
  bgColor: false,
  palette: false,
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randFloat(min: number, max: number, step: number = 0.01): number {
  const steps = Math.round((max - min) / step)
  const randomStep = Math.floor(Math.random() * (steps + 1))
  const raw = min + randomStep * step
  const decimals = step < 1 ? String(step).split('.')[1]?.length || 0 : 0
  return Number(raw.toFixed(decimals))
}

interface DesignStore extends DesignParams {
  svgContent: string
  lockedParams: LockState
  setParam: <K extends keyof DesignParams>(key: K, value: DesignParams[K]) => void
  setPattern: (p: PatternType) => void
  setTheme: (id: string) => void
  randomSeed: () => void
  randomizeAll: () => void
  toggleLock: (key: LockableParam) => void
  setSvgContent: (s: string) => void
  exportSvg: () => void
  exportPng: () => void
}

export const useDesignStore = create<DesignStore>((set, get) => ({
  pattern: 'spiral',
  seed: 42,
  iterations: 200,
  scale: 1.0,
  rotation: 0,
  strokeWidth: 1.5,
  opacity: 0.8,
  bgColor: '#030712',
  palette: THEMES[0].colors,
  width: 800,
  height: 1000,
  svgContent: '',
  lockedParams: { ...DEFAULT_LOCK },
  setParam: (key, value) => set({ [key]: value } as any),
  setPattern: (p) => set({ pattern: p }),
  setTheme: (id) => {
    const theme = THEMES.find(t => t.id === id)
    if (theme) set({ palette: theme.colors })
  },
  randomSeed: () => set({ seed: Math.floor(Math.random() * 99999) }),
  randomizeAll: () => {
    const lock = get().lockedParams
    const updates: Partial<DesignParams> = {}
    if (!lock.pattern) {
      updates.pattern = PATTERN_TYPES[randInt(0, PATTERN_TYPES.length - 1)]
    }
    if (!lock.seed) {
      updates.seed = randInt(0, 99999)
    }
    if (!lock.iterations) {
      updates.iterations = randInt(50, 400)
    }
    if (!lock.scale) {
      updates.scale = randFloat(0.3, 2.5, 0.1)
    }
    if (!lock.rotation) {
      updates.rotation = randInt(0, 360)
    }
    if (!lock.strokeWidth) {
      updates.strokeWidth = randFloat(0.5, 4, 0.5)
    }
    if (!lock.opacity) {
      updates.opacity = randFloat(0.3, 1, 0.05)
    }
    if (!lock.bgColor) {
      const chars = '0123456789ABCDEF'
      let color = '#'
      for (let i = 0; i < 6; i++) {
        color += chars[Math.floor(Math.random() * 16)]
      }
      updates.bgColor = color
    }
    if (!lock.palette) {
      const theme = THEMES[randInt(0, THEMES.length - 1)]
      updates.palette = theme.colors
    }
    set(updates as any)
  },
  toggleLock: (key) => set((state) => ({
    lockedParams: { ...state.lockedParams, [key]: !state.lockedParams[key] },
  })),
  setSvgContent: (s) => set({ svgContent: s }),
  exportSvg: () => {
    const { svgContent } = get()
    const blob = new Blob([svgContent], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `art-${get().seed}.svg`; a.click()
    URL.revokeObjectURL(url)
  },
  exportPng: () => {
    const { svgContent, width, height } = get()
    const canvas = document.createElement('canvas')
    canvas.width = width; canvas.height = height
    const ctx = canvas.getContext('2d')!
    const img = new Image()
    const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(svgBlob)
    img.onload = () => {
      ctx.drawImage(img, 0, 0)
      URL.revokeObjectURL(url)
      canvas.toBlob(blob => {
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob!)
        a.download = `art-${get().seed}.png`; a.click()
      })
    }
    img.src = url
  },
}))
