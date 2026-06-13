import { useDesignStore } from '../store/design'
import { THEMES } from '../themes/palettes'
import type { PatternType, LockableParam } from '../types'

const PATTERNS: { value: PatternType; label: string }[] = [
  { value: 'spiral',  label: '🌀 螺旋' },
  { value: 'fractal', label: '🌳 分形树' },
  { value: 'wave',    label: '🌊 波浪' },
  { value: 'circles', label: '⭕ 圆环' },
  { value: 'noise',   label: '🎲 噪声场' },
]

function LockButton({ param, label }: { param: LockableParam; label: string }) {
  const store = useDesignStore()
  const locked = store.lockedParams[param]
  return (
    <button
      onClick={() => store.toggleLock(param)}
      title={locked ? `解锁${label}` : `锁定${label}`}
      className={`text-sm px-1.5 rounded transition-colors ${
        locked
          ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
          : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-gray-200'
      }`}
    >
      {locked ? '🔒' : '🔓'}
    </button>
  )
}

function LabelRow({ label, param }: { label: string; param: LockableParam }) {
  return (
    <div className="flex items-center justify-between mb-1">
      <label className="text-xs text-gray-400">{label}</label>
      <LockButton param={param} label={label} />
    </div>
  )
}

export default function Sidebar() {
  const store = useDesignStore()

  return (
    <div className="w-80 bg-gray-900 border-l border-gray-700 p-4 overflow-y-auto flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">🎨 SVG 海报设计器</h2>
        <button
          onClick={() => store.randomizeAll()}
          className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded text-xs font-bold shadow-lg active:scale-95 transition"
        >
          🎲 全部随机
        </button>
      </div>

      {/* Pattern */}
      <div>
        <LabelRow label="图案类型" param="pattern" />
        <div className="grid grid-cols-2 gap-2">
          {PATTERNS.map(p => (
            <button
              key={p.value}
              onClick={() => store.setPattern(p.value)}
              disabled={store.lockedParams.pattern}
              className={`px-2 py-1.5 rounded text-xs font-medium transition ${
                store.pattern === p.value
                  ? 'bg-indigo-600'
                  : 'bg-gray-700 hover:bg-gray-600'
              } ${store.lockedParams.pattern ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Theme / Palette */}
      <div>
        <LabelRow label="颜色主题" param="palette" />
        <div className="grid grid-cols-2 gap-2">
          {THEMES.map(t => {
            const isActive = store.palette === t.colors || JSON.stringify(store.palette) === JSON.stringify(t.colors)
            return (
              <button
                key={t.id}
                onClick={() => store.setTheme(t.id)}
                disabled={store.lockedParams.palette}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition ${
                  isActive ? 'bg-indigo-600' : 'bg-gray-700 hover:bg-gray-600'
                } ${store.lockedParams.palette ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex">
                  {t.colors.map((c, i) => (
                    <div
                      key={i}
                      style={{ background: c }}
                      className="w-3 h-3 rounded-full -ml-1 first:ml-0 border border-gray-800"
                    />
                  ))}
                </div>
                <span className="truncate">{t.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* BG Color */}
      <div>
        <LabelRow label="背景色" param="bgColor" />
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={store.bgColor}
            onChange={e => store.setParam('bgColor', e.target.value)}
            disabled={store.lockedParams.bgColor}
            className={`w-10 h-8 rounded cursor-pointer bg-transparent border border-gray-600 ${
              store.lockedParams.bgColor ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />
          <input
            type="text"
            value={store.bgColor}
            onChange={e => store.setParam('bgColor', e.target.value)}
            disabled={store.lockedParams.bgColor}
            className={`flex-1 px-2 py-1 rounded text-xs bg-gray-700 border border-gray-600 focus:border-indigo-500 outline-none ${
              store.lockedParams.bgColor ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />
        </div>
      </div>

      {/* Seed */}
      <div>
        <LabelRow label={`种子: ${store.seed}`} param="seed" />
        <div className="flex gap-2">
          <input
            type="range"
            min={0}
            max={99999}
            value={store.seed}
            onChange={e => store.setParam('seed', Number(e.target.value))}
            disabled={store.lockedParams.seed}
            className={`flex-1 accent-indigo-500 ${
              store.lockedParams.seed ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />
          <button
            onClick={() => store.randomSeed()}
            disabled={store.lockedParams.seed}
            className={`px-2 bg-indigo-600 rounded text-xs ${
              store.lockedParams.seed ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-500'
            }`}
          >
            🎲
          </button>
        </div>
      </div>

      {/* Iterations */}
      <div>
        <LabelRow label={`迭代数: ${store.iterations}`} param="iterations" />
        <input
          type="range"
          min={10}
          max={500}
          step={10}
          value={store.iterations}
          onChange={e => store.setParam('iterations', Number(e.target.value))}
          disabled={store.lockedParams.iterations}
          className={`w-full accent-purple-500 ${
            store.lockedParams.iterations ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        />
      </div>

      {/* Scale */}
      <div>
        <LabelRow label={`缩放: ${store.scale.toFixed(2)}`} param="scale" />
        <input
          type="range"
          min={0.1}
          max={3}
          step={0.1}
          value={store.scale}
          onChange={e => store.setParam('scale', Number(e.target.value))}
          disabled={store.lockedParams.scale}
          className={`w-full accent-green-500 ${
            store.lockedParams.scale ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        />
      </div>

      {/* Rotation */}
      <div>
        <LabelRow label={`旋转: ${store.rotation}°`} param="rotation" />
        <input
          type="range"
          min={0}
          max={360}
          step={5}
          value={store.rotation}
          onChange={e => store.setParam('rotation', Number(e.target.value))}
          disabled={store.lockedParams.rotation}
          className={`w-full accent-yellow-500 ${
            store.lockedParams.rotation ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        />
      </div>

      {/* Stroke */}
      <div>
        <LabelRow label={`描边: ${store.strokeWidth.toFixed(1)}`} param="strokeWidth" />
        <input
          type="range"
          min={0.5}
          max={5}
          step={0.5}
          value={store.strokeWidth}
          onChange={e => store.setParam('strokeWidth', Number(e.target.value))}
          disabled={store.lockedParams.strokeWidth}
          className={`w-full accent-orange-500 ${
            store.lockedParams.strokeWidth ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        />
      </div>

      {/* Opacity */}
      <div>
        <LabelRow label={`透明度: ${store.opacity.toFixed(2)}`} param="opacity" />
        <input
          type="range"
          min={0.1}
          max={1}
          step={0.05}
          value={store.opacity}
          onChange={e => store.setParam('opacity', Number(e.target.value))}
          disabled={store.lockedParams.opacity}
          className={`w-full accent-pink-500 ${
            store.lockedParams.opacity ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        />
      </div>

      {/* Lock Tips */}
      <div className="mt-1 p-2 rounded bg-gray-800/50 border border-gray-700 text-xs text-gray-400 space-y-1">
        <p>💡 <span className="text-gray-300">使用提示</span></p>
        <p>• 点击 🔓 锁定参数，点击"全部随机"时保持不变</p>
        <p>• 点击 🔒 解除锁定，恢复随机更新</p>
      </div>

      {/* Export */}
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => store.exportSvg()}
          className="flex-1 py-2 bg-teal-600 hover:bg-teal-500 rounded text-sm font-medium transition"
        >
          ⬇ SVG
        </button>
        <button
          onClick={() => store.exportPng()}
          className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 rounded text-sm font-medium transition"
        >
          ⬇ PNG
        </button>
      </div>
    </div>
  )
}
