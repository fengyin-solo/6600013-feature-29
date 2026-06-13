export type PatternType = 'spiral' | 'fractal' | 'wave' | 'circles' | 'voronoi' | 'noise'

export type LockableParam =
  | 'pattern'
  | 'seed'
  | 'iterations'
  | 'scale'
  | 'rotation'
  | 'strokeWidth'
  | 'opacity'
  | 'bgColor'
  | 'palette'

export type LockState = Record<LockableParam, boolean>

export interface DesignParams {
  pattern: PatternType
  seed: number
  iterations: number
  scale: number
  rotation: number
  strokeWidth: number
  opacity: number
  bgColor: string
  palette: string[]
  width: number
  height: number
}

export interface ColorTheme {
  id: string
  name: string
  colors: string[]
}
