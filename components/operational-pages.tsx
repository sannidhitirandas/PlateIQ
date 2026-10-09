'use client';

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Check,
  ChefHat,
  Cloud,
  Download,
  Filter,
  Layers,
  Package,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  Sliders,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Users,
  Utensils,
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
  BarChart,
  Bar,
} from 'recharts'
import { usePlateIQ, usePlateIQMetrics } from './plateiq-state'
import { wasteSummary } from '@/lib/waste-engine'
import { getAnalyticsMetrics, getDishOperationalContext, getKitchenMetrics } from '@/lib/selectors'
import {
  getAnalyticsMetrics,
  getDishOperationalContext,
  getKitchenMetrics,
  getLiveOperationsMetrics,
  getRestaurantMetrics,
} from '@/lib/selectors'

/* -------------------------------------------------------------------------- */
/*                                PAGE FRAME                                  */
/* -------------------------------------------------------------------------- */

function PageFrame({
  title,
  subtitle,
  children,
  badge = 'Kitchen Operations',
}: {
  title: string
  subtitle: string
  children: React.ReactNode
  badge?: string
}) {
  const pageClass = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  return (
    <div className={`page-body stitch-workspace-page stitch-page-${pageClass}`}>
      <div className="stitch-page-intro">
        <div>
          <div className="stitch-page-kicker">
            PLATEIQ CULINARY OPERATIONS <span className="separator">/</span> WORKSPACE
          </div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        <div className="stitch-page-status">
          {badge}
        </div>
      </div>
      {children}
    </div>
  )
}

function Status({ children }: { children: React.ReactNode }) {
  const text = String(children)
  const isWarn = text === 'At Risk' || text === 'Low' || text === 'Critical' || text === 'Blocked'
  const isBusy = text === 'Busy' || text === 'Preparing' || text === 'In Preparation'
  return (
    <span className={`status-badge ${isWarn ? 'orange' : ''} ${isBusy ? 'busy' : ''}`}>
      {children}
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/*                    PAGE 1: LIVE OPERATIONS / KDS EXPEDITE                  */
/* -------------------------------------------------------------------------- */

export function LiveOperationsPage() {
  const { state, dispatch } = usePlateIQ()
  const metrics = getLiveOperationsMetrics(state)
  const tickets = state.batches.map((batch, index) => ({
    ...batch,
    ticket: `KDS-${String(index + 1).padStart(3, '0')}`,
    dish: state.dishes.find((dish) => dish.id === batch.dishId),
  })).filter((ticket) => ticket.dish)

  const stationForCategory = (category: string) => {
    if (category === 'Breads') return 'Bread & tandoor'
    if (category === 'Sides') return 'Cold prep'
    return 'Hot line'
  }
  const progressForStatus = (status: string) =>
    status === 'Recommended' ? 20 : status === 'In Preparation' ? 65 : status === 'Ready' ? 90 : 100
  const actionForStatus = (status: string) =>
    status === 'Recommended'
      ? 'Start preparation'
      : status === 'In Preparation'
      ? 'Mark ready'
      : status === 'Ready'
      ? 'Complete ticket'
      : 'Completed'

  return (
    <PageFrame
      title="Kitchen Display System & Expedite Pass"
      subtitle="Production tickets, station load status, and batch progression across active kitchen stations."
      badge="Expedite Queue"
    >
      {/* 4 KPI Cards */}
      <div className="stitch-kpi-grid" style={{ marginTop: 0 }}>
        <article className="stitch-kpi">
          <div className="stitch-kpi-heading"><span>ACTIVE TICKETS</span><span className="stitch-kpi-tag">QUEUE</span></div>
          <strong>{tickets.filter(t => t.status !== 'Completed').length} <small>batches</small></strong>
          <div className="stitch-kpi-foot"><span>{tickets.length} total shift batches</span><span className="stitch-kpi-positive">Scheduled</span></div>
        </article>

        <article className="stitch-kpi">
          <div className="stitch-kpi-heading"><span>TOTAL PORTIONS</span><span className="stitch-kpi-tag">TARGET</span></div>
          <strong>{tickets.reduce((sum, t) => sum + t.quantity, 0).toLocaleString('en-IN')} <small>plates</small></strong>
          <div className="stitch-kpi-foot"><span>Across scheduled menu items</span><span className="stitch-kpi-positive">Planned</span></div>
        </article>

        <article className="stitch-kpi">
          <div className="stitch-kpi-heading"><span>MENU ITEMS</span><span className="stitch-kpi-tag">ACTIVE</span></div>
          <strong>{new Set(tickets.map(t => t.dishId)).size} <small>dishes</small></strong>
          <div className="stitch-kpi-foot"><span>Covering {state.stations.length} stations</span><span className="stitch-kpi-positive">Allocated</span></div>
        </article>

        <article className="stitch-kpi">
          <div className="stitch-kpi-heading"><span>STATION CAPACITY</span><span className="stitch-kpi-tag">LOAD</span></div>
          <strong>{metrics.capacity}%</strong>
          <div className="stitch-kpi-foot"><span>Station load average</span><span className="stitch-kpi-positive">Monitored</span></div>
        </article>
      </div>

      {/* KDS Expedite Pass Board */}
      <section className="panel kds-board" style={{ marginTop: 16 }}>
        <div className="kds-board-heading">
          <div>
            <div className="section-kicker"><Activity /> KITCHEN DISPLAY SYSTEM</div>
            <h2>Expedite Pass Queue</h2>
            <p>Move each batch ticket through its lifecycle: Recommended → In Preparation → Ready → Completed.</p>
          </div>
          <span className="kds-demo-label">EXPEDITE QUEUE</span>
        </div>

        <div className="kds-legend">
          <span><i className="kds-dot recommended" /> Recommended</span>
          <span><i className="kds-dot preparing" /> In preparation</span>
          <span><i className="kds-dot ready" /> Ready / Completed</span>
        </div>

        {tickets.length === 0 ? (
          <div className="kds-empty">No preparation tickets are available in the current state.</div>
        ) : (
          <div className="kds-grid">
            {tickets.map((ticket) => {
              const dish = ticket.dish!
              const completed = ticket.status === 'Completed'
              return (
                <article className={`kds-ticket ${ticket.status.toLowerCase().replaceAll(' ', '-')}`} key={ticket.id}>
                  <div className="kds-ticket-top">
                    <span className="kds-ticket-id">{ticket.ticket} · BATCH #{ticket.number}</span>
                    <Status>{ticket.status}</Status>
                  </div>
                  <h3>{dish.name}</h3>
                  <p className="kds-station"><Package aria-hidden="true" /> {stationForCategory(dish.category)}</p>
                  <div className="kds-ticket-stats">
                    <div><span>Portions</span><strong>+{ticket.quantity} plates</strong></div>
                    <div><span>Lead time</span><strong>{dish.leadTimeMinutes} min</strong></div>
                  </div>
                  <div className="kds-progress-track" aria-label={`${progressForStatus(ticket.status)} percent complete`}>
                    <span style={{ width: `${progressForStatus(ticket.status)}%` }} />
                  </div>
                  <button
                    className={completed ? 'outline-button kds-action' : 'primary-button kds-action'}
                    type="button"
                    disabled={completed}
                    onClick={() => dispatch({ type: 'batch', batchId: ticket.id })}
                  >
                    {actionForStatus(ticket.status)} {completed ? <Check aria-hidden="true" /> : null}
                  </button>
                </article>
              )
            })}
          </div>
        )}
      </section>

      {/* Station Readiness & Recent Events */}
      <div className="dashboard-grid kds-support-grid" style={{ marginTop: 16 }}>
        <section className="panel">
          <div className="section-kicker"><Activity /> Station Load & Capacity</div>
          <h2>Active Kitchen Stations</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
            {state.stations.map((station) => (
              <div className="setting-row" key={station.id}>
                <div>
                  <strong>{station.name}</strong>
                  <small className="kds-row-detail">{station.capacity}% capacity load</small>
                </div>
                <Status>{station.status === 'Busy' ? 'Preparing' : station.status === 'At Risk' ? 'Needs attention' : 'Ready'}</Status>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="section-kicker"><Sparkles /> Operational Event Stream</div>
          <h2>Recent Expedite Activity</h2>
          {state.events.length === 0 ? (
            <p className="muted-copy">No kitchen events logged yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
              {state.events.slice(0, 5).map((event) => (
                <div className="setting-row" key={event.id}>
                  <div>
                    <strong>{event.title}</strong>
                    <small className="kds-row-detail">{event.timestamp} · {event.description}</small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </PageFrame>
  )
}

/* -------------------------------------------------------------------------- */
/*                    PAGE 2: BRIGADE TASKS & PREP PLAN                       */
/* -------------------------------------------------------------------------- */

export function KitchenPlannerPage() {
  const { state, dispatch } = usePlateIQ()
  const [selected, setSelected] = useState<string | null>(null)
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([])
  const selectedBatch = state.batches.find((batch) => batch.id === selected)
  const selectedDish = selectedBatch ? state.dishes.find((dish) => dish.id === selectedBatch.dishId) : undefined
  const kitchen = getKitchenMetrics(state)
  const selectedContext = selectedDish ? getDishOperationalContext(state, selectedDish.id) : undefined

  const shiftTasks = [
    { id: 'temps', title: 'Record walk-in & line refrigeration temps', detail: 'HACCP Safety · Before service', priority: 'Critical', owner: 'Sous chef' },
    { id: 'mise', title: 'Verify station mise en place & garnish containers', detail: 'Line Prep · Before service rush', priority: 'High', owner: 'Station leads' },
    { id: 'allergens', title: 'Check allergy separation & sanitation stations', detail: 'Food Safety · Shift inspection', priority: 'Critical', owner: 'Expediter' },
    { id: 'stock', title: 'Audit low-stock ingredients & par levels', detail: 'Inventory · Pre-service check', priority: 'High', owner: 'Store lead' },
    { id: 'handover', title: 'Complete brigade shift briefing & cover targets', detail: 'Brigade · Shift handover', priority: 'Normal', owner: 'Head chef' },
  ]
  const completedTasks = shiftTasks.filter((task) => completedTaskIds.includes(task.id)).length

  return (
    <PageFrame
      title="Brigade Tasks & Operations Management"
      subtitle="Shift readiness checklist, station assignments, and progressive batch preparation schedule."
      badge="Shift Planning"
    >
      {/* Before-Service Checklist Panel */}
      <section className="panel brigade-panel">
        <div className="brigade-heading">
          <div>
            <div className="section-kicker"><Check /> SHIFT READINESS CHECKLIST</div>
            <h2>Before-Service Operational Priorities</h2>
            <p>Coordinate station readiness and critical food safety compliance.</p>
          </div>
          <div className="brigade-progress-summary">
            <strong>{completedTasks}/{shiftTasks.length}</strong>
            <span>tasks completed</span>
          </div>
        </div>

        <div className="brigade-progress-track">
          <span style={{ width: `${(completedTasks / shiftTasks.length) * 100}%` }} />
        </div>

        <div className="brigade-task-list">
          {shiftTasks.map((task) => {
            const done = completedTaskIds.includes(task.id)
            return (
              <label className={`brigade-task ${done ? 'done' : ''}`} key={task.id}>
                <input
                  type="checkbox"
                  checked={done}
                  onChange={() =>
                    setCompletedTaskIds((current) =>
                      done ? current.filter((id) => id !== task.id) : [...current, task.id]
                    )
                  }
                />
                <span className="brigade-task-copy">
                  <strong>{task.title}</strong>
                  <small>{task.detail} · {task.owner}</small>
                </span>
                <span className={`brigade-priority ${task.priority.toLowerCase()}`}>{task.priority}</span>
              </label>
            )
          })}
        </div>
      </section>

      {/* Progressive Preparation Plan Table */}
      <section className="panel data-panel" style={{ marginTop: 16 }}>
        <div className="section-kicker">
          <Package /> Progressive Batch Schedule · {kitchen.activeBatches.length} active batches
        </div>
        <h2>Batch Sizing & Ingredient Constraints</h2>
        <p className="muted-copy">Click any row to inspect shortage risks and advance the next batch.</p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Dish</th>
                <th>Category</th>
                <th>Forecast Target</th>
                <th>Batch Par</th>
                <th>Prepared</th>
                <th>Next Batch</th>
                <th>Lead Time</th>
                <th>Waste Risk</th>
                <th>Stockout</th>
                <th>Readiness</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {state.dishes.map((dish) => {
                const forecast = state.forecasts.find((item) => item.dishId === dish.id)
                const batch = state.batches.find((item) => item.dishId === dish.id)
                const context = getDishOperationalContext(state, dish.id)
                return (
                  <tr
                    key={dish.id}
                    onClick={() => batch && setSelected(batch.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td><strong>{dish.name}</strong></td>
                    <td>{dish.category}</td>
                    <td>{forecast?.forecast ?? dish.forecast} plates</td>
                    <td>{dish.batchSize} plates</td>
                    <td>{dish.prepared} plates</td>
                    <td>+{context?.recommendedQuantity ?? batch?.quantity ?? dish.nextBatch} plates</td>
                    <td>{dish.leadTimeMinutes} min</td>
                    <td>{context?.risk?.level ?? 'Low'}</td>
                    <td>{context?.risk?.stockoutRisk ?? 'Nominal'}</td>
                    <td><span className="stitch-kpi-positive">{context?.batchImpact.ready ? 'Ready' : 'Blocked'}</span></td>
                    <td><Status>{batch?.status || 'No Batch'}</Status></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Timeline Schedule */}
      <section className="panel timeline-panel" style={{ marginTop: 16 }}>
        <div className="section-kicker">Preparation Timeline</div>
        <h2>Current Batch Pacing Schedule</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
          {state.batches.map((batch) => {
            const dish = state.dishes.find((item) => item.id === batch.dishId)
            return (
              <div className="timeline-row" key={batch.id}>
                <strong>{dish?.name || batch.dishId}</strong>
                <span style={{ width: `${Math.min(100, Math.max(15, batch.quantity * 2.5))}%` }} />
              </div>
            )
          })}
        </div>
      </section>

      {/* Batch Details Drawer */}
      {selectedBatch && selectedDish && selectedContext && (
        <div className="drawer-backdrop" role="presentation" onClick={() => setSelected(null)}>
          <aside
            className="drawer"
            role="dialog"
            aria-modal="true"
            aria-label={`Batch ${selectedBatch.number} details`}
            onClick={(event) => event.stopPropagation()}
          >
            <button className="drawer-close" type="button" onClick={() => setSelected(null)}>✕ Close</button>
            <div className="section-kicker">Batch Details & Inventory Allocation</div>
            <h2>{selectedDish.name} · Batch #{selectedBatch.number}</h2>
            <p className="muted-copy">
              Quantity: <strong>+{selectedBatch.quantity} plates</strong> · Lead Time: <strong>{selectedDish.leadTimeMinutes} min</strong> · Station: <strong>{selectedDish.category}</strong>
            </p>

            <div style={{ margin: '14px 0' }}>
              <Status>{selectedBatch.status}</Status>
            </div>

            <div className="setting-row">
              <span>Waste Risk</span>
              <strong>{selectedContext.risk?.level ?? 'Low'}</strong>
            </div>
            <div className="setting-row">
              <span>Stockout Risk</span>
              <strong>{selectedContext.risk?.stockoutRisk ?? 'Nominal'}</strong>
            </div>

            <div style={{ marginTop: 14 }}>
              <strong style={{ fontSize: 11, color: '#174B32' }}>Ingredient Requirements:</strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                {Object.entries(selectedContext.batchImpact.requirements).map(([id, amount]) => (
                  <span key={id} className="status-badge">
                    {id}: {amount} kg
                  </span>
                ))}
              </div>
            </div>

            {selectedContext.batchImpact.shortages.length > 0 && (
              <div style={{ marginTop: 14, padding: 10, background: '#FFEBEA', borderRadius: 8, border: '1px solid #FFDAD6' }}>
                <strong style={{ fontSize: 11, color: '#BA1A1A' }}>Shortage Alert:</strong>
                <p style={{ margin: '4px 0 0', fontSize: 10, color: '#93000A' }}>
                  {selectedContext.batchImpact.shortages.map((s) => `${s.name} (Available: ${s.available} / Need: ${s.required})`).join(', ')}
                </p>
              </div>
            )}

            <div className="drawer-actions" style={{ marginTop: 22 }}>
              <button
                className="primary-button"
                type="button"
                disabled={selectedContext.batchImpact.shortages.length > 0}
                onClick={() => {
                  dispatch({ type: 'batch', batchId: selectedBatch.id })
                  setSelected(null)
                }}
              >
                {selectedBatch.status === 'Recommended'
                  ? 'Start Batch Preparation'
                  : selectedBatch.status === 'In Preparation'
                  ? 'Mark Batch Ready'
                  : selectedBatch.status === 'Ready'
                  ? 'Complete Batch Ticket'
                  : 'Batch Completed'} <Check />
              </button>
            </div>
          </aside>
        </div>
      )}
    </PageFrame>
  )
}

/* -------------------------------------------------------------------------- */
/*             PAGE 3: DEMAND FORECASTING & MENU OPTIMIZATION                 */
/* -------------------------------------------------------------------------- */

export function DemandForecastPage() {
  const { state } = usePlateIQ()
  const [dishFilter, setDishFilter] = useState('All dishes')
  const [categoryFilter, setCategoryFilter] = useState('All categories')
  const [horizon, setHorizon] = useState('Sample week')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredDishes = state.dishes.filter((d) => {
    const matchesDish = dishFilter === 'All dishes' || d.name === dishFilter
    const matchesCat = categoryFilter === 'All categories' || d.category === categoryFilter
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesDish && matchesCat && matchesSearch
  })

  const sampleWeeklySeries = [
    { day: 'Mon', actual: 160, forecast: 165 },
    { day: 'Tue (Today)', actual: 182, forecast: 178 },
    { day: 'Wed', actual: null, forecast: 172 },
    { day: 'Thu', actual: null, forecast: 190 },
    { day: 'Fri', actual: null, forecast: 245 },
    { day: 'Sat', actual: null, forecast: 280 },
    { day: 'Sun', actual: null, forecast: 210 },
  ]
  const forecastData = horizon === 'Weekend focus'
    ? sampleWeeklySeries.slice(4)
    : horizon === 'Historical reference'
      ? sampleWeeklySeries.slice(0, 2)
      : sampleWeeklySeries
  const sampleForecasts = state.forecasts
  const planningTotal = sampleForecasts.reduce((sum, forecast) => sum + forecast.forecast, 0)
  const planningLowerBound = sampleForecasts.reduce((sum, forecast) => sum + forecast.lowerBound, 0)
  const planningUpperBound = sampleForecasts.reduce((sum, forecast) => sum + forecast.upperBound, 0)
  const recommendedPreparation = sampleForecasts.reduce((sum, forecast) => sum + forecast.recommendedPreparation, 0)

  return (
    <PageFrame
      title="Demand Forecast Planning"
      subtitle="Review local sample planning estimates and calculated preparation ranges. POS, weather, event, and margin data await backend integration."
      badge="Frontend sample data"
    >
      <div className="demo-banner" role="note">
        <div className="demo-icon"><AlertTriangle style={{ width: 17, height: 17 }} /></div>
        <div>
          <strong>Sample forecast workspace</strong>
          <span>Figures come from local mock data and frontend demo state. They are not restaurant predictions, live orders, or automatic updates.</span>
        </div>
      </div>

      {/* Sample series range selector */}
      <div className="filter-row" style={{ marginTop: 0, marginBottom: 16 }}>
        <label>
          Displayed sample range
          <select value={horizon} onChange={(e) => setHorizon(e.target.value)}>
            <option value="Sample week">Sample week</option>
            <option value="Weekend focus">Weekend focus</option>
            <option value="Historical reference">Historical reference</option>
          </select>
        </label>
      </div>

      {/* Sample planning metrics */}
      <div className="stitch-kpi-grid" style={{ marginTop: 0 }}>
        <article className="stitch-kpi">
          <div className="stitch-kpi-heading"><span>SAMPLE PLANNING TOTAL</span><span className="stitch-kpi-tag">LOCAL STATE</span></div>
          <strong>{planningTotal} <small>plates</small></strong>
          <div className="stitch-kpi-foot"><span>Across the sample menu</span><span className="stitch-kpi-positive">Planning only</span></div>
        </article>

        <article className="stitch-kpi">
          <div className="stitch-kpi-heading"><span>SAMPLE PLANNING RANGE</span><span className="stitch-kpi-tag">CALCULATED</span></div>
          <strong>{planningLowerBound}–{planningUpperBound} <small>plates</small></strong>
          <div className="stitch-kpi-foot"><span>From local planning ranges</span><span className="stitch-kpi-positive">Not calibrated</span></div>
        </article>

        <article className="stitch-kpi">
          <div className="stitch-kpi-heading"><span>SAMPLE MENU COVERAGE</span><span className="stitch-kpi-tag">MOCK MENU</span></div>
          <strong>{sampleForecasts.length} <small>dishes</small></strong>
          <div className="stitch-kpi-foot"><span>Local demonstration entries</span><span className="stitch-kpi-positive">No POS feed</span></div>
        </article>

        <article className="stitch-kpi">
          <div className="stitch-kpi-heading"><span>SUGGESTED SAMPLE PREP</span><span className="stitch-kpi-tag">CALCULATED</span></div>
          <strong>+{recommendedPreparation} <small>plates</small></strong>
          <div className="stitch-kpi-foot"><span>Does not change kitchen prep</span><span className="stitch-kpi-positive">Planning only</span></div>
        </article>
      </div>

      {/* Demand Curve Chart */}
      <section className="panel" style={{ marginTop: 16 }}>
        <div className="stitch-section-heading">
          <div>
            <div className="section-kicker"><Activity /> Sample weekly series</div>
            <h2>Sample Demand Trend</h2>
            <p>A fixed local series used to demonstrate the chart; it is not a production forecast or historical restaurant record.</p>
          </div>
          <span className="stitch-section-status">No live data connection</span>
        </div>

        <div style={{ height: 240, width: '100%', marginTop: 12 }}>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={forecastData} margin={{ top: 12, right: 12, left: -16, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#E4EAE2" strokeDasharray="3 4" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: '#6C7E72', fontSize: 11 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: '#6C7E72', fontSize: 11 }} width={38} />
              <Tooltip
                contentStyle={{
                  background: '#fff',
                  border: '1px solid #DCE5DA',
                  borderRadius: 12,
                  boxShadow: '0 8px 24px rgba(23,75,50,0.08)',
                  fontSize: 12,
                }}
              />
              <Line dataKey="forecast" stroke="#D8942F" strokeWidth={2.5} strokeDasharray="5 5" name="Sample forecast series" />
              <Line dataKey="actual" stroke="#16834B" strokeWidth={3} name="Sample historical reference" connectNulls={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Menu quadrant matrix */}
      <section className="panel" style={{ marginTop: 16 }}>
        <div className="section-kicker"><Utensils /> Menu quadrant matrix</div>
        <h2>Dish Performance Quadrant Matrix</h2>
        <p>Margin and validated popularity inputs are not available in the frontend demo, so dishes are not classified into these quadrants.</p>
        <div className="stitch-station-grid" style={{ marginTop: 12 }}>
          <article className="stitch-station-card">
            <div className="stitch-station-head"><span className="stitch-station-dot" /><span>HIGH DEMAND / HIGH MARGIN</span></div>
            <strong>Awaiting data</strong>
            <small>Requires connected sales and cost history.</small>
          </article>
          <article className="stitch-station-card">
            <div className="stitch-station-head"><span className="stitch-station-dot busy" /><span>HIGH DEMAND / LOW MARGIN</span></div>
            <strong>Awaiting data</strong>
            <small>Requires connected sales and cost history.</small>
          </article>
          <article className="stitch-station-card">
            <div className="stitch-station-head"><span className="stitch-station-dot warn" /><span>LOW DEMAND / HIGH MARGIN</span></div>
            <strong>Awaiting data</strong>
            <small>Requires connected sales and cost history.</small>
          </article>
          <article className="stitch-station-card">
            <div className="stitch-station-head"><span className="stitch-station-dot" /><span>LOW DEMAND / LOW MARGIN</span></div>
            <strong>Awaiting data</strong>
            <small>Requires connected sales and cost history.</small>
          </article>
        </div>
      </section>

      {/* Detailed Dish Forecast Table */}
      <section className="panel data-panel" style={{ marginTop: 16 }}>
        <div className="stitch-section-heading">
          <div>
            <div className="section-kicker"><Search /> Dish-level planning estimates</div>
            <h2>Sample Demand Forecast</h2>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <select value={dishFilter} onChange={(e) => setDishFilter(e.target.value)} aria-label="Filter by dish" style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #DCE5DA', fontSize: 11 }}>
              <option>All dishes</option>
              {state.dishes.map((dish) => <option key={dish.id}>{dish.name}</option>)}
            </select>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} aria-label="Filter by category" style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #DCE5DA', fontSize: 11 }}>
              <option>All categories</option>
              {[...new Set(state.dishes.map((dish) => dish.category))].map((category) => <option key={category}>{category}</option>)}
            </select>
            <input
              type="text"
              placeholder="Search dish name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #DCE5DA', fontSize: 11 }}
            />
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Dish</th>
                <th>Category</th>
                <th>Sample Estimate</th>
                <th>Sample Planning Range</th>
                <th>Sample Observed Orders</th>
                <th>Suggested Prep</th>
                <th>Integration Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredDishes.map((d) => {
                const f = state.forecasts.find((x) => x.dishId === d.id)
                return (
                  <tr key={d.id}>
                    <td><strong>{d.name}</strong></td>
                    <td>{d.category}</td>
                    <td>{f?.forecast ?? d.forecast} plates</td>
                    <td>{f?.lowerBound ?? d.lowerBound}–{f?.upperBound ?? d.upperBound} plates</td>
                    <td>{f?.actual ?? d.actualOrders} plates</td>
                    <td>+{f?.recommendedPreparation ?? d.nextBatch} plates</td>
                    <td><span className="status-badge orange">Awaiting backend integration</span></td>
                  </tr>
                )
              })}
              {filteredDishes.length === 0 && (
                <tr><td colSpan={7}>No sample dishes match the selected filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </PageFrame>
  )
}

/* -------------------------------------------------------------------------- */
/*                  PAGE 4: INVENTORY INTELLIGENCE                            */
/* -------------------------------------------------------------------------- */

export function InventoryPage() {
  const { state, dispatch } = usePlateIQ()
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [adjustItem, setAdjustItem] = useState<string | null>(null)
  const [adjustAmount, setAdjustAmount] = useState(1)

  const rows = state.inventory.filter((i) => {
    const matchesFilter = filter === 'All' || i.status === filter
    const matchesSearch = i.name.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })
  const averageDays = state.inventory.length
    ? state.inventory.reduce((a, i) => a + i.daysLeft, 0) / state.inventory.length
    : 0

  return (
    <PageFrame
      title="Inventory Planning"
      subtitle="Review local sample stock, usage, and reorder calculations. Inventory, POS, supplier, and purchasing integrations await backend connection."
      badge="Frontend sample data"
    >
      <div className="demo-banner" role="note">
        <div className="demo-icon"><AlertTriangle style={{ width: 17, height: 17 }} /></div>
        <div>
          <strong>Sample inventory workspace</strong>
          <span>Stock, usage, cost, reorder, and order-state figures come from local mock data. They are not connected to a restaurant inventory system or supplier.</span>
        </div>
      </div>

      {/* Sample inventory metrics */}
      <div className="stitch-kpi-grid" style={{ marginTop: 0 }}>
        <article className="stitch-kpi">
          <div className="stitch-kpi-heading"><span>SAMPLE INGREDIENTS</span><span className="stitch-kpi-tag">LOCAL DATA</span></div>
          <strong>{state.inventory.length} <small>items</small></strong>
          <div className="stitch-kpi-foot"><span>Sample pantry entries</span><span className="stitch-kpi-positive">Planning only</span></div>
        </article>

        <article className="stitch-kpi">
          <div className="stitch-kpi-heading"><span>SAMPLE LOW-STOCK FLAGS</span><span className="stitch-kpi-tag stitch-kpi-tag-warn">CALCULATED</span></div>
          <strong>{state.inventory.filter((i) => i.status === 'Low').length} <small>items</small></strong>
          <div className="stitch-kpi-foot"><span>From sample days-left rules</span><span className="stitch-kpi-positive">No purchase order</span></div>
        </article>

        <article className="stitch-kpi">
          <div className="stitch-kpi-heading"><span>SAMPLE CRITICAL FLAGS</span><span className="stitch-kpi-tag stitch-kpi-tag-warn">CALCULATED</span></div>
          <strong>{state.inventory.filter((i) => i.status === 'Critical').length} <small>items</small></strong>
          <div className="stitch-kpi-foot"><span>At or below 0.8 sample days</span><span className="stitch-kpi-positive">Planning review</span></div>
        </article>

        <article className="stitch-kpi">
          <div className="stitch-kpi-heading"><span>SAMPLE AVERAGE RUNWAY</span><span className="stitch-kpi-tag">CALCULATED</span></div>
          <strong>{averageDays.toFixed(1)} <small>days</small></strong>
          <div className="stitch-kpi-foot"><span>Sample stock ÷ daily usage</span><span className="stitch-kpi-positive">Local calculation</span></div>
        </article>
      </div>

      {/* Sample replenishment planning */}
      <section className="panel" style={{ marginTop: 16 }}>
        <div className="section-kicker"><Package /> Sample replenishment planning</div>
        <h2>Sample Reorder Candidates</h2>
        <p className="muted-copy">Candidates are calculated from local sample stock and usage. No purchase order is created or sent to a supplier.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12, marginTop: 12 }}>
          {state.inventory
            .filter((i) => i.status === 'Low' || i.status === 'Critical')
            .map((item) => (
              <div
                key={item.id}
                style={{
                  padding: 14,
                  borderRadius: 12,
                  background: item.status === 'Critical' ? '#FFF5F4' : '#FFFBF4',
                  border: item.status === 'Critical' ? '1px solid #FFDAD6' : '1px solid #F6DFC2',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <strong style={{ fontSize: 13, color: '#17231B' }}>{item.name}</strong>
                  <div style={{ fontSize: 11, color: '#687A6E', marginTop: 2 }}>
                    Sample stock: {item.currentStock.toFixed(1)} {item.unit} · {item.daysLeft.toFixed(1)} sample days
                  </div>
                  <span className={`status-badge ${item.status === 'Critical' ? 'orange' : ''}`} style={{ marginTop: 6 }}>
                    {item.status} planning flag · {item.orderStatus} demo state
                  </span>
                </div>

                {item.orderStatus === 'Ordered' ? (
                  <button
                    className="primary-button"
                    type="button"
                    style={{ fontSize: 10, padding: '6px 10px' }}
                    onClick={() => dispatch({ type: 'receive-stock', itemId: item.id, amount: item.reorderPoint })}
                  >
                    Simulate Receipt
                  </button>
                ) : (
                  <button
                    className="outline-button"
                    type="button"
                    style={{ fontSize: 10, padding: '6px 10px' }}
                    onClick={() => dispatch({ type: 'mark-ordered', itemId: item.id })}
                  >
                    Mark Sample Order
                  </button>
                )}
              </div>
            ))}
        </div>
      </section>

      {/* Inventory Table with Search and Filters */}
      <section className="panel data-panel" style={{ marginTop: 16 }}>
        <div className="stitch-section-heading">
          <div>
            <div className="section-kicker"><Layers /> Comprehensive Ingredient Inventory</div>
            <h2>Ingredient Levels & Burn Rate</h2>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search ingredient..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #DCE5DA', fontSize: 11 }}
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #DCE5DA', fontSize: 11 }}
            >
              <option value="All">All Statuses</option>
              <option value="Healthy">Healthy Stock</option>
              <option value="Low">Low Stock</option>
              <option value="Critical">Critical Stock</option>
            </select>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Ingredient</th>
                <th>Current Stock</th>
                <th>Reorder Par</th>
                <th>Burn Rate</th>
                <th>Days Left</th>
                <th>Unit Cost</th>
                <th>Status</th>
                <th>Order State</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((i) => (
                <tr key={i.id}>
                  <td><strong>{i.name}</strong></td>
                  <td>{i.currentStock.toFixed(1)} {i.unit}</td>
                  <td>{i.reorderPoint} {i.unit}</td>
                  <td>{i.dailyUsage} {i.unit}/day</td>
                  <td>
                    <span className={i.daysLeft <= 1 ? 'negative' : 'positive'}>
                      {i.daysLeft.toFixed(1)} days
                    </span>
                  </td>
                  <td>₹{i.unitCost}/{i.unit}</td>
                  <td><Status>{i.status}</Status></td>
                  <td>{i.orderStatus}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {i.orderStatus === 'Ordered' ? (
                        <button
                          className="primary-button"
                          type="button"
                          style={{ fontSize: 10, padding: '4px 8px' }}
                          onClick={() => dispatch({ type: 'receive-stock', itemId: i.id, amount: i.reorderPoint })}
                        >
                          Receive
                        </button>
                      ) : (
                        <button
                          className="outline-button"
                          type="button"
                          style={{ fontSize: 10, padding: '4px 8px' }}
                          onClick={() => dispatch({ type: 'mark-ordered', itemId: i.id })}
                        >
                          Order
                        </button>
                      )}
                      <button
                        className="outline-button"
                        type="button"
                        style={{ fontSize: 10, padding: '4px 8px' }}
                        onClick={() => {
                          setAdjustItem(i.id)
                          setAdjustAmount(2)
                        }}
                      >
                        Adjust
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Quick Adjust Modal */}
      {adjustItem && (
        <div className="drawer-backdrop" role="presentation" onClick={() => setAdjustItem(null)}>
          <aside className="drawer" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <button className="drawer-close" type="button" onClick={() => setAdjustItem(null)}>✕ Close</button>
            <div className="section-kicker">Stock Adjustment</div>
            <h2>Adjust Inventory: {state.inventory.find((i) => i.id === adjustItem)?.name}</h2>
            <p className="muted-copy">Add delivery or write off waste without compromising inventory audit trails.</p>

            <label style={{ display: 'block', margin: '18px 0' }}>
              <span style={{ fontSize: 12, fontWeight: 700 }}>Quantity to Add/Deduct ({state.inventory.find((i) => i.id === adjustItem)?.unit})</span>
              <input
                type="number"
                step="0.5"
                value={adjustAmount}
                onChange={(e) => setAdjustAmount(Number(e.target.value))}
                style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #DCE5DA', marginTop: 6 }}
              />
            </label>

            <div className="drawer-actions">
              <button
                className="primary-button"
                type="button"
                onClick={() => {
                  dispatch({ type: 'adjust-stock', itemId: adjustItem, amount: adjustAmount })
                  setAdjustItem(null)
                }}
              >
                Apply Stock Adjustment
              </button>
            </div>
          </aside>
        </div>
      )}
    </PageFrame>
  )
}
/* -------------------------------------------------------------------------- */
/*                  PAGE 5: FOOD WASTE MANAGEMENT & LOG                       */
/* -------------------------------------------------------------------------- */

export function WasteIntelligencePage() {
  const { state, dispatch } = usePlateIQ()

  const [dishId, setDishId] = useState(
    state.dishes[0]?.id ?? 'biryani',
  )

  const [wasteKg, setWasteKg] = useState(1.2)

  const [category, setCategory] = useState<
    'Overproduction' | 'Spoilage' | 'Prepared Food' | 'Other'
  >('Overproduction')

  const [cause, setCause] = useState(
    'End-of-service surplus holding window expired.',
  )

  const [logSuccess, setLogSuccess] = useState(false)

  const summary = wasteSummary(state.waste)

  const topDishes = Object.entries(summary.byDish)
    .sort((a, b) => b[1].wasteKg - a[1].wasteKg)
    .slice(0, 4)

  const handleLogWaste = (e: React.FormEvent) => {
    e.preventDefault()

    if (wasteKg <= 0 || !dishId) {
      return
    }

    dispatch({
      type: 'record-waste',
      dishId,
      wasteKg,
      category,
      cause,
    })

    setLogSuccess(true)

    setTimeout(() => {
      setLogSuccess(false)
    }, 3000)
  }

  const reductionDisplay =
    summary.wasteReductionPct === null
      ? '—'
      : `${summary.wasteReductionPct.toFixed(1)}%`

  const savingsDisplay =
    summary.potentialSavings === null
      ? '—'
      : `₹${Math.round(
          summary.potentialSavings,
        ).toLocaleString('en-IN')}`

  return (
    <PageFrame
      title="Food Waste Planning & Analysis"
      subtitle="Review local sample waste records, category breakdowns, and calculated waste costs. Production waste/POS integration awaits backend connection."
      badge="Frontend sample data"
    >
      {/* ------------------------------------------------------------------ */}
      {/* SAMPLE DATA DISCLOSURE                                            */}
      {/* ------------------------------------------------------------------ */}

      <div className="demo-banner" role="note">
        <div className="demo-icon">
          <AlertTriangle
            style={{
              width: 17,
              height: 17,
            }}
          />
        </div>

        <div>
          <strong>Sample waste workspace</strong>

          <span>
            Waste quantities and cost figures come from local
            frontend/demo data. They are not connected to production
            restaurant waste, POS, inventory, or purchasing systems.
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* SAMPLE WASTE KPI CARDS                                            */}
      {/* ------------------------------------------------------------------ */}

      <div
        className="stitch-kpi-grid"
        style={{ marginTop: 0 }}
      >
        {/* Logged Waste */}
        <article className="stitch-kpi">
          <div className="stitch-kpi-heading">
            <span>SAMPLE LOGGED WASTE</span>
            <span className="stitch-kpi-tag">
              LOCAL DATA
            </span>
          </div>

          <strong>
            {summary.wasteKg.toFixed(1)}{' '}
            <small>kg</small>
          </strong>

          <div className="stitch-kpi-foot">
            <span>
              From local sample waste records
            </span>

            <span className="stitch-kpi-positive">
              Planning only
            </span>
          </div>
        </article>

        {/* Waste Cost */}
        <article className="stitch-kpi">
          <div className="stitch-kpi-heading">
            <span>SAMPLE WASTE COST</span>
            <span className="stitch-kpi-tag">
              CALCULATED
            </span>
          </div>

          <strong>
            ₹
            {Math.round(
              summary.wasteCost,
            ).toLocaleString('en-IN')}
          </strong>

          <div className="stitch-kpi-foot">
            <span>
              Calculated from sample waste records
            </span>

            <span className="stitch-kpi-positive">
              Local calculation
            </span>
          </div>
        </article>

        {/* Waste Reduction */}
        <article className="stitch-kpi">
          <div className="stitch-kpi-heading">
            <span>WASTE REDUCTION</span>
            <span className="stitch-kpi-tag">
              BASELINE DATA
            </span>
          </div>

          <strong>{reductionDisplay}</strong>

          <div className="stitch-kpi-foot">
            <span>
              {summary.wasteReductionPct === null
                ? 'Awaiting historical baseline data'
                : 'Calculated from available baseline data'}
            </span>

            <span className="stitch-kpi-positive">
              {summary.wasteReductionPct === null
                ? 'Awaiting integration'
                : 'Calculated'}
            </span>
          </div>
        </article>

        {/* Potential Savings */}
        <article className="stitch-kpi">
          <div className="stitch-kpi-heading">
            <span>POTENTIAL SAVINGS</span>
            <span className="stitch-kpi-tag">
              VALIDATED DATA
            </span>
          </div>

          <strong>{savingsDisplay}</strong>

          <div className="stitch-kpi-foot">
            <span>
              {summary.potentialSavings === null
                ? 'Requires validated baseline and cost data'
                : 'Calculated from available savings data'}
            </span>

            <span className="stitch-kpi-positive">
              {summary.potentialSavings === null
                ? 'Awaiting integration'
                : 'Calculated'}
            </span>
          </div>
        </article>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* WASTE LOGGER + BREAKDOWNS                                         */}
      {/* ------------------------------------------------------------------ */}

      <div
        className="dashboard-grid"
        style={{ marginTop: 16 }}
      >
        {/* ---------------------------------------------------------------- */}
        {/* SAMPLE WASTE LOGGER                                              */}
        {/* ---------------------------------------------------------------- */}

        <section className="panel">
          <div className="section-kicker">
            <AlertTriangle />
            SAMPLE WASTE LOGGER
          </div>

          <h2>Record Sample Waste Event</h2>

          <p className="muted-copy">
            Add a local planning/demo waste record. This does
            not write to a production waste, POS, inventory, or
            purchasing system.
          </p>

          <form
            onSubmit={handleLogWaste}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              marginTop: 12,
            }}
          >
            {/* Dish */}
            <label
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                fontSize: 11,
                fontWeight: 700,
                color: '#174B32',
              }}
            >
              Target Dish

              <select
                value={dishId}
                onChange={(e) =>
                  setDishId(e.target.value)
                }
                style={{
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: '1px solid #DCE5DA',
                  fontSize: 12,
                }}
              >
                {state.dishes.map((dish) => (
                  <option
                    key={dish.id}
                    value={dish.id}
                  >
                    {dish.name} ({dish.category})
                  </option>
                ))}
              </select>
            </label>

            {/* Amount + Category */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  '1fr 1fr',
                gap: 12,
              }}
            >
              {/* Amount */}
              <label
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#174B32',
                }}
              >
                Waste Amount (kg)

                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={wasteKg}
                  onChange={(e) =>
                    setWasteKg(
                      Number(e.target.value),
                    )
                  }
                  style={{
                    padding: '8px 12px',
                    borderRadius: 8,
                    border:
                      '1px solid #DCE5DA',
                    fontSize: 12,
                  }}
                />
              </label>

              {/* Category */}
              <label
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#174B32',
                }}
              >
                Waste Category

                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(
                      e.target.value as
                        | 'Overproduction'
                        | 'Spoilage'
                        | 'Prepared Food'
                        | 'Other',
                    )
                  }
                  style={{
                    padding: '8px 12px',
                    borderRadius: 8,
                    border:
                      '1px solid #DCE5DA',
                    fontSize: 12,
                  }}
                >
                  <option value="Overproduction">
                    Overproduction
                  </option>

                  <option value="Spoilage">
                    Spoilage / Perished
                  </option>

                  <option value="Prepared Food">
                    Prepared Food Surplus
                  </option>

                  <option value="Other">
                    Trimming / Other
                  </option>
                </select>
              </label>
            </div>

            {/* Cause */}
            <label
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                fontSize: 11,
                fontWeight: 700,
                color: '#174B32',
              }}
            >
              Primary Cause

              <input
                type="text"
                value={cause}
                onChange={(e) =>
                  setCause(e.target.value)
                }
                placeholder="Reason for the sample waste entry"
                style={{
                  padding: '8px 12px',
                  borderRadius: 8,
                  border:
                    '1px solid #DCE5DA',
                  fontSize: 12,
                }}
              />
            </label>

            {/* Submit */}
            <button
              className="primary-button"
              type="submit"
              style={{
                marginTop: 8,
                justifyContent: 'center',
              }}
            >
              <Check
                style={{
                  width: 14,
                  height: 14,
                }}
              />

              Add Sample Waste Record
            </button>

            {/* Success */}
            {logSuccess && (
              <span
                className="stitch-kpi-positive"
                style={{
                  fontSize: 11,
                  textAlign: 'center',
                }}
              >
                Sample waste record added to
                the local planning state.
              </span>
            )}
          </form>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* CATEGORY + DISH BREAKDOWN                                       */}
        {/* ---------------------------------------------------------------- */}

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          {/* Category */}
          <section className="panel">
            <div className="section-kicker">
              <Activity />
              SAMPLE CATEGORY BREAKDOWN
            </div>

            <h2>Waste by Category</h2>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                marginTop: 12,
              }}
            >
              {Object.entries(
                summary.byCategory,
              ).map(([name, value]) => (
                <div
                  className="setting-row"
                  key={name}
                >
                  <span>{name}</span>

                  <strong>
                    {value.wasteKg.toFixed(1)} kg
                    {' · '}
                    ₹
                    {Math.round(
                      value.wasteCost,
                    ).toLocaleString('en-IN')}
                  </strong>
                </div>
              ))}
            </div>
          </section>

          {/* Dish */}
          <section className="panel">
            <div className="section-kicker">
              <Utensils />
              SAMPLE DISH BREAKDOWN
            </div>

            <h2>Top Sample Waste by Dish</h2>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                marginTop: 12,
              }}
            >
              {topDishes.length === 0 ? (
                <p className="muted-copy">
                  No sample waste records are
                  available.
                </p>
              ) : (
                topDishes.map(
                  ([dId, value]) => (
                    <div
                      className="setting-row"
                      key={dId}
                    >
                      <span>
                        {state.dishes.find(
                          (dish) =>
                            dish.id === dId,
                        )?.name || dId}
                      </span>

                      <strong>
                        {value.wasteKg.toFixed(1)} kg
                        {' '}
                        (₹
                        {Math.round(
                          value.wasteCost,
                        ).toLocaleString(
                          'en-IN',
                        )}
                        )
                      </strong>
                    </div>
                  ),
                )
              )}
            </div>
          </section>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* SAMPLE WASTE LOG                                                   */}
      {/* ------------------------------------------------------------------ */}

      <section
        className="panel data-panel"
        style={{ marginTop: 16 }}
      >
        <div className="section-kicker">
          <AlertTriangle />
          SAMPLE WASTE LOG
        </div>

        <h2>Recorded Sample Waste Entries</h2>

        <p className="muted-copy">
          These entries are local frontend/demo
          records. They are not production
          operational waste records.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Dish</th>
                <th>Category</th>
                <th>Sample Waste</th>
                <th>Sample Cost</th>
                <th>Timestamp</th>
                <th>Cause</th>
                <th>Quick Log</th>
              </tr>
            </thead>

            <tbody>
              {state.waste.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    No sample waste records
                    are available.
                  </td>
                </tr>
              ) : (
                state.waste.map((waste) => (
                  <tr key={waste.id}>
                    <td>
                      <strong>
                        {state.dishes.find(
                          (dish) =>
                            dish.id ===
                            waste.dishId,
                        )?.name ||
                          waste.dishId}
                      </strong>
                    </td>

                    <td>
                      <Status>
                        {waste.category}
                      </Status>
                    </td>

                    <td>
                      {waste.wasteKg.toFixed(1)}{' '}
                      {waste.unit}
                    </td>

                    <td>
                      ₹
                      {waste.wasteCost.toLocaleString(
                        'en-IN',
                      )}
                    </td>

                    <td>
                      {new Date(
                        waste.date,
                      ).toLocaleTimeString(
                        [],
                        {
                          hour: '2-digit',
                          minute: '2-digit',
                        },
                      )}
                    </td>

                    <td>
                      {waste.cause}
                    </td>

                    <td>
                      <button
                        className="outline-button"
                        type="button"
                        style={{
                          fontSize: 10,
                          padding: '4px 8px',
                        }}
                        onClick={() =>
                          dispatch({
                            type: 'record-waste',
                            dishId:
                              waste.dishId,
                            wasteKg: 0.5,
                            category:
                              waste.category,
                            cause: `Sample increment: ${waste.cause}`,
                          })
                        }
                      >
                        +0.5 kg sample
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </PageFrame>
  )
}
/* -------------------------------------------------------------------------- */
/*            PAGE 6: CULINARY INSIGHTS & PERFORMANCE ANALYTICS               */
/* -------------------------------------------------------------------------- */

export function AnalyticsPage() {
  const { state } = usePlateIQ()
  const metrics = getAnalyticsMetrics(state)
  const restMetrics = getRestaurantMetrics(state)
  const [period, setPeriod] = useState('Last 30 Days')

  const driftData = [
    { week: 'W1', primeCost: 55.4, theoretical: 53.0 },
    { week: 'W2', primeCost: 54.8, theoretical: 53.2 },
    { week: 'W3', primeCost: 54.5, theoretical: 53.5 },
    { week: 'W4 (Current)', primeCost: 54.2, theoretical: 53.6 },
  ]

  return (
    <PageFrame
      title="Culinary Insights & Performance Analytics"
      subtitle="Retrospective performance evaluation, recipe margin drift, station yield efficiency, and autonomous copilot ROI."
      badge="30-Day Consolidated"
    >
      {/* Time Filter Tabs */}
      <div className="filter-row" style={{ marginTop: 0, marginBottom: 16 }}>
        <label>
          Analytics Window
          <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="Last 30 Days">Last 30 Days: Oct 1 - Oct 31</option>
            <option value="Quarterly">Quarterly Report (Q3/Q4)</option>
            <option value="Year to Date">Year to Date (YTD 2025)</option>
          </select>
        </label>
      </div>

      {/* 4 KPI Cards */}
      <div className="stitch-kpi-grid" style={{ marginTop: 0 }}>
        <article className="stitch-kpi">
          <div className="stitch-kpi-heading"><span>PRIME COST (FOOD + LABOR)</span><span className="stitch-kpi-tag">-1.8% VS TARGET</span></div>
          <strong>54.2%</strong>
          <div className="stitch-kpi-foot"><span>Food: 26.4% · Labor: 27.8%</span><span className="stitch-kpi-positive">Optimal</span></div>
        </article>

        <article className="stitch-kpi">
          <div className="stitch-kpi-heading"><span>RECIPE MARGIN DRIFT</span><span className="stitch-kpi-tag">TOP DECILE</span></div>
          <strong>+₹1,410 <small>(0.54%)</small></strong>
          <div className="stitch-kpi-foot"><span>Smart tare alert recovery</span><span className="stitch-kpi-positive">Target &lt; 1.5%</span></div>
        </article>

        <article className="stitch-kpi">
          <div className="stitch-kpi-heading"><span>AUTONOMOUS COPILOT ROI</span><span className="stitch-kpi-tag">64 AUTO-ACTIONS</span></div>
          <strong>+₹21,490</strong>
          <div className="stitch-kpi-foot"><span>Waste mitigation + Elastic par</span><span className="stitch-kpi-positive">+24.6% WoW</span></div>
        </article>

        <article className="stitch-kpi">
          <div className="stitch-kpi-heading"><span>STATION YIELD & FLOW</span><span className="stitch-kpi-tag">98.6% EFF</span></div>
          <strong>14.2 <small>min</small></strong>
          <div className="stitch-kpi-foot"><span>Average ticket lead time</span><span className="stitch-kpi-positive">Smooth</span></div>
        </article>
      </div>

      {/* Performance Chart & Station Yield Breakdown */}
      <div className="dashboard-grid" style={{ marginTop: 16 }}>
        {/* Margin Drift Chart */}
        <section className="panel">
          <div className="section-kicker"><TrendingDown /> Prime Cost & Margin Trend</div>
          <h2>Prime Cost Trajectory</h2>
          <div style={{ height: 220, width: '100%', marginTop: 12 }}>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={driftData} margin={{ top: 12, right: 12, left: -16, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#E4EAE2" strokeDasharray="3 4" />
                <XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fill: '#6C7E72', fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#6C7E72', fontSize: 11 }} domain={[50, 60]} width={38} />
                <Tooltip />
                <Line dataKey="primeCost" stroke="#16834B" strokeWidth={3} name="Actual Prime Cost %" />
                <Line dataKey="theoretical" stroke="#D8942F" strokeWidth={2} strokeDasharray="4 4" name="Theoretical Model %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Station Yield & Load Breakdown */}
        <section className="panel">
          <div className="section-kicker"><Activity /> Station Flow Analytics</div>
          <h2>Station Readiness & Yield Rates</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
            {state.stations.map((s) => (
              <div key={s.id} style={{ padding: 10, background: '#F8FBF7', borderRadius: 8, border: '1px solid #DCEADC' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700 }}>
                  <span>{s.name}</span>
                  <span className="stitch-kpi-positive">{s.capacity}% throughput</span>
                </div>
                <div style={{ height: 6, background: '#E2EEE2', borderRadius: 99, marginTop: 6, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${s.capacity}%`, background: '#16834B', borderRadius: 99 }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Top Performing Dishes & Margin Contribution */}
      <section className="panel data-panel" style={{ marginTop: 16 }}>
        <div className="section-kicker"><Utensils /> Menu Contribution & Profitability</div>
        <h2>Dish Sales Volume & Contribution Margin</h2>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Dish</th>
                <th>Category</th>
                <th>Forecast Accuracy</th>
                <th>Food Cost Ratio</th>
                <th>Margin %</th>
                <th>Preparation Pace</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {state.dishes.map((d) => {
                const f = state.forecasts.find((x) => x.dishId === d.id)
                return (
                  <tr key={d.id}>
                    <td><strong>{d.name}</strong></td>
                    <td>{d.category}</td>
                    <td><span className="stitch-kpi-positive">{f?.confidence ?? d.confidence}%</span></td>
                    <td>26.4%</td>
                    <td><strong>73.6%</strong></td>
                    <td>{d.leadTimeMinutes} min lead</td>
                    <td><Status>{d.status}</Status></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </PageFrame>
  )
}
/* -------------------------------------------------------------------------- */
/*               PAGE 7: CHEF PROFILE & BRIGADE                               */
/* -------------------------------------------------------------------------- */

export function ChefProfilePage() {
  const { state } = usePlateIQ()

  const metrics = getLiveOperationsMetrics(state)

  const activeBatches = state.batches.filter(
    (batch) => batch.status !== 'Completed',
  ).length

  const stockAlerts = state.inventory.filter(
    (item) =>
      item.status === 'Low' ||
      item.status === 'Critical',
  ).length

  return (
    <PageFrame
      title="Chef Profile & Brigade Management"
      subtitle="Sample shift-lead profile, kitchen station assignments, and brigade planning context."
      badge="Frontend sample data"
    >
      {/* ---------------------------------------------------------------- */}
      {/* SAMPLE PROFILE DISCLOSURE                                       */}
      {/* ---------------------------------------------------------------- */}

      <div className="demo-banner" role="note">
        <div className="demo-icon">
          <AlertTriangle
            style={{
              width: 17,
              height: 17,
            }}
          />
        </div>

        <div>
          <strong>Sample chef workspace</strong>

          <span>
            Chef profile details, service-window information, station
            statuses, and operational figures shown here are frontend
            demonstration data and are not connected to a live kitchen
            management system.
          </span>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* SAMPLE CHEF PROFILE                                               */}
      {/* ---------------------------------------------------------------- */}

      <section
        className="chef-profile-hero"
        style={{
          background: '#FFFFFF',
          border: '1px solid #DCE9DD',
          borderRadius: 18,
          padding: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div
            className="chef-profile-avatar"
            style={{
              width: 54,
              height: 54,
              borderRadius: '50%',
              background: '#174B32',
              color: '#fff',
              fontSize: 18,
              fontWeight: 800,
              display: 'grid',
              placeItems: 'center',
            }}
          >
            MV
          </div>

          <div>
            <div
              className="chef-profile-kicker"
              style={{
                fontSize: 9,
                fontWeight: 800,
                color: '#68826D',
                letterSpacing: '0.12em',
              }}
            >
              SAMPLE SHIFT LEAD PROFILE
            </div>

            <h2
              style={{
                fontSize: 24,
                margin: '4px 0 2px',
                color: '#174B32',
              }}
            >
              Chef Marcus Vance
            </h2>

            <p
              style={{
                margin: 0,
                fontSize: 12,
                color: '#67796D',
              }}
            >
              {state.restaurant.name} · {state.restaurant.city},{' '}
              {state.restaurant.country}
            </p>

            <div
              className="chef-profile-tags"
              style={{
                display: 'flex',
                gap: 8,
                marginTop: 8,
                flexWrap: 'wrap',
              }}
            >
              <span className="status-badge">
                <ShieldCheck
                  style={{
                    width: 12,
                    height: 12,
                  }}
                />
                Sample Profile
              </span>

              <span className="status-badge">
                <Users
                  style={{
                    width: 12,
                    height: 12,
                  }}
                />
                Brigade Planning
              </span>

              <span className="status-badge">
                <Activity
                  style={{
                    width: 12,
                    height: 12,
                  }}
                />
                Frontend Demo
              </span>
            </div>
          </div>
        </div>

        {/* Sample service window */}
        <div
          className="chef-shift-card"
          style={{
            padding: 14,
            background: '#F0F7EF',
            borderRadius: 12,
            border: '1px solid #D6EAD7',
          }}
        >
          <span
            style={{
              fontSize: 8,
              fontWeight: 800,
              color: '#66806C',
              letterSpacing: '0.1em',
            }}
          >
            SAMPLE SERVICE WINDOW
          </span>

          <strong
            style={{
              display: 'block',
              fontSize: 14,
              margin: '2px 0',
              color: '#174B32',
            }}
          >
            Dinner Service
          </strong>

          <small
            style={{
              color: '#718576',
            }}
          >
            17:00–22:00 · Sample peak period 19:30
          </small>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* SAMPLE OPERATIONAL KPIs                                         */}
      {/* ---------------------------------------------------------------- */}

      <div
        className="stitch-kpi-grid"
        style={{ marginTop: 16 }}
      >
        {/* Orders */}
        <article className="stitch-kpi">
          <div className="stitch-kpi-heading">
            <span>ORDERS IN DEMO</span>
            <span className="stitch-kpi-tag">
              SHARED STATE
            </span>
          </div>

          <strong>
            {metrics.orders.toLocaleString('en-IN')}{' '}
            <small>plates</small>
          </strong>

          <div className="stitch-kpi-foot">
            <span>
              Simulated cover pacing
            </span>

            <span className="stitch-kpi-positive">
              Demo state
            </span>
          </div>
        </article>

        {/* Active batches */}
        <article className="stitch-kpi">
          <div className="stitch-kpi-heading">
            <span>ACTIVE PREP BATCHES</span>
            <span className="stitch-kpi-tag">
              SHARED STATE
            </span>
          </div>

          <strong>
            {activeBatches}{' '}
            <small>batches</small>
          </strong>

          <div className="stitch-kpi-foot">
            <span>
              Current local batch state
            </span>

            <span className="stitch-kpi-positive">
              Calculated
            </span>
          </div>
        </article>

        {/* Stations */}
        <article className="stitch-kpi">
          <div className="stitch-kpi-heading">
            <span>STATIONS TRACKED</span>
            <span className="stitch-kpi-tag">
              LOCAL STATE
            </span>
          </div>

          <strong>
            {state.stations.length}{' '}
            <small>stations</small>
          </strong>

          <div className="stitch-kpi-foot">
            <span>
              Sample kitchen station entries
            </span>

            <span className="stitch-kpi-positive">
              Planning view
            </span>
          </div>
        </article>

        {/* Stock alerts */}
        <article className="stitch-kpi">
          <div className="stitch-kpi-heading">
            <span>SAMPLE STOCK ALERTS</span>
            <span className="stitch-kpi-tag stitch-kpi-tag-warn">
              CALCULATED
            </span>
          </div>

          <strong>
            {stockAlerts}{' '}
            <small>items</small>
          </strong>

          <div className="stitch-kpi-foot">
            <span>
              Low/critical sample par flags
            </span>

            <span className="stitch-kpi-positive">
              No purchase order
            </span>
          </div>
        </article>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* STATION ASSIGNMENTS + QUICK LINKS                               */}
      {/* ---------------------------------------------------------------- */}

      <div
        className="dashboard-grid"
        style={{ marginTop: 16 }}
      >
        {/* Station Overview */}
        <section className="panel">
          <div className="section-kicker">
            <Users />
            SAMPLE BRIGADE STATION OVERVIEW
          </div>

          <h2>Station Readiness &amp; Load</h2>

          <p className="muted-copy">
            Review sample station capacity and preparation state from
            the local frontend data model.
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              marginTop: 12,
            }}
          >
            {state.stations.map((station) => (
              <article
                className="chef-station-row"
                key={station.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 12,
                  background: '#F8FBF7',
                  borderRadius: 10,
                  border: '1px solid #DCEADC',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <div
                    className="chef-station-avatar"
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 8,
                      background: '#E5F6E7',
                      color: '#174B32',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    <ChefHat
                      style={{
                        width: 18,
                        height: 18,
                      }}
                    />
                  </div>

                  <div>
                    <strong
                      style={{
                        fontSize: 13,
                        color: '#17231B',
                      }}
                    >
                      {station.name}
                    </strong>

                    <div
                      style={{
                        fontSize: 10,
                        color: '#687E6F',
                      }}
                    >
                      {station.status === 'Busy'
                        ? 'Sample batch in preparation'
                        : station.status === 'At Risk'
                          ? 'Sample capacity review needed'
                          : 'Sample line ready'}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    textAlign: 'right',
                  }}
                >
                  <strong
                    style={{
                      fontSize: 14,
                      color: '#174B32',
                    }}
                  >
                    {station.capacity}%
                  </strong>

                  <div
                    style={{
                      fontSize: 9,
                      color: '#7E8F82',
                    }}
                  >
                    sample load
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Quick Links */}
        <section className="panel chef-profile-actions">
          <div className="section-kicker">
            <Sparkles />
            SHIFT CONTROL CENTER
          </div>

          <h2>Quick Brigade Navigation</h2>

          <p className="muted-copy">
            Open the related frontend planning and analysis pages.
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              marginTop: 12,
            }}
          >
            <Link
              className="chef-profile-link"
              href="/app/kitchen-planner"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 12,
                background: '#F8FBF7',
                borderRadius: 8,
                border: '1px solid #DCEADC',
              }}
            >
              <span>
                <strong
                  style={{
                    display: 'block',
                    fontSize: 12,
                    color: '#174B32',
                  }}
                >
                  Brigade Tasks &amp; Checklist
                </strong>

                <small
                  style={{
                    fontSize: 10,
                    color: '#6C8070',
                  }}
                >
                  Review the sample shift checklist and batch schedule
                </small>
              </span>

              <ArrowRight
                style={{
                  width: 14,
                  height: 14,
                  color: '#174B32',
                }}
              />
            </Link>

            <Link
              className="chef-profile-link"
              href="/app/live-operations"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 12,
                background: '#F8FBF7',
                borderRadius: 8,
                border: '1px solid #DCEADC',
              }}
            >
              <span>
                <strong
                  style={{
                    display: 'block',
                    fontSize: 12,
                    color: '#174B32',
                  }}
                >
                  Kitchen Display &amp; Expedite Pass
                </strong>

                <small
                  style={{
                    fontSize: 10,
                    color: '#6C8070',
                  }}
                >
                  Review sample tickets and station progression
                </small>
              </span>

              <ArrowRight
                style={{
                  width: 14,
                  height: 14,
                  color: '#174B32',
                }}
              />
            </Link>

            <Link
              className="chef-profile-link"
              href="/app/analytics"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 12,
                background: '#F8FBF7',
                borderRadius: 8,
                border: '1px solid #DCEADC',
              }}
            >
              <span>
                <strong
                  style={{
                    display: 'block',
                    fontSize: 12,
                    color: '#174B32',
                  }}
                >
                  Culinary Insights &amp; Analytics
                </strong>

                <small
                  style={{
                    fontSize: 10,
                    color: '#6C8070',
                  }}
                >
                  Review the current frontend analytics workspace
                </small>
              </span>

              <ArrowRight
                style={{
                  width: 14,
                  height: 14,
                  color: '#174B32',
                }}
              />
            </Link>
          </div>
        </section>
      </div>
    </PageFrame>
  )
}