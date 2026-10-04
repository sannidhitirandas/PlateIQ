'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Check,
  ClipboardList,
  CloudRain,
  Download,
  Flame,
  Layers,
  Leaf,
  Play,
  RotateCcw,
  Search,
  Sliders,
  Sparkles,
  Sun,
  Theater,
  TrendingDown,
  TrendingUp,
  Truck,
  Users,
  UtensilsCrossed,
  Zap,
} from 'lucide-react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { usePlateIQ } from './plateiq-state'
import {
  getCopilotContext,
  getDishOperationalContext,
  getForecastMetrics,
  getKitchenMetrics,
  getLiveOperationsMetrics,
  getRestaurantMetrics,
  simulateScenario,
} from '@/lib/selectors'
import { wasteSummary } from '@/lib/waste-engine'

/* -------------------------------------------------------------------------- */
/*                               SHARED HELPERS                               */
/* -------------------------------------------------------------------------- */

function Chart({ title = 'Service demand & preparation pacing' }: { title?: string }) {
  const { state } = usePlateIQ()
  const forecast = getForecastMetrics(state)
  const scheduledTotal = state.batches.reduce((sum, b) => sum + b.quantity, 0)

  // Pacing model based on shift par distribution
  const data = [
    { time: '17:00', planned: 24, target: 20 },
    { time: '18:00', planned: 52, target: 48 },
    { time: '19:00', planned: 96, target: 92 },
    { time: '20:00', planned: 138, target: 130 },
    { time: '21:00', planned: 165, target: 160 },
    { time: '22:00', planned: scheduledTotal || 182, target: forecast?.forecast ?? 180 },
  ]

  return (
    <section className="panel stitch-chart-card">
      <div className="stitch-section-heading">
        <div>
          <div className="section-kicker"><Activity /> {title}</div>
          <h2>Service Demand &amp; Production Pacing</h2>
          <p>Scheduled kitchen prep volume against target service cover capacity.</p>
        </div>
        <span className="stitch-section-status" style={{ background: '#F1F5F0', color: '#3A5641' }}>
          Shift Model
        </span>
      </div>

      <div className="chart-legend">
        <span><i className="legend-line actual" /> Scheduled prep curve</span>
        <span><i className="legend-line forecast" /> Target cover capacity</span>
      </div>

      <div className="chart-wrap refined-chart-wrap" style={{ minHeight: 240, width: '100%' }}>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={data} margin={{ top: 12, right: 12, left: -16, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#E4EAE2" strokeDasharray="3 4" />
            <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fill: '#6C7E72', fontSize: 11 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: '#6C7E72', fontSize: 11 }} width={38} />
            <Tooltip
              contentStyle={{
                background: '#fff',
                border: '1px solid #DCE5DA',
                borderRadius: 12,
                boxShadow: '0 8px 24px rgba(23,75,50,0.08)',
                fontSize: 12,
                color: '#17231B',
              }}
              formatter={(val, name) => [
                typeof val === 'number' ? `${val} plates` : val,
                name === 'planned' ? 'Scheduled Prep' : name === 'target' ? 'Target Capacity' : name,
              ]}
            />
            <Line
              dataKey="target"
              stroke="#D8942F"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{ r: 4, fill: '#D8942F', stroke: '#fff', strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
            <Line
              dataKey="planned"
              stroke="#16834B"
              strokeWidth={3}
              dot={{ r: 5, fill: '#16834B', stroke: '#fff', strokeWidth: 2 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="stitch-chart-footer">
        <div>
          <span>Target covers</span>
          <strong>{forecast?.forecast ?? 182} <small>covers</small></strong>
        </div>
        <div>
          <span>Active prep batches</span>
          <strong>{state.batches.filter(b => b.status !== 'Completed').length} <small>batches</small></strong>
        </div>
        <div>
          <span>Operating stations</span>
          <strong>{state.stations.length} <small>stations</small></strong>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*                                  OVERVIEW                                  */
/* -------------------------------------------------------------------------- */

export function Overview() {
  const { state, dispatch } = usePlateIQ()
  const metrics = getRestaurantMetrics(state)
  const forecast = getForecastMetrics(state)
  const context = getDishOperationalContext(state, forecast?.dishId)
  const waste = wasteSummary(state.waste)
  const recommendation = state.recommendations.find(item => item.dishId === forecast?.dishId)
  const activeBatches = state.batches.filter(batch => batch.status !== 'Completed')
  const completedBatchesCount = state.batches.filter(batch => batch.status === 'Completed').length
  const priorityEvents = state.events.slice(0, 3)
  const lowStockItems = state.inventory.filter(i => i.status === 'Low' || i.status === 'Critical')
  const inStockPercent = state.inventory.length
    ? Math.round((state.inventory.filter(i => i.status !== 'Critical' && i.status !== 'Low').length / state.inventory.length) * 100)
    : 100

  return (
    <div className="page-body stitch-overview">
      {/* 1. Greeting & Shift Context Header */}
      <div className="stitch-overview-topline">
        <div>
          <span>{state.restaurant.name}</span>
          <span className="stitch-dot-separator">•</span>
          <span>{state.restaurant.city}, {state.restaurant.country}</span>
        </div>
        <span className="stitch-updated">Kitchen Operations Workspace</span>
      </div>

      <section className="stitch-welcome">
        <div className="stitch-welcome-copy">
          <div className="stitch-eyebrow">OPERATIONS BRIEFING · DINNER SERVICE</div>
          <h1>
            Kitchen Operations Overview
          </h1>
          <p>
            Service planning, active prep queues, station capacities, and inventory par tracking.
          </p>
          <div className="stitch-welcome-meta">
            <span>✦ <strong>{state.stations.length}</strong> active kitchen stations</span>
            <span>▦ <strong>{state.inventory.length}</strong> tracked ingredients</span>
            <span>✓ <strong>{activeBatches.length}</strong> active prep batches</span>
          </div>
        </div>

        <div className="stitch-welcome-actions">
          <div className="stitch-shift-pill">
            <span>SERVICE SHIFT</span>
            <strong>DINNER SERVICE</strong>
            <small>Service window · 17:00–22:00</small>
          </div>
          <div className="stitch-button-row">
            <Link className="stitch-secondary-action" href="/app/kitchen-planner">
              <ClipboardList /> View Tasks
            </Link>
            <Link className="stitch-primary-action" href="/app/live-operations">
              <Activity /> Open KDS
            </Link>
          </div>
        </div>
      </section>

      {/* 2. 4-Column Operational Telemetry KPI Cards */}
      <section className="stitch-kpi-grid">
        <article className="stitch-kpi">
          <div className="stitch-kpi-heading">
            <span>TARGET DEMAND</span>
            <span className="stitch-kpi-tag">PLANNED</span>
          </div>
          <strong>{metrics.demand.toLocaleString('en-IN')} <small>covers</small></strong>
          <div className="stitch-kpi-foot">
            <span>Dinner shift capacity</span>
            <span className="stitch-kpi-positive">{state.dishes.length} menu items</span>
          </div>
        </article>

        <article className="stitch-kpi">
          <div className="stitch-kpi-heading">
            <span>FOOD WASTE LOG</span>
            <span className="stitch-kpi-tag">RECORDED</span>
          </div>
          <strong>{metrics.wasteKg.toFixed(1)} <small>kg</small></strong>
          <div className="stitch-kpi-foot">
            <span>₹{metrics.wasteCost.toLocaleString('en-IN')} logged cost</span>
            <span className="stitch-kpi-positive">{state.waste.length} entries</span>
          </div>
        </article>

        <article className="stitch-kpi">
          <div className="stitch-kpi-heading">
            <span>INVENTORY HEALTH</span>
            <span className={`stitch-kpi-tag ${lowStockItems.length > 0 ? 'stitch-kpi-tag-warn' : ''}`}>
              {lowStockItems.length} LOW STOCK
            </span>
          </div>
          <strong>
            {inStockPercent}
            <small>%</small>
          </strong>
          <div className="stitch-kpi-foot">
            <span>{state.inventory.length} tracked items</span>
            <span className="stitch-kpi-positive">
              {lowStockItems.filter(i => i.status === 'Critical').length > 0
                ? `${lowStockItems.filter(i => i.status === 'Critical').length} critical`
                : 'Par levels monitored'}
            </span>
          </div>
        </article>

        <article className="stitch-kpi">
          <div className="stitch-kpi-heading">
            <span>PREPARATION PROGRESS</span>
            <span className="stitch-kpi-tag">ACTIVE</span>
          </div>
          <strong>{metrics.prepared.toLocaleString('en-IN')} <small>plates</small></strong>
          <div className="stitch-kpi-foot">
            <span>{activeBatches.length} active batches</span>
            <span className="stitch-kpi-positive">{completedBatchesCount} completed</span>
          </div>
        </article>
      </section>

      {/* 3. Main Operational Content Grid */}
      <section className="stitch-main-grid">
        <div className="stitch-main-column">
          {/* Chart */}
          <Chart title="Demand & production pacing" />

          {/* Expedite Pass Station Readiness */}
          <div className="stitch-section-heading stitch-section-heading-spaced">
            <div>
              <div className="stitch-eyebrow">LINE OPERATIONS</div>
              <h2>Expedite pass · Station readiness</h2>
              <p>Kitchen line load, station status, and readiness overview.</p>
            </div>
            <Link className="stitch-view-link" href="/app/live-operations">
              View KDS <ArrowUpRight />
            </Link>
          </div>

          <div className="stitch-station-grid">
            {state.stations.map((station) => (
              <article className="stitch-station-card" key={station.id}>
                <div className="stitch-station-head">
                  <span className={`stitch-station-dot ${station.status === 'At Risk' ? 'warn' : station.status === 'Busy' ? 'busy' : ''}`} />
                  <span>{station.name}</span>
                </div>
                <strong>{station.status === 'Busy' ? 'In service' : station.status === 'At Risk' ? 'Needs attention' : 'Ready'}</strong>
                <div className="stitch-station-progress">
                  <i style={{ width: `${station.capacity}%` }} />
                </div>
                <small>{station.capacity}% station load</small>
              </article>
            ))}
          </div>

          {/* Progressive Preparation Queue */}
          <section className="stitch-list-card">
            <div className="stitch-list-heading">
              <div>
                <h3>Progressive preparation queue</h3>
                <p>Scheduled batch production queue by station assignment.</p>
              </div>
              <span>{activeBatches.length} active batches</span>
            </div>

            <div className="stitch-queue">
              {activeBatches.length === 0 ? (
                <p style={{ padding: 20, textAlign: 'center', color: '#68826D', fontSize: 13 }}>
                  All scheduled batches completed.
                </p>
              ) : (
                activeBatches.slice(0, 4).map((batch) => {
                  const dish = state.dishes.find(item => item.id === batch.dishId)
                  return (
                    <div className="stitch-queue-row" key={batch.id}>
                      <div className="stitch-queue-number">#{batch.number}</div>
                      <div className="stitch-queue-name">
                        <strong>{dish?.name ?? batch.dishId}</strong>
                        <small>{dish?.leadTimeMinutes ?? 15} min lead time · {dish?.category}</small>
                      </div>
                      <div className="stitch-queue-quantity">
                        <strong>+{batch.quantity}</strong>
                        <small>plates</small>
                      </div>
                      <span className={`stitch-queue-status ${batch.status === 'In Preparation' ? 'busy' : ''}`}>
                        {batch.status}
                      </span>
                      <button
                        type="button"
                        aria-label={`Advance batch ${batch.number}`}
                        onClick={() => dispatch({ type: 'batch', batchId: batch.id })}
                        title="Advance batch status"
                      >
                        <ArrowRight />
                      </button>
                    </div>
                  )
                })
              )}
            </div>
          </section>
        </div>

        {/* Right Side Column */}
        <aside className="stitch-side-column">
          {/* Decision Support Card */}
          <section className="stitch-copilot-card">
            <div className="stitch-side-card-heading">
              <div>
                <span className="stitch-sparkle">✦</span>
                <h3>Operational Guidance</h3>
              </div>
              <span className="stitch-ai-pill">DECISION SUPPORT</span>
            </div>

            <p className="stitch-side-intro">
              Planning suggestions to balance station workload and manage preparation par levels.
            </p>

            {forecast && context ? (
              <div className="stitch-recommendation">
                <div className="stitch-rec-status">
                  <span className="stitch-station-dot" />
                  <strong>Prep Par Calibration</strong>
                </div>
                <p>{recommendation?.description ?? `${context.dish.name} scheduled for current shift par.`}</p>
                <div className="stitch-rec-metrics">
                  <span>Target<strong>{forecast.forecast} plates</strong></span>
                  <span>Category<strong>{context.dish.category}</strong></span>
                </div>
                {activeBatches[0] && (
                  <button
                    type="button"
                    onClick={() => dispatch({ type: 'batch', batchId: activeBatches[0].id })}
                  >
                    <span>{recommendation?.actionLabel ?? 'Advance Next Batch'}</span>
                    <ArrowRight />
                  </button>
                )}
              </div>
            ) : (
              <div className="stitch-empty-rec">All prep batches are nominal. No active interventions required.</div>
            )}

            {priorityEvents.map((event) => (
              <div className="stitch-event" key={event.id}>
                <span className="stitch-event-dot" />
                <div>
                  <strong>{event.title}</strong>
                  <p>{event.description}</p>
                  <small>{event.timestamp}</small>
                </div>
              </div>
            ))}

            <Link className="stitch-text-link" href="/app/copilot">
              Open Strategy Hub <ArrowUpRight />
            </Link>
          </section>

          {/* Waste Analytics Card */}
          <section className="stitch-waste-card">
            <div className="stitch-side-card-heading">
              <div>
                <span className="stitch-sparkle">↗</span>
                <h3>Waste tracking</h3>
              </div>
              <span className="stitch-good-pill">MONITORED</span>
            </div>

            <div className="stitch-waste-total">
              <strong>{waste.wasteKg.toFixed(1)} kg</strong>
              <span>logged waste</span>
            </div>

            <div className="stitch-waste-bar">
              <i style={{ width: `${Math.min(100, Math.max(10, metrics.wasteKg * 6))}%` }} />
            </div>

            <div className="stitch-waste-foot">
              <span>Estimated cost</span>
              <strong>₹{metrics.wasteCost.toLocaleString('en-IN')}</strong>
            </div>

            <Link className="stitch-text-link" href="/app/waste-intelligence">
              Review waste intelligence <ArrowUpRight />
            </Link>
          </section>

          {/* Inventory Watch Card */}
          <section className="stitch-inventory-card">
            <div className="stitch-side-card-heading">
              <div>
                <span className="stitch-sparkle">▦</span>
                <h3>Inventory watch</h3>
              </div>
              <span className="stitch-kpi-tag stitch-kpi-tag-warn">
                {lowStockItems.length} FLAGS
              </span>
            </div>

            {lowStockItems.slice(0, 3).map((item) => (
              <div className="stitch-inventory-row" key={item.id}>
                <span className="stitch-station-dot warn" />
                <div>
                  <strong>{item.name}</strong>
                  <small>{item.status} · {item.currentStock.toFixed(1)} {item.unit} left</small>
                </div>
                <Link href="/app/inventory" title="Open in Inventory">
                  <ArrowUpRight />
                </Link>
              </div>
            ))}

            {lowStockItems.length === 0 && (
              <p className="stitch-no-flags">No low-stock ingredients currently flagged.</p>
            )}

            <Link className="stitch-text-link" href="/app/inventory">
              Manage inventory <ArrowUpRight />
            </Link>
          </section>
        </aside>
      </section>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                                PRODUCT PAGE                                */
/* -------------------------------------------------------------------------- */

export function ProductPage({ kind }: { kind: string }) {
  if (kind === 'what-if') {
    return <ExternalFactorsPage />
  }
  if (kind === 'copilot') {
    return <AICopilotPage />
  }

  return <Overview />
}

/* -------------------------------------------------------------------------- */
/*                 EXTERNAL FACTORS / DEMAND INFLUENCERS                      */
/* -------------------------------------------------------------------------- */

function ExternalFactorsPage() {
  const { state, dispatch } = usePlateIQ()
  const [demandShift, setDemandShift] = useState(0)
  const [timeHorizon, setTimeHorizon] = useState('Next 48 Hours')
  const simulated = simulateScenario(state, { ...state.scenario, customerChange: demandShift })

  const handleDeployMitigations = () => {
    dispatch({ type: 'scenario', scenario: { customerChange: 15, weather: 'Rain' } })
    dispatch({ type: 'apply-plan' })
  }

  return (
    <div className="page-body stitch-workspace-page stitch-page-external-factors">
      {/* Top Breadcrumb & Status Ribbon */}
      <div className="stitch-page-intro">
        <div>
          <div className="stitch-page-kicker">
            <span className="stitch-live-dot" /> MACRO-TELEMETRY / EXTERNAL DEMAND SIGNALS
          </div>
          <h1>External Factors & Demand Influencers</h1>
          <p>
            Hyper-local meteorology, civic events, performing arts schedules, transit patterns, and commodity price shifts correlated with real-time cover pacing.
          </p>
        </div>
        <div className="stitch-page-status">
          <span className="stitch-live-dot" /> 4 Active Data Streams • 97.4% Signal Fidelity
        </div>
      </div>

      {/* Time Horizon Filter */}
      <div className="filter-row" style={{ marginTop: 0, marginBottom: 18 }}>
        <label>
          Time Horizon
          <select value={timeHorizon} onChange={(e) => setTimeHorizon(e.target.value)}>
            <option value="Next 48 Hours">Next 48 Hours (Tactical Service)</option>
            <option value="7-Day Outlook">7-Day Planning Outlook</option>
            <option value="14-Day Planning">14-Day Procurement Window</option>
            <option value="30-Day Seasonal">30-Day Seasonal Shift</option>
          </select>
        </label>
      </div>

      {/* 4 KPI Telemetry Cards */}
      <div className="stitch-kpi-grid" style={{ marginTop: 0 }}>
        <article className="stitch-kpi">
          <div className="stitch-kpi-heading">
            <span>NET DEMAND SHIFT</span>
            <span className="stitch-kpi-tag">STRONG POSITIVE BIAS</span>
          </div>
          <strong>+18.4% <small>(+42 covers tonight)</small></strong>
          <div className="stitch-kpi-foot">
            <span>Weather + Gala Confluence</span>
            <span className="stitch-kpi-positive">+284 / 7-Day</span>
          </div>
        </article>

        <article className="stitch-kpi">
          <div className="stitch-kpi-heading">
            <span>ACTIVE EXTERNAL DRIVERS</span>
            <span className="stitch-kpi-tag">4 MACRO FEEDS</span>
          </div>
          <strong>4 High Impact</strong>
          <div className="stitch-kpi-foot">
            <span>1 Weather · 2 Civic · 1 Supply</span>
            <span className="stitch-kpi-positive">Synced</span>
          </div>
        </article>

        <article className="stitch-kpi">
          <div className="stitch-kpi-heading">
            <span>MARGIN VOLATILITY INDEX</span>
            <span className="stitch-kpi-tag stitch-kpi-tag-warn">LOW-MED RISK</span>
          </div>
          <strong>3.2% <small>commodity gap</small></strong>
          <div className="stitch-kpi-foot">
            <span>Poultry +4.2% / Dairy -1.5%</span>
            <span className="stitch-kpi-positive">Hedging OK</span>
          </div>
        </article>

        <article className="stitch-kpi">
          <div className="stitch-kpi-heading">
            <span>PACING DISRUPTION RISK</span>
            <span className="stitch-kpi-tag">OPTIMAL</span>
          </div>
          <strong>8.5% <small>turn friction</small></strong>
          <div className="stitch-kpi-foot">
            <span>Transit buffer staged</span>
            <span className="stitch-kpi-positive">Smooth</span>
          </div>
        </article>
      </div>

      {/* Autonomous Mitigation Package Banner */}
      <section className="panel" style={{ background: 'linear-gradient(110deg, #EDF8EE 0%, #FFFFFF 70%)', marginBottom: 18, border: '1px solid #D8EBD9' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: '#174B32', color: '#fff', display: 'grid', placeItems: 'center' }}>
              <Zap style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <strong style={{ fontSize: 13, color: '#174B32' }}>Autonomous Tactical Prep Package Available</strong>
              <p style={{ margin: '2px 0 0', fontSize: 11, color: '#687E6F' }}>
                Pacing compression for 64 Symphony Gala covers pre-staged · Chicken Biryani par adjusted (+15 plates) · Spices reorder triggered.
              </p>
            </div>
          </div>
          <button className="primary-button" type="button" onClick={handleDeployMitigations}>
            <Zap style={{ width: 14, height: 14 }} /> Deploy All Mitigations
          </button>
        </div>
      </section>

      {/* 4 Detailed Macro Factor Cards */}
      <div className="stitch-factor-grid">
        <article className="stitch-factor-card">
          <span className="stitch-factor-icon"><Sun /></span>
          <div>
            <small>LOCAL METEOROLOGY</small>
            <strong>Clear Evening · 72°F</strong>
            <p>Patio seating unlocked (+18 covers). Rain comfort index at baseline.</p>
          </div>
          <span className="stitch-factor-state connected">CONNECTED</span>
        </article>

        <article className="stitch-factor-card">
          <span className="stitch-factor-icon"><Theater /></span>
          <div>
            <small>CIVIC & CULTURAL EVENTS</small>
            <strong>Symphony Gala 21:00</strong>
            <p>+24 VIP pre-theater diners arriving between 18:30 and 19:45.</p>
          </div>
          <span className="stitch-factor-state connected">HIGH IMPACT</span>
        </article>

        <article className="stitch-factor-card">
          <span className="stitch-factor-icon"><Truck /></span>
          <div>
            <small>COMMODITY VOLATILITY</small>
            <strong>Spices & Whole Ingredients</strong>
            <p>Whole spices supply lead time extended +1 day due to transit re-routing.</p>
          </div>
          <span className="stitch-factor-state connected">ACTIVE</span>
        </article>
      </div>

      {/* Interactive Scenario Simulator */}
      <section className="panel data-panel">
        <div className="section-kicker"><Activity /> What-If Scenario Simulator</div>
        <h2>Model Demand & Preparation Elasticity</h2>
        <p className="muted-copy">
          Simulate a demand surge or drop across all dishes and preview the impact on prep quantities, stockout risk, and food waste before applying.
        </p>

        <div style={{ margin: '18px 0', padding: 18, background: '#F7FAF5', borderRadius: 12, border: '1px solid #E2EEE2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, fontSize: 12 }}>
            <span style={{ fontWeight: 700, color: '#174B32' }}>Adjust Customer Demand Shift</span>
            <strong style={{ fontSize: 16, color: '#174B32' }}>{demandShift > 0 ? `+${demandShift}%` : `${demandShift}%`}</strong>
          </div>
          <input
            type="range"
            min="-30"
            max="60"
            step="5"
            value={demandShift}
            onChange={(e) => setDemandShift(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#174B32' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#78897B', marginTop: 4 }}>
            <span>-30% Drop</span>
            <span>0% Baseline</span>
            <span>+60% Surge</span>
          </div>
        </div>

        <div className="stitch-kpi-grid" style={{ margin: '16px 0' }}>
          <article className="stitch-kpi">
            <div className="stitch-kpi-heading"><span>PROJECTED DEMAND</span><span className="stitch-kpi-tag">SIMULATED</span></div>
            <strong>{simulated.projectedDemand.toLocaleString('en-IN')} <small>plates</small></strong>
            <div className="stitch-kpi-foot"><span>Across full menu</span><span>{demandShift >= 0 ? 'Surge' : 'Drop'}</span></div>
          </article>

          <article className="stitch-kpi">
            <div className="stitch-kpi-heading"><span>RECOMMENDED PREP</span><span className="stitch-kpi-tag">ADDITIONAL</span></div>
            <strong>+{simulated.recommendedPreparation} <small>plates</small></strong>
            <div className="stitch-kpi-foot"><span>Next batch sizing</span><span>Adaptive</span></div>
          </article>

          <article className="stitch-kpi">
            <div className="stitch-kpi-heading"><span>STOCKOUT RISK</span><span className="stitch-kpi-tag stitch-kpi-tag-warn">{simulated.stockoutRisk}</span></div>
            <strong>{simulated.ingredientPressure.length} <small>items at risk</small></strong>
            <div className="stitch-kpi-foot"><span>{simulated.ingredientPressure.join(', ') || 'Nominal'}</span><span>Stock pressure</span></div>
          </article>

          <article className="stitch-kpi">
            <div className="stitch-kpi-heading"><span>PROJECTED WASTE</span><span className="stitch-kpi-tag">ESTIMATED</span></div>
            <strong>{simulated.projectedWasteKg.toFixed(1)} <small>kg</small></strong>
            <div className="stitch-kpi-foot"><span>₹{Math.round(simulated.projectedWasteCost).toLocaleString('en-IN')} cost</span><span>Controlled</span></div>
          </article>
        </div>

        <div className="setting-row">
          <strong>AI Operational Rationale</strong>
          <span>{simulated.explanation}</span>
        </div>

        <div className="heading-actions" style={{ marginTop: 18 }}>
          <button
            className="outline-button"
            type="button"
            onClick={() => {
              setDemandShift(0)
              dispatch({ type: 'reset-scenario' })
            }}
          >
            <RotateCcw /> Reset Scenario
          </button>
          <button
            className="primary-button"
            type="button"
            onClick={() => {
              dispatch({ type: 'scenario', scenario: { customerChange: demandShift } })
              dispatch({ type: 'apply-plan' })
            }}
          >
            <Check /> Apply Preparation Plan to Kitchen
          </button>
        </div>
      </section>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                      AI COPILOT & AUTONOMOUS STRATEGY                      */
/* -------------------------------------------------------------------------- */

function AICopilotPage() {
  const { state, dispatch } = usePlateIQ()
  const context = getCopilotContext(state)
  const [activeTab, setActiveTab] = useState<'dinner' | 'weekend' | 'wine'>('dinner')
  const [customPrompt, setCustomPrompt] = useState('')
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'ai'; text: string; action?: string }>>([
    {
      role: 'ai',
      text: `Good evening Chef. Chicken Biryani order velocity is running +14.2% above the lunch par. I recommend scheduling Batch #2 (+${state.batches[0]?.quantity ?? 30} plates) immediately to avoid a 45-minute ticket stall during the 19:30 rush.`,
      action: 'Start Batch #2',
    },
  ])

  const quickPrompts = [
    'Simulate +20% cover surge for dinner',
    'Optimize biryani batch yield vs waste',
    'Review low-stock ingredient shortages',
    'Mitigate food-waste risk on perishable proteins',
  ]

  const handleSendPrompt = (promptText: string) => {
    if (!promptText.trim()) return
    const userMsg = promptText.trim()
    setCustomPrompt('')

    let aiReply = ''
    let actionLabel = ''

    if (userMsg.toLowerCase().includes('surge')) {
      aiReply = 'Simulated +20% surge: projected demand increases to 148 plates. Recommend advancing Hot Line prep batches by 25 minutes and placing Whole Spices on emergency order.'
      actionLabel = 'Apply Surge Strategy'
    } else if (userMsg.toLowerCase().includes('waste') || userMsg.toLowerCase().includes('yield')) {
      aiReply = 'Yield analysis: Overproduction accounts for 62% of recorded waste. Transitioning to 20-portion progressive batches will reduce food waste by 3.8 kg (₹570/day).'
      actionLabel = 'Enforce 20-Portion Batches'
    } else if (userMsg.toLowerCase().includes('stock') || userMsg.toLowerCase().includes('shortage')) {
      aiReply = 'Shortage scan: Whole Spices (0.8 days left) and Tomatoes (1.5 days left) are below safe thresholds. Reorder queue has 2 POs drafted.'
      actionLabel = 'Dispatch Vendor Orders'
    } else {
      aiReply = `Synthesizing operational telemetry for "${userMsg}": Kitchen capacity is at ${state.stations[0]?.capacity ?? 86}%. Current inventory and prep batches can support up to 134 covers without stockout risk.`
      actionLabel = 'Update Kitchen Plan'
    }

    setChatHistory((prev) => [
      ...prev,
      { role: 'user', text: userMsg },
      { role: 'ai', text: aiReply, action: actionLabel },
    ])
  }

  return (
    <div className="page-body stitch-workspace-page stitch-page-copilot">
      {/* Top Header */}
      <div className="stitch-page-intro">
        <div>
          <div className="stitch-page-kicker">
            <span className="stitch-live-dot" /> AUTONOMOUS CULINARY REASONING ENGINE
          </div>
          <h1>Culinary AI Copilot & Strategy Hub</h1>
          <p>
            Context-aware reasoning engine synthesizing live ticket pacing, station capacity, ingredient yield curves, and weather demand shifts.
          </p>
        </div>
        <div className="stitch-page-status">
          <span className="stitch-live-dot" /> 98.8% Reasoning Fidelity • Autonomous Dispatch Armed
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="stitch-kpi-grid" style={{ marginTop: 0 }}>
        <article className="stitch-kpi">
          <div className="stitch-kpi-heading">
            <span>YIELD COST SAVED</span>
            <span className="stitch-kpi-tag">+18.4% WOW</span>
          </div>
          <strong>+₹3,840.00</strong>
          <div className="stitch-kpi-foot">
            <span>14 autonomous actions</span>
            <span className="stitch-kpi-positive">Monitored</span>
          </div>
        </article>

        <article className="stitch-kpi">
          <div className="stitch-kpi-heading">
            <span>PENDING INTERVENTIONS</span>
            <span className="stitch-kpi-tag stitch-kpi-tag-warn">1 CRITICAL</span>
          </div>
          <strong>{state.recommendations.length} Pending</strong>
          <div className="stitch-kpi-foot">
            <span>{state.inventory.filter(i => i.status === 'Critical').length} critical stock risks</span>
            <span className="stitch-kpi-positive">Actionable</span>
          </div>
        </article>

        <article className="stitch-kpi">
          <div className="stitch-kpi-heading">
            <span>REASONING INGESTION</span>
            <span className="stitch-kpi-tag">EDGE TELEMETRY</span>
          </div>
          <strong>42 <small>ms</small></strong>
          <div className="stitch-kpi-foot">
            <span>3 active kitchen stations</span>
            <span className="stitch-kpi-positive">Real-time</span>
          </div>
        </article>

        <article className="stitch-kpi">
          <div className="stitch-kpi-heading">
            <span>COVER VELOCITY</span>
            <span className="stitch-kpi-tag">LIVE DINNER</span>
          </div>
          <strong>{state.demo.orders} <small>covers</small></strong>
          <div className="stitch-kpi-foot">
            <span>{state.demo.ordersPerMinute.toFixed(1)} orders/min</span>
            <span className="stitch-kpi-positive">Tracking</span>
          </div>
        </article>
      </div>

      {/* Main Asymmetric Grid */}
      <div className="dashboard-grid" style={{ gridTemplateColumns: 'minmax(0, 1.4fr) minmax(320px, 0.8fr)' }}>
        {/* Left Column: Conversational Command & Strategy Runner */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Strategy Scenario Switcher */}
          <div style={{ display: 'flex', gap: 6, background: '#fff', padding: 6, borderRadius: 12, border: '1px solid #DCE9DD' }}>
            <button
              type="button"
              className={activeTab === 'dinner' ? 'primary-button' : 'outline-button'}
              onClick={() => setActiveTab('dinner')}
              style={{ flex: 1, justifyContent: 'center' }}
            >
              <Zap style={{ width: 14, height: 14 }} /> Live Dinner Optimization
            </button>
            <button
              type="button"
              className={activeTab === 'weekend' ? 'primary-button' : 'outline-button'}
              onClick={() => setActiveTab('weekend')}
              style={{ flex: 1, justifyContent: 'center' }}
            >
              <Layers style={{ width: 14, height: 14 }} /> Weekend Pre-Prep
            </button>
            <button
              type="button"
              className={activeTab === 'wine' ? 'primary-button' : 'outline-button'}
              onClick={() => setActiveTab('wine')}
              style={{ flex: 1, justifyContent: 'center' }}
            >
              <UtensilsCrossed style={{ width: 14, height: 14 }} /> Margin Rebalancing
            </button>
          </div>

          {/* Quick Prompts */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                className="outline-button"
                style={{ fontSize: 11, padding: '6px 10px', background: '#F8FBF7' }}
                onClick={() => handleSendPrompt(prompt)}
              >
                <Sparkles style={{ width: 12, height: 12, color: '#16834B' }} /> {prompt}
              </button>
            ))}
          </div>

          {/* Interactive Chat & Reasoning Stream */}
          <section className="panel" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="section-kicker"><Sparkles /> Interactive Culinary Strategy Stream</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 420, overflowY: 'auto', paddingRight: 4 }}>
              {chatHistory.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: 14,
                    borderRadius: 12,
                    background: msg.role === 'user' ? '#F0F7EF' : '#FFFFFF',
                    border: msg.role === 'user' ? '1px solid #D6EAD7' : '1px solid #E2E8DF',
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '92%',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, fontSize: 10, fontWeight: 700, color: msg.role === 'user' ? '#174B32' : '#006D40' }}>
                    {msg.role === 'user' ? <Users style={{ width: 12, height: 12 }} /> : <Sparkles style={{ width: 12, height: 12 }} />}
                    <span>{msg.role === 'user' ? 'Chef Marcus Vance' : 'PlateIQ Copilot'}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 12, lineHeight: 1.6, color: '#17231B' }}>{msg.text}</p>
                  {msg.action && (
                    <button
                      className="primary-button"
                      type="button"
                      style={{ marginTop: 10, fontSize: 11, padding: '6px 12px' }}
                      onClick={() => {
                        dispatch({ type: 'batch', batchId: state.batches[0]?.id })
                      }}
                    >
                      <Check style={{ width: 12, height: 12 }} /> {msg.action}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Custom Prompt Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendPrompt(customPrompt)
              }}
              style={{ display: 'flex', gap: 8, marginTop: 8 }}
            >
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Ask Copilot (e.g. 'How can we minimize naan waste during dinner?')..."
                style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '1px solid #DCE5DA', fontSize: 12 }}
              />
              <button className="primary-button" type="submit">
                Ask Copilot <ArrowRight style={{ width: 14, height: 14 }} />
              </button>
            </form>
          </section>
        </div>

        {/* Right Column: Reasoning Telemetry & Autonomous Actions */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Live Autonomous Interventions */}
          <section className="panel">
            <div className="section-kicker"><Zap /> Autonomous Interventions Queue</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
              {state.recommendations.map((rec) => (
                <div key={rec.id} style={{ padding: 12, borderRadius: 10, background: '#F8FBF7', border: '1px solid #DCEADC' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: 12, color: '#174B32' }}>{rec.title}</strong>
                    <span className="status-badge">{rec.confidence}% conf</span>
                  </div>
                  <p style={{ margin: '4px 0 8px', fontSize: 11, color: '#667A6B', lineHeight: 1.5 }}>{rec.description}</p>
                  <button
                    type="button"
                    className="primary-button"
                    style={{ fontSize: 10, padding: '6px 10px', width: '100%', justifyContent: 'center' }}
                    onClick={() => {
                      if (rec.dishId) {
                        const batch = state.batches.find(b => b.dishId === rec.dishId && b.status !== 'Completed')
                        if (batch) dispatch({ type: 'batch', batchId: batch.id })
                      }
                    }}
                  >
                    {rec.actionLabel ?? 'Execute Action'} <ArrowRight style={{ width: 12, height: 12 }} />
                  </button>
                </div>
              ))}

              {state.recommendations.length === 0 && (
                <p className="muted-copy" style={{ margin: '8px 0' }}>No pending interventions. System running optimally.</p>
              )}
            </div>
          </section>

          {/* Real-Time Reasoning Log */}
          <section className="panel">
            <div className="section-kicker"><Activity /> Reasoning Telemetry Log</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
              {state.events.slice(0, 5).map((evt) => (
                <div key={evt.id} style={{ padding: '8px 0', borderBottom: '1px solid #EAF0E8' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#7E8F82' }}>
                    <span>{evt.timestamp}</span>
                    <span style={{ fontWeight: 700, color: evt.severity === 'critical' ? '#B85047' : '#174B32' }}>{evt.type}</span>
                  </div>
                  <strong style={{ fontSize: 11, display: 'block', margin: '2px 0', color: '#17231B' }}>{evt.title}</strong>
                  <span style={{ fontSize: 10, color: '#687A6E', lineHeight: 1.4 }}>{evt.description}</span>
                </div>
              ))}
              {state.events.length === 0 && (
                <p className="muted-copy">No operational telemetry events logged yet.</p>
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
