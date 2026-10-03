'use client'
import { useMemo, useState } from 'react'
import { Check, Package, Sparkles, Activity, AlertTriangle, Users, ShieldCheck, ChefHat, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { usePlateIQ, usePlateIQMetrics } from './plateiq-state'
import { wasteSummary } from '@/lib/waste-engine'
import { getAnalyticsMetrics, getDishOperationalContext, getLiveOperationsMetrics, getKitchenMetrics } from '@/lib/selectors'

function PageFrame({title,subtitle,children}:{title:string;subtitle:string;children:React.ReactNode}){const pageClass=title.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");return <div className={`page-body stitch-workspace-page stitch-page-${pageClass}`}><div className="stitch-page-intro"><div><div className="stitch-page-kicker"><span className="stitch-live-dot"/> PLATEIQ INTELLIGENCE <span className="separator">/</span> LIVE WORKSPACE</div><h1>{title}</h1><p>{subtitle}</p></div><div className="stitch-page-status"><span className="stitch-live-dot"/> Systems operational</div></div>{children}</div>}
function Kpi({label,value,detail}:{label:string;value:string;detail:string}){return <div className="metric-card"><div className="metric-top"><span>{label}</span><span className="metric-dot"/></div><div className="metric-value">{value}</div><div className="metric-bottom"><span>{detail}</span></div></div>}
function Status({children}:{children:React.ReactNode}){return <span className="status-badge">{children}</span>}
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
  const progressForStatus = (status: string) => status === 'Recommended' ? 18 : status === 'In Preparation' ? 58 : 100
  const actionForStatus = (status: string) => status === 'Recommended' ? 'Start preparation' : status === 'In Preparation' ? 'Mark ready' : status === 'Ready' ? 'Complete ticket' : 'Completed'

  return (
    <PageFrame title="Kitchen display & expedite pass" subtitle="Review the preparation queue by ticket, station, and readiness. Ticket cards are derived from the shared demo preparation batches; a live POS/KDS feed is not connected.">
      <div className="metrics-grid">
        <Kpi label="Orders in demo" value={metrics.orders.toLocaleString('en-IN')} detail="simulated shared state" />
        <Kpi label="Order velocity" value={metrics.ordersPerMinute.toFixed(1)} detail="orders per minute · demo" />
        <Kpi label="Projected demand" value={metrics.projectedDemand.toLocaleString('en-IN')} detail="forecast model output" />
        <Kpi label="Kitchen capacity" value={`${metrics.capacity}%`} detail="station average" />
      </div>

      <section className="panel kds-board">
        <div className="kds-board-heading">
          <div>
            <div className="section-kicker"><Activity /> KITCHEN DISPLAY SYSTEM</div>
            <h2>Expedite pass</h2>
            <p>Move each preparation ticket through its next available status.</p>
          </div>
          <span className="kds-demo-label">DEMO QUEUE</span>
        </div>

        <div className="kds-legend">
          <span><i className="kds-dot recommended" /> Recommended</span>
          <span><i className="kds-dot preparing" /> In preparation</span>
          <span><i className="kds-dot ready" /> Ready / completed</span>
        </div>

        {tickets.length === 0 ? (
          <div className="kds-empty">No preparation tickets are available in the current demo state.</div>
        ) : (
          <div className="kds-grid">
            {tickets.map((ticket) => {
              const dish = ticket.dish!
              const completed = ticket.status === 'Completed'
              return (
                <article className={`kds-ticket ${ticket.status.toLowerCase().replaceAll(' ', '-')}`} key={ticket.id}>
                  <div className="kds-ticket-top">
                    <span className="kds-ticket-id">{ticket.ticket} · BATCH {ticket.number}</span>
                    <Status>{ticket.status}</Status>
                  </div>
                  <h3>{dish.name}</h3>
                  <p className="kds-station"><Package aria-hidden="true" /> {stationForCategory(dish.category)}</p>
                  <div className="kds-ticket-stats">
                    <div><span>Quantity</span><strong>{ticket.quantity} plates</strong></div>
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

      <div className="dashboard-grid kds-support-grid">
        <section className="panel">
          <div className="section-kicker"><Activity /> Station readiness</div>
          {state.stations.map((station) => (
            <div className="setting-row" key={station.id}>
              <div><strong>{station.name}</strong><small className="kds-row-detail">{station.capacity}% capacity</small></div>
              <Status>{station.status === 'Busy' ? 'Preparing' : station.status === 'At Risk' ? 'Needs attention' : 'Ready'}</Status>
            </div>
          ))}
        </section>
        <section className="panel">
          <div className="section-kicker"><Sparkles /> Recent kitchen events</div>
          {state.events.length === 0 ? (
            <p className="muted-copy">No demo events yet. Advancing a ticket will add activity to the shared workspace state.</p>
          ) : state.events.slice(0, 5).map((event) => (
            <div className="setting-row" key={event.id}>
              <div><strong>{event.title}</strong><small className="kds-row-detail">{event.timestamp} · {event.description}</small></div>
            </div>
          ))}
        </section>
      </div>
    </PageFrame>
  )
}
export function KitchenPlannerPage() {
  const { state, dispatch } = usePlateIQ()
  const [selected, setSelected] = useState<string | null>(null)
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([])
  const selectedBatch = state.batches.find((batch) => batch.id === selected)
  const selectedDish = selectedBatch ? state.dishes.find((dish) => dish.id === selectedBatch.dishId) : undefined
  const kitchen = getKitchenMetrics(state)
  const selectedContext = selectedDish ? getDishOperationalContext(state, selectedDish.id) : undefined
  const shiftTasks = [
    { id: 'temps', title: 'Record cold-storage temperatures', detail: 'Food safety · Before service', priority: 'Critical', owner: 'Sous chef' },
    { id: 'mise', title: 'Verify mise en place at each station', detail: 'Preparation · Before first ticket', priority: 'High', owner: 'Station leads' },
    { id: 'allergens', title: 'Confirm allergen and cross-contact labels', detail: 'HACCP · Before service', priority: 'Critical', owner: 'Expediter' },
    { id: 'stock', title: 'Review low-stock ingredients', detail: 'Inventory · Next 30 minutes', priority: 'High', owner: 'Store lead' },
    { id: 'handover', title: 'Complete shift handover notes', detail: 'Brigade · Shift transition', priority: 'Normal', owner: 'Head chef' },
  ]
  const completedTasks = shiftTasks.filter((task) => completedTaskIds.includes(task.id)).length

  return (
    <PageFrame title="Brigade tasks & prep plan" subtitle="Coordinate the shift checklist, station readiness, and progressive preparation from one workspace.">
      <section className="panel brigade-panel">
        <div className="brigade-heading">
          <div>
            <div className="section-kicker"><Check /> BRIGADE CHECKLIST</div>
            <h2>Before-service priorities</h2>
            <p>Interactive local demo checklist. Completion is not saved to the backend.</p>
          </div>
          <div className="brigade-progress-summary">
            <strong>{completedTasks}/{shiftTasks.length}</strong>
            <span>tasks complete</span>
          </div>
        </div>
        <div className="brigade-progress-track"><span style={{ width: `${completedTasks / shiftTasks.length * 100}%` }} /></div>
        <div className="brigade-task-list">
          {shiftTasks.map((task) => {
            const done = completedTaskIds.includes(task.id)
            return (
              <label className={`brigade-task ${done ? 'done' : ''}`} key={task.id}>
                <input
                  type="checkbox"
                  checked={done}
                  onChange={() => setCompletedTaskIds((current) => done ? current.filter((id) => id !== task.id) : [...current, task.id])}
                />
                <span className="brigade-task-copy"><strong>{task.title}</strong><small>{task.detail} · {task.owner}</small></span>
                <span className={`brigade-priority ${task.priority.toLowerCase()}`}>{task.priority}</span>
              </label>
            )
          })}
        </div>
        <div className="brigade-footnote">Demo-only checklist · Refreshing this page resets these task checkmarks.</div>
      </section>

      <section className="panel data-panel">
        <div className="section-kicker"><Package /> Progressive preparation plan · {kitchen.activeBatches.length} active batches</div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Dish</th><th>Forecast</th><th>Range</th><th>Confidence</th><th>Initial batch</th><th>Prepared</th><th>Next batch</th><th>Lead time</th><th>Waste risk</th><th>Stockout</th><th>Readiness</th><th>Status</th></tr></thead>
            <tbody>
              {state.dishes.map((dish) => {
                const forecast = state.forecasts.find((item) => item.dishId === dish.id)
                const batch = state.batches.find((item) => item.dishId === dish.id)
                const context = getDishOperationalContext(state, dish.id)
                return (
                  <tr key={dish.id} onClick={() => batch && setSelected(batch.id)}>
                    <td>{dish.name}</td>
                    <td>{forecast?.forecast ?? dish.forecast}</td>
                    <td>{forecast?.lowerBound ?? dish.lowerBound}–{forecast?.upperBound ?? dish.upperBound}</td>
                    <td>{forecast?.confidence ?? dish.confidence}%</td>
                    <td>{dish.initialBatch}</td>
                    <td>{dish.prepared}</td>
                    <td>+{context?.recommendedQuantity ?? batch?.quantity ?? dish.nextBatch}</td>
                    <td>{dish.leadTimeMinutes} min</td>
                    <td>{context?.risk?.level ?? '—'}</td>
                    <td>{context?.risk?.stockoutRisk ?? '—'}</td>
                    <td>{context?.batchImpact.ready ? 'Ready' : 'Blocked'}</td>
                    <td><Status>{batch?.status || 'No batch'}</Status></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel timeline-panel">
        <div className="section-kicker">Preparation timeline</div>
        <div className="timeline-scale">Current batch schedule · derived from demo batch quantities</div>
        {state.batches.map((batch) => {
          const dish = state.dishes.find((item) => item.id === batch.dishId)
          return <div className="timeline-row" key={batch.id}><strong>{dish?.name || batch.dishId}</strong><span style={{ width: `${Math.min(100, Math.max(12, batch.quantity))}%` }} /></div>
        })}
      </section>

      {selectedBatch && selectedDish && selectedContext && (
        <div className="drawer-backdrop" role="presentation" onClick={() => setSelected(null)}>
          <aside className="drawer" role="dialog" aria-modal="true" aria-label={`Batch ${selectedBatch.number} details`} onClick={(event) => event.stopPropagation()}>
            <button className="drawer-close" type="button" onClick={() => setSelected(null)}>Close</button>
            <div className="section-kicker">Batch detail</div>
            <h2>Batch #{selectedBatch.number}</h2>
            <p>{selectedDish.name} · {selectedBatch.quantity} plates · {selectedDish.leadTimeMinutes} min lead time</p>
            <Status>{selectedBatch.status}</Status>
            <p className="muted-copy">{selectedContext.risk?.recommendedAction}</p>
            <p className="muted-copy">Waste risk: {selectedContext.risk?.level} · Stockout risk: {selectedContext.risk?.stockoutRisk}</p>
            <p className="muted-copy">Requirements: {Object.entries(selectedContext.batchImpact.requirements).map(([id, amount]) => `${id} ${amount}`).join(' · ')}</p>
            {selectedContext.batchImpact.shortages.length > 0 && <p className="muted-copy">Blocked by: {selectedContext.batchImpact.shortages.map((item) => `${item.name} (${item.available}/${item.required})`).join(', ')}</p>}
            <div className="drawer-actions">
              <button className="primary-button" type="button" disabled={selectedContext.batchImpact.shortages.length > 0} onClick={() => dispatch({ type: 'batch', batchId: selectedBatch.id })}>
                {selectedBatch.status === 'Recommended' ? 'Start batch' : selectedBatch.status === 'In Preparation' ? 'Mark ready' : selectedBatch.status === 'Ready' ? 'Complete batch' : 'Completed'} <Check />
              </button>
            </div>
          </aside>
        </div>
      )}
    </PageFrame>
  )
}
export function DemandForecastPage(){const {state}=usePlateIQ();const [dish,setDish]=useState('All dishes');const [category,setCategory]=useState('All categories');const [period,setPeriod]=useState('Lunch');const [date,setDate]=useState('2025-06-24');const rows=state.dishes.filter(d=>(dish==='All dishes'||d.name===dish)&&(category==='All categories'||d.category===category));return <PageFrame title="Demand forecast" subtitle="Probabilistic forecasts that improve as orders arrive."><div className="filter-row"><label>Date<select value={date} onChange={e=>setDate(e.target.value)}><option value="2025-06-24">2025-06-24</option></select></label><label>Dish<select value={dish} onChange={e=>setDish(e.target.value)}><option>All dishes</option>{state.dishes.map(d=><option key={d.id}>{d.name}</option>)}</select></label><label>Category<select value={category} onChange={e=>setCategory(e.target.value)}><option>All categories</option>{Array.from(new Set(state.dishes.map(d=>d.category))).map(value=><option key={value}>{value}</option>)}</select></label><label>Meal period<select value={period} onChange={e=>setPeriod(e.target.value)}><option>Lunch</option><option>Dinner</option></select></label></div><section className="panel data-panel"><div className="section-kicker">Forecast by dish · {date} · {period}</div><div className="table-wrap"><table><thead><tr><th>Dish</th><th>Forecast</th><th>Range</th><th>Confidence</th><th>Actual orders</th><th>Recommended prep</th></tr></thead><tbody>{rows.map(d=>{const f=state.forecasts.find(x=>x.dishId===d.id);return <tr key={d.id}><td>{d.name}</td><td>{f?.forecast??d.forecast}</td><td>{f?.lowerBound??d.lowerBound}–{f?.upperBound??d.upperBound}</td><td>{f?.confidence??d.confidence}%</td><td>{f?.actual??d.actualOrders}</td><td>+{f?.recommendedPreparation??0}</td></tr>})}</tbody></table></div></section></PageFrame>}
export function InventoryPage(){const {state,dispatch}=usePlateIQ();const [filter,setFilter]=useState('All');const rows=state.inventory.filter(i=>filter==='All'||i.status===filter);const averageDays=state.inventory.length?state.inventory.reduce((a,i)=>a+i.daysLeft,0)/state.inventory.length:0;return <PageFrame title="Inventory intelligence" subtitle="Know what is running low before service is disrupted."><div className="metrics-grid"><Kpi label="Total ingredients" value={state.inventory.length.toString()} detail="tracked today"/><Kpi label="Low stock" value={state.inventory.filter(i=>i.status==='Low').length.toString()} detail="need attention"/><Kpi label="Critical stock" value={state.inventory.filter(i=>i.status==='Critical').length.toString()} detail="requires action"/><Kpi label="Average days left" value={averageDays.toFixed(1)} detail="derived from usage"/><Kpi label="Inventory value" value={`₹${Math.round(state.inventory.reduce((a,i)=>a+i.currentStock*i.unitCost,0)).toLocaleString('en-IN')}`} detail="current stock"/></div><div className="filter-row"><label>Status<select value={filter} onChange={e=>setFilter(e.target.value)}><option>All</option><option>Healthy</option><option>Low</option><option>Critical</option></select></label></div><section className="panel data-panel"><div className="table-wrap"><table><thead><tr><th>Ingredient</th><th>Current stock</th><th>Status</th><th>Days left</th><th>Order state</th><th>Trend</th><th>Action</th></tr></thead><tbody>{rows.map(i=><tr key={i.id}><td>{i.name}</td><td>{i.currentStock.toFixed(1)} {i.unit}</td><td><Status>{i.status}</Status></td><td>{i.daysLeft.toFixed(1)}</td><td>{i.orderStatus}</td><td>{i.trend}</td><td>{i.orderStatus==='Ordered'?<button className="text-button" onClick={()=>dispatch({type:'receive-stock',itemId:i.id,amount:i.reorderPoint})}>Receive</button>:<button className="text-button" onClick={()=>dispatch({type:'mark-ordered',itemId:i.id})}>Mark ordered</button>}</td></tr>)}</tbody></table></div></section></PageFrame>}
export function WasteIntelligencePage(){const {state,dispatch}=usePlateIQ();const [category,setCategory]=useState('All');const summary=wasteSummary(state.waste);const records=state.waste.filter(w=>category==='All'||w.category===category);const topDishes=Object.entries(summary.byDish).sort((a,b)=>b[1].wasteKg-a[1].wasteKg).slice(0,3);return <PageFrame title="Waste intelligence" subtitle="Turn every avoided plate into measurable savings."><div className="metrics-grid"><Kpi label="Food waste" value={`${summary.wasteKg.toFixed(1)} kg`} detail="from waste records"/><Kpi label="Waste cost" value={`₹${Math.round(summary.wasteCost).toLocaleString('en-IN')}`} detail="derived cost"/><Kpi label="Waste reduction" value={summary.wasteReductionPct===null?'—':`${summary.wasteReductionPct.toFixed(1)}%`} detail={summary.wasteReductionPct===null?'Baseline unavailable':'vs baseline'}/><Kpi label="Potential savings" value={summary.potentialSavings===null?'—':`₹${summary.potentialSavings.toLocaleString('en-IN')}`} detail={summary.potentialSavings===null?'Baseline unavailable':'derived savings'}/></div><div className="dashboard-grid"><section className="panel"><div className="section-kicker">Waste trend</div><h2>{summary.wasteTrend}</h2><p className="muted-copy">A historical baseline is required before reduction can be calculated.</p></section><section className="panel"><div className="section-kicker">Waste by category</div>{Object.entries(summary.byCategory).map(([name,value])=><div className="setting-row" key={name}><span>{name}</span><strong>{value.wasteKg.toFixed(1)} kg · ₹{value.wasteCost.toLocaleString('en-IN')}</strong></div>)}</section></div><section className="panel"><div className="section-kicker">Top wasted dishes</div>{topDishes.map(([dishId,value])=><div className="setting-row" key={dishId}><span>{state.dishes.find(dish=>dish.id===dishId)?.name||dishId}</span><strong>{value.wasteKg.toFixed(1)} kg</strong></div>)}</section><div className="filter-row"><label>Category<select value={category} onChange={e=>setCategory(e.target.value)}><option>All</option><option>Prepared Food</option><option>Spoilage</option><option>Overproduction</option><option>Other</option></select></label></div><section className="panel data-panel"><div className="section-kicker"><AlertTriangle/> Waste records</div><div className="table-wrap"><table><thead><tr><th>Dish</th><th>Category</th><th>Quantity</th><th>Cost</th><th>Date/Time</th><th>Cause</th><th>Action</th></tr></thead><tbody>{records.map(w=><tr key={w.id}><td>{state.dishes.find(d=>d.id===w.dishId)?.name||w.dishId}</td><td>{w.category}</td><td>{w.wasteKg.toFixed(1)} {w.unit}</td><td>₹{w.wasteCost}</td><td>{w.date}</td><td>{w.cause}</td><td><button className="text-button" onClick={()=>dispatch({type:'record-waste',dishId:w.dishId,wasteKg:.5,category:w.category,cause:`Additional event: ${w.cause}`})}>Record 0.5 kg</button></td></tr>)}</tbody></table></div></section></PageFrame>}
export function AnalyticsPage(){const {state}=usePlateIQ();const metrics=getAnalyticsMetrics(state);return <PageFrame title="Analytics" subtitle="See how operational decisions compound over time."><div className="metrics-grid"><Kpi label="Forecast accuracy" value={`${metrics.forecastAccuracy.toFixed(1)}%`} detail="current forecast confidence"/><Kpi label="Waste reduction" value={metrics.wasteReductionPct===null?'—':`${metrics.wasteReductionPct.toFixed(1)}%`} detail={metrics.wasteReductionPct===null?'Baseline unavailable':'derived baseline comparison'}/><Kpi label="Preparation efficiency" value={`${metrics.preparationEfficiency.toFixed(1)}%`} detail="prepared versus forecast"/><Kpi label="Stockout rate" value={`${metrics.stockoutRate.toFixed(1)}%`} detail="projected stockout items"/><Kpi label="Food cost savings" value={metrics.savings===null?'—':`₹${metrics.savings.toLocaleString('en-IN')}`} detail={metrics.savings===null?'Baseline unavailable':'derived baseline comparison'}/></div><div className="dashboard-grid"><section className="panel"><div className="section-kicker">Current forecast confidence</div><div className="analytics-bars"><span style={{height:`${metrics.forecastAccuracy}%`}}/></div></section><section className="panel"><div className="section-kicker"><Sparkles/> Derived insights</div><div className="setting-row">Prepared quantity <strong>{metrics.preparationEfficiency.toFixed(1)}% of forecast</strong></div><div className="setting-row">Projected stockout rate <strong>{metrics.stockoutRate.toFixed(1)}%</strong></div><div className="setting-row">Waste baseline <strong>{metrics.wasteReductionPct===null?'unavailable':'available'}</strong></div></section></div></PageFrame>}


export function ChefProfilePage() {
  const { state } = usePlateIQ()
  const metrics = getLiveOperationsMetrics(state)
  const activeBatches = state.batches.filter((batch) => batch.status !== 'Completed').length
  const stockAlerts = state.inventory.filter((item) => item.status === 'Low' || item.status === 'Critical').length

  return (
    <PageFrame title="Chef profile & brigade" subtitle="Review the shift lead profile, station readiness, and the current kitchen team's operational context.">
      <section className="chef-profile-hero">
        <div className="chef-profile-avatar" aria-hidden="true">AM</div>
        <div className="chef-profile-identity">
          <div className="chef-profile-kicker">WORKSPACE PROFILE · DEMO</div>
          <h2>Arjun Mehta</h2>
          <p>Restaurant manager · Jubilee Hills, Hyderabad</p>
          <div className="chef-profile-tags"><span><ShieldCheck /> Shift coordination</span><span><Users /> Brigade oversight</span><span><Activity /> Kitchen operations</span></div>
        </div>
        <div className="chef-shift-card"><span>ACTIVE SERVICE WINDOW</span><strong>Lunch & dinner</strong><small>11:00–15:00 · 17:00–22:00</small><span className="chef-demo-note">Illustrative workspace profile</span></div>
      </section>

      <div className="metrics-grid chef-profile-metrics">
        <Kpi label="Orders in demo" value={metrics.orders.toLocaleString('en-IN')} detail="shared simulation state" />
        <Kpi label="Active prep batches" value={String(activeBatches)} detail="not yet completed" />
        <Kpi label="Stations tracked" value={String(state.stations.length)} detail="shared kitchen model" />
        <Kpi label="Stock alerts" value={String(stockAlerts)} detail="derived from demo inventory" />
      </div>

      <div className="dashboard-grid chef-profile-grid">
        <section className="panel">
          <div className="section-kicker"><Users /> Brigade station overview</div>
          <h2>Station assignments & readiness</h2>
          <p className="muted-copy">The current model tracks station status and capacity. Individual employee accounts and live assignments are not connected.</p>
          <div className="chef-station-list">
            {state.stations.map((station) => (
              <article className="chef-station-row" key={station.id}>
                <div className="chef-station-avatar"><ChefHat aria-hidden="true" /></div>
                <div className="chef-station-copy"><strong>{station.name}</strong><small>{station.status === 'Busy' ? 'Active preparation' : station.status === 'At Risk' ? 'Review capacity before service' : 'Ready for service'}</small></div>
                <div className="chef-station-capacity"><strong>{station.capacity}%</strong><span>capacity</span></div>
                <Status>{station.status}</Status>
              </article>
            ))}
          </div>
        </section>

        <section className="panel chef-profile-actions">
          <div className="section-kicker"><Sparkles /> Shift control center</div>
          <h2>Keep the brigade aligned</h2>
          <p className="muted-copy">Use the existing preparation plan and operational insights to coordinate the next decision.</p>
          <Link className="chef-profile-link" href="/app/kitchen-planner"><span><strong>Open brigade tasks</strong><small>Checklist and progressive preparation</small></span><ArrowRight /></Link>
          <Link className="chef-profile-link" href="/app/live-operations"><span><strong>Open kitchen display</strong><small>Review ticket readiness and station status</small></span><ArrowRight /></Link>
          <Link className="chef-profile-link" href="/app/analytics"><span><strong>Review culinary insights</strong><small>Performance and operational metrics</small></span><ArrowRight /></Link>
          <div className="chef-profile-disclaimer">This profile is a frontend demo. Staff identity, permissions, and assignments must come from the authentication/backend layer.</div>
        </section>
      </div>
    </PageFrame>
  )
}
