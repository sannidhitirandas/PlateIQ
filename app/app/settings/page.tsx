'use client'

import { useState } from 'react'
import { AppShell } from '@/components/app-shell'
import { usePlateIQ } from '@/components/plateiq-state'
import { 
  ShieldCheck, 
  Sparkles, 
  Cpu, 
  Sliders, 
  RotateCcw, 
  CheckCircle2, 
  Scale, 
  Thermometer, 
  Flame, 
  Radio, 
  Lock, 
  Layers, 
  DollarSign,
  Workflow,
  RefreshCw,
  PlusCircle
} from 'lucide-react'

export default function SettingsPage() {
  const { state, dispatch } = usePlateIQ()
  const [activeTab, setActiveTab] = useState<'copilot' | 'iot' | 'guardrails' | 'integrations' | 'brigade' | 'general'>('copilot')
  const [autonomyMode, setAutonomyMode] = useState<'assist' | 'human' | 'autopilot'>('human')
  const [priceTolerance, setPriceTolerance] = useState(5.0)
  const [stationParShift, setStationParShift] = useState(true)
  const [trimRouting, setTrimRouting] = useState(true)
  const [foodCostCeiling, setFoodCostCeiling] = useState(26.5)
  const [laborCostCeiling, setLaborCostCeiling] = useState(28.0)
  const [poCap, setPoCap] = useState(1500)
  const [saved, setSaved] = useState(false)
  const [calibrating, setCalibrating] = useState<string | null>(null)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleCalibrate = (id: string) => {
    setCalibrating(id)
    setTimeout(() => setCalibrating(null), 1200)
  }

  return (
    <AppShell>
      <div className="stitch-page">
        {/* TOP STATUS STRIP & BREADCRUMB */}
        <div className="stitch-panel flex flex-col gap-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="stitch-badge-emerald flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Production • v4.2.1-lumiere
                </span>
                <span className="text-xs text-stone-500 flex items-center gap-1">
                  <Radio className="w-3.5 h-3.5 text-emerald-600" />
                  Edge Node #01 • Synced 42s ago
                </span>
              </div>
              <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Kitchen System Settings &amp; Autonomous Configuration</h1>
              <p className="text-sm text-stone-600 max-w-4xl">
                Manage multi-station IoT sensor mesh, autonomous copilot intervention boundaries, POS &amp; ERP integrations, prime cost guardrails, and brigade access roles.
              </p>
            </div>
            
            <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
              <button 
                type="button" 
                onClick={() => dispatch({ type: 'reset-data' })}
                className="stitch-btn-secondary text-xs flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
                Reset Defaults
              </button>
              <button 
                type="button" 
                onClick={handleSave}
                className="stitch-btn-primary text-xs flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                {saved ? 'Configuration Saved!' : 'Save Configuration'}
              </button>
            </div>
          </div>

          {/* HORIZONTAL SETTINGS TABS */}
          <div className="flex items-center gap-1 overflow-x-auto bg-stone-100 p-1 rounded-xl">
            {[
              { id: 'copilot', label: 'Autonomous Copilot & Rules', icon: Sparkles, activePill: 'Active Engine' },
              { id: 'iot', label: 'IoT & Smart Hardware', icon: Cpu },
              { id: 'guardrails', label: 'Cost Guardrails & Pricing', icon: Sliders },
              { id: 'integrations', label: 'Integrations & APIs', icon: Workflow },
              { id: 'brigade', label: 'Brigade Access & Roles', icon: Lock },
              { id: 'general', label: 'General & Dining Room', icon: Layers }
            ].map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    isActive 
                      ? 'bg-white text-emerald-950 shadow-sm' 
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-700' : 'text-stone-400'}`} />
                  {tab.label}
                  {tab.activePill && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold uppercase tracking-wider ml-1">
                      {tab.activePill}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* 2-COLUMN SETTINGS WORKSPACE */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: AUTONOMY & HARDWARE MESH (7 COLS) */}
          <div className="xl:col-span-7 flex flex-col gap-6">
            {/* SECTION 1: AUTONOMOUS AI COPILOT & DECISION GUARDRAILS */}
            <section className="stitch-panel flex flex-col gap-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-stone-900">Autonomous AI Copilot Engine</h2>
                      <span className="stitch-badge-emerald text-[10px]">Policy v4.2</span>
                    </div>
                    <p className="text-xs text-stone-500">Real-time dynamic ticket orchestration, par reallocation, and inventory routing</p>
                  </div>
                </div>
                <span className="stitch-badge-emerald flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Guarded Mode
                </span>
              </div>

              {/* Autonomy Mode Switcher */}
              <div className="bg-stone-50 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Autonomy Level Selection</span>
                  <span className="text-xs font-semibold text-emerald-700">Latent Cycle: 250ms</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAutonomyMode('assist')}
                    className={`p-3 rounded-lg text-left transition-all ${
                      autonomyMode === 'assist'
                        ? 'bg-emerald-950 text-white shadow-sm'
                        : 'bg-white text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <div className="text-xs font-bold">Autonomous Assist</div>
                    <div className={`text-[10px] mt-0.5 ${autonomyMode === 'assist' ? 'text-emerald-200' : 'text-stone-400'}`}>Recommendations only</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAutonomyMode('human')}
                    className={`p-3 rounded-lg text-left transition-all ${
                      autonomyMode === 'human'
                        ? 'bg-emerald-950 text-white shadow-sm'
                        : 'bg-white text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">Human-in-the-Loop</span>
                      <CheckCircle2 className={`w-3.5 h-3.5 ${autonomyMode === 'human' ? 'text-emerald-400' : 'text-stone-300'}`} />
                    </div>
                    <div className={`text-[10px] mt-0.5 ${autonomyMode === 'human' ? 'text-emerald-200' : 'text-stone-400'}`}>Automated under limits</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAutonomyMode('autopilot')}
                    className={`p-3 rounded-lg text-left transition-all ${
                      autonomyMode === 'autopilot'
                        ? 'bg-emerald-950 text-white shadow-sm'
                        : 'bg-white text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <div className="text-xs font-bold">Full Autopilot</div>
                    <div className={`text-[10px] mt-0.5 ${autonomyMode === 'autopilot' ? 'text-emerald-200' : 'text-stone-400'}`}>Unconstrained rush mode</div>
                  </button>
                </div>
                <p className="text-xs text-stone-600 bg-white p-2.5 rounded-lg border border-stone-200">
                  PlateIQ dynamically adjusts prep pars, dispatches station commis reallocations, and triggers dynamic digital QR menu swaps within pre-approved thresholds.
                </p>
              </div>

              {/* Guardrails List */}
              <div className="flex flex-col gap-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Risk Boundaries &amp; Execution Triggers</span>
                
                {/* Guardrail 1: Price Spike Auto-Hedge */}
                <div className="bg-stone-50 p-3.5 rounded-xl flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-emerald-700" />
                      <div>
                        <div className="text-xs font-bold text-stone-900">Commodity Price Spike Auto-Hedge</div>
                        <div className="text-[11px] text-stone-500">Trigger substitution proposal when wholesale cost exceeds tolerance</div>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-white text-emerald-800 shadow-xs">
                      +{priceTolerance.toFixed(1)}% WoW
                    </span>
                  </div>
                  <div className="flex items-center gap-3 pt-1">
                    <span className="text-[10px] text-stone-400 font-bold">+1.0%</span>
                    <input
                      type="range"
                      min="1"
                      max="15"
                      step="0.5"
                      value={priceTolerance}
                      onChange={(e) => setPriceTolerance(Number(e.target.value))}
                      className="w-full accent-emerald-700 h-1.5 bg-stone-200 rounded-lg cursor-pointer"
                    />
                    <span className="text-[10px] text-stone-400 font-bold">+15.0%</span>
                  </div>
                </div>

                {/* Guardrail 2: Emergency Station Par Shift */}
                <div className="bg-stone-50 p-3.5 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2 pr-4">
                    <Workflow className="w-4 h-4 text-emerald-700" />
                    <div>
                      <div className="text-xs font-bold text-stone-900">Emergency Station Par Reallocation</div>
                      <div className="text-[11px] text-stone-500">Auto-dispatch commis cook if ticket delay crosses &gt;12 mins without manual sign-off</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={stationParShift}
                    onClick={() => setStationParShift(!stationParShift)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                      stationParShift ? 'bg-emerald-600' : 'bg-stone-300'
                    }`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      stationParShift ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* Guardrail 3: Waste Trim-to-Recipe Routing */}
                <div className="bg-stone-50 p-3.5 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2 pr-4">
                    <RotateCcw className="w-4 h-4 text-emerald-700" />
                    <div>
                      <div className="text-xs font-bold text-stone-900">Waste Trim-to-Recipe Primal Routing</div>
                      <div className="text-[11px] text-stone-500">Auto-route high-value trim (&gt; $35/kg, A5 Wagyu, Duck Magret) to culinary R&amp;D amuse / tallow SOP</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={trimRouting}
                    onClick={() => setTrimRouting(!trimRouting)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                      trimRouting ? 'bg-emerald-600' : 'bg-stone-300'
                    }`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      trimRouting ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>
            </section>

            {/* SECTION 2: CONNECTED KITCHEN IOT HARDWARE */}
            <section className="stitch-panel flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-stone-900">Kitchen IoT Sensor Mesh</h2>
                    <p className="text-xs text-stone-500">Telemetry health, HACCP probes, line tare scales &amp; combi ovens</p>
                  </div>
                </div>
                <span className="stitch-badge-emerald text-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  18/18 Online • BLE 5.0 Strong
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Scale */}
                <div className="bg-stone-50 p-3.5 rounded-xl flex flex-col justify-between gap-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Scale className="w-4 h-4 text-emerald-700" />
                      <div>
                        <div className="text-xs font-bold text-stone-900">Smart Tare Scales</div>
                        <div className="text-[10px] text-stone-400 uppercase">Garde Manger &amp; Hearth</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white text-emerald-700 shadow-xs">94% Battery</span>
                  </div>
                  <div className="text-xs text-stone-600">BLE Smart Tare Pro v2 • IP68 Washdown • Zero calibration drift verified.</div>
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-emerald-700 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" /> Auto-tare active
                    </span>
                    <button 
                      type="button" 
                      onClick={() => handleCalibrate('scale')}
                      className="text-emerald-700 font-bold hover:underline"
                    >
                      {calibrating === 'scale' ? 'Calibrating...' : 'Calibrate'}
                    </button>
                  </div>
                </div>

                {/* Combi Oven */}
                <div className="bg-stone-50 p-3.5 rounded-xl flex flex-col justify-between gap-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-emerald-700" />
                      <div>
                        <div className="text-xs font-bold text-stone-900">Rational Combi Ovens</div>
                        <div className="text-[10px] text-stone-400 uppercase">iCombi Pro #1 &amp; #2</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white text-stone-700 shadow-xs">LAN Conn</span>
                  </div>
                  <div className="text-xs text-stone-600">Firmware v2.9 • HACCP automated cloud sync active • Core probe telemetry valid.</div>
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-emerald-700 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" /> Steam sync OK
                    </span>
                    <button 
                      type="button" 
                      onClick={() => handleCalibrate('oven')}
                      className="text-emerald-700 font-bold hover:underline"
                    >
                      {calibrating === 'oven' ? 'Sweeping...' : 'Diagnostics'}
                    </button>
                  </div>
                </div>

                {/* Walk-in Cooler */}
                <div className="bg-stone-50 p-3.5 rounded-xl flex flex-col justify-between gap-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Thermometer className="w-4 h-4 text-emerald-700" />
                      <div>
                        <div className="text-xs font-bold text-stone-900">Walk-In Temp Probes</div>
                        <div className="text-[10px] text-stone-400 uppercase">Meat / Veg / Fish Box</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white text-emerald-700 shadow-xs">LoRaWAN</span>
                  </div>
                  <div className="text-xs text-stone-600">
                    Meat: <strong className="text-stone-900">34.2°F</strong> • Veg: <strong className="text-stone-900">37.8°F</strong> • Fish: <strong className="text-stone-900">32.1°F</strong>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-emerald-700 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" /> Compliant range
                    </span>
                    <button type="button" className="text-emerald-700 font-bold hover:underline">HACCP Log</button>
                  </div>
                </div>

                {/* Immersion Circulator */}
                <div className="bg-stone-50 p-3.5 rounded-xl flex flex-col justify-between gap-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Radio className="w-4 h-4 text-emerald-700" />
                      <div>
                        <div className="text-xs font-bold text-stone-900">PolyScience Immersion</div>
                        <div className="text-[10px] text-stone-400 uppercase">HydroPro Chef #1 &amp; #2</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white text-emerald-700 shadow-xs">Wi-Fi 5GHz</span>
                  </div>
                  <div className="text-xs text-stone-600">
                    Target: <strong className="text-stone-900">57.0°C</strong> • Calibrated at 11:30 • Continuous thermal log.
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-emerald-700 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" /> Holding bath
                    </span>
                    <button type="button" className="text-emerald-700 font-bold hover:underline">Adjust Bath</button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button type="button" className="stitch-btn-secondary text-xs flex items-center gap-1.5">
                  <PlusCircle className="w-3.5 h-3.5" />
                  Pair New IoT Hardware
                </button>
                <button type="button" className="text-emerald-700 font-bold text-xs hover:underline flex items-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5" />
                  Run Mesh Diagnostic Sweep
                </button>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: FINANCIAL GUARDRAILS & INTEGRATIONS (5 COLS) */}
          <div className="xl:col-span-5 flex flex-col gap-6">
            {/* PRIME COST GUARDRAILS */}
            <section className="stitch-panel flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-stone-900">Prime Cost Guardrails</h2>
                    <p className="text-xs text-stone-500">Actuarial kitchen yield &amp; spend throttling</p>
                  </div>
                </div>
                <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-stone-100 text-stone-800">
                  Cur: 54.2%
                </span>
              </div>

              {/* Progress Bar Representation */}
              <div className="bg-stone-50 p-4 rounded-xl flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Prime Cost Ceiling (Food + Labor)</span>
                  <span className="text-xl font-extrabold text-stone-900 font-mono">55.0%</span>
                </div>
                <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden relative">
                  <div className="bg-emerald-600 h-full rounded-full transition-all duration-500" style={{ width: '54.2%' }} />
                </div>
                <div className="flex justify-between text-[10px] text-stone-500 font-bold pt-1">
                  <span>Optimal (&lt;52%)</span>
                  <span className="text-emerald-700 font-mono">Current 54.2%</span>
                  <span className="text-red-600 font-mono">Ceiling 55.0%</span>
                </div>
              </div>

              <div className="space-y-2">
                {/* Food Cost */}
                <div className="bg-stone-50 p-3 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                    <div>
                      <div className="text-xs font-bold text-stone-900">Food Cost Target Ceiling</div>
                      <div className="text-[10px] text-stone-500">Alert trigger at 27.5% threshold</div>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-stone-900 bg-white px-2 py-1 rounded shadow-xs">{foodCostCeiling.toFixed(1)}%</span>
                </div>

                {/* Labor Cost */}
                <div className="bg-stone-50 p-3 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <div>
                      <div className="text-xs font-bold text-stone-900">Labor Cost Target Ceiling</div>
                      <div className="text-[10px] text-stone-500">Overtime warning 45m before shift end</div>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-stone-900 bg-white px-2 py-1 rounded shadow-xs">{laborCostCeiling.toFixed(1)}%</span>
                </div>

                {/* PO Cap */}
                <div className="bg-stone-50 p-3 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-950" />
                    <div>
                      <div className="text-xs font-bold text-stone-900">Auto Supplier PO Cap</div>
                      <div className="text-[10px] text-stone-500">Chef Vance dual-authorization required &gt; ${poCap}</div>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-stone-900 bg-white px-2 py-1 rounded shadow-xs">${poCap.toLocaleString()}</span>
                </div>
              </div>
            </section>

            {/* ENTERPRISE INTEGRATIONS */}
            <section className="stitch-panel flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                    <Workflow className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-stone-900">Enterprise Integrations</h2>
                    <p className="text-xs text-stone-500">POS, Reservation pacing, EDI feeds &amp; Weather</p>
                  </div>
                </div>
                <span className="stitch-badge-emerald text-xs">4 Active</span>
              </div>

              <div className="space-y-2">
                {[
                  { name: 'Toast POS & KDS Gateway', desc: 'Real-time order webhook stream active (20ms latency)', status: 'Connected', active: true },
                  { name: 'SevenRooms Reservation Pacing', desc: 'Party size, VIP tags, and seating cadence synced', status: 'Connected', active: true },
                  { name: 'US Foods EDI / MarketMan', desc: 'Direct electronic PO dispatch and price verification', status: 'Active', active: true },
                  { name: 'OpenWeatherMap NOAA Radar', desc: 'Hourly barometric and precipitation forecast stream', status: 'Active', active: true }
                ].map((item) => (
                  <div key={item.name} className="bg-stone-50 p-3 rounded-lg flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-stone-900">{item.name}</div>
                      <div className="text-[11px] text-stone-500">{item.desc}</div>
                    </div>
                    <span className="stitch-badge-emerald text-[10px] shrink-0 font-bold">{item.status}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
