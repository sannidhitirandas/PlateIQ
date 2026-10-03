'use client'

import { useState } from 'react'
import { Activity, Check, Cloud, Database, RotateCcw, ShieldCheck, SlidersHorizontal, Sparkles, Thermometer } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { usePlateIQ } from '@/components/plateiq-state'

function SettingToggle({ checked, onChange, label }: { checked: boolean; onChange: (value: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`settings-toggle ${checked ? 'on' : ''}`}
      onClick={() => onChange(!checked)}
    >
      <span />
    </button>
  )
}

export default function SettingsPage() {
  const { state, dispatch } = usePlateIQ()
  const [notifications, setNotifications] = useState(true)
  const [copilot, setCopilot] = useState(true)
  const [deviceSignals, setDeviceSignals] = useState(false)
  const [costThreshold, setCostThreshold] = useState(32)
  const [wasteThreshold, setWasteThreshold] = useState(4.5)
  const [integrations, setIntegrations] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState(false)

  const toggleIntegration = (name: string) => {
    setIntegrations((current) => ({ ...current, [name]: !current[name] }))
    setSaved(false)
  }

  return (
    <AppShell>
      <div className="page-body settings-workspace">
        <div className="page-heading">
          <div>
            <div className="eyebrow">WORKSPACE CONFIGURATION</div>
            <h1>Kitchen settings</h1>
            <p>Manage the demo workspace, AI assistance, operational thresholds, and integration placeholders.</p>
          </div>
          <span className="settings-demo-badge">LOCAL DEMO SETTINGS</span>
        </div>

        <div className="settings-notice">
          <ShieldCheck aria-hidden="true" />
          <p><strong>Frontend demo configuration.</strong> These preferences are held in this page session only. Device connections, integrations, and remote persistence require backend support.</p>
        </div>

        <div className="settings-layout">
          <section className="panel settings-card settings-restaurant-card">
            <div className="settings-card-heading"><div className="settings-icon"><Activity /></div><div><h2>Restaurant profile</h2><p>Workspace identity and service defaults</p></div></div>
            <div className="settings-detail-row"><span>Restaurant</span><strong>{state.restaurant.name}</strong></div>
            <div className="settings-detail-row"><span>Location</span><strong>{state.restaurant.city}, {state.restaurant.country}</strong></div>
            <div className="settings-detail-row"><span>Service window</span><strong>Lunch 11:00–15:00 · Dinner 17:00–22:00</strong></div>
            <div className="settings-detail-row"><span>Currency</span><strong>{state.restaurant.currency}</strong></div>
            <div className="settings-detail-row"><span>Workspace mode</span><strong>Interactive demo</strong></div>
          </section>

          <section className="panel settings-card">
            <div className="settings-card-heading"><div className="settings-icon"><Sparkles /></div><div><h2>AI Copilot</h2><p>Choose which assistance is shown in this session</p></div></div>
            <div className="settings-option"><div><strong>Copilot recommendations</strong><small>Show decision-support panels and next-step suggestions.</small></div><SettingToggle checked={copilot} onChange={(value) => { setCopilot(value); setSaved(false) }} label="Copilot recommendations" /></div>
            <div className="settings-option"><div><strong>Operational notifications</strong><small>Show generated demo events in the notification panel.</small></div><SettingToggle checked={notifications} onChange={(value) => { setNotifications(value); setSaved(false) }} label="Operational notifications" /></div>
            <div className="settings-option"><div><strong>Live demo simulation</strong><small>Runs the existing shared demo simulation; not a real sensor feed.</small></div><SettingToggle checked={state.demo.running} onChange={() => dispatch({ type: 'toggle' })} label="Live demo simulation" /></div>
          </section>

          <section className="panel settings-card">
            <div className="settings-card-heading"><div className="settings-icon"><SlidersHorizontal /></div><div><h2>Cost & waste thresholds</h2><p>Local alert thresholds for the demo interface</p></div></div>
            <label className="settings-range"><span>Target food cost <strong>{costThreshold}%</strong></span><input type="range" min="20" max="45" step="1" value={costThreshold} onChange={(event) => { setCostThreshold(Number(event.target.value)); setSaved(false) }} /><small>Reference range: 20–45% · does not change backend calculations.</small></label>
            <label className="settings-range"><span>Waste alert threshold <strong>{wasteThreshold.toFixed(1)} kg</strong></span><input type="range" min="1" max="12" step="0.5" value={wasteThreshold} onChange={(event) => { setWasteThreshold(Number(event.target.value)); setSaved(false) }} /><small>Alert threshold preview only; server-side rules are not configured.</small></label>
          </section>

          <section className="panel settings-card">
            <div className="settings-card-heading"><div className="settings-icon"><Thermometer /></div><div><h2>Kitchen devices & sensors</h2><p>Device readiness placeholders</p></div></div>
            <div className="settings-option"><div><strong>Temperature sensor signals</strong><small>Enable the sensor status preview in this browser session.</small></div><SettingToggle checked={deviceSignals} onChange={(value) => { setDeviceSignals(value); setSaved(false) }} label="Temperature sensor signals" /></div>
            <div className="settings-detail-row"><span>Temperature monitor</span><strong className={deviceSignals ? 'settings-status connected' : 'settings-status'}>{deviceSignals ? 'Demo enabled' : 'Not connected'}</strong></div>
            <div className="settings-detail-row"><span>Kitchen display</span><strong className="settings-status">Demo queue only</strong></div>
          </section>

          <section className="panel settings-card settings-integrations">
            <div className="settings-card-heading"><div className="settings-icon"><Cloud /></div><div><h2>Enterprise integrations</h2><p>Connection states are visual placeholders, not real integrations</p></div></div>
            {['POS / order management', 'Inventory / procurement', 'Weather & local events'].map((name) => (
              <div className="settings-integration-row" key={name}>
                <div><strong>{name}</strong><small>{integrations[name] ? 'Demo connection enabled in this session' : 'No backend connection configured'}</small></div>
                <button type="button" className="outline-button" onClick={() => toggleIntegration(name)}>{integrations[name] ? 'Disable demo' : 'Preview connect'}</button>
              </div>
            ))}
          </section>
        </div>

        <div className="settings-footer">
          <span className="settings-save-status" role="status">{saved ? <><Check aria-hidden="true" /> Demo preferences updated in this session.</> : 'Changes are local to this page session.'}</span>
          <div>
            <button type="button" className="outline-button" onClick={() => dispatch({ type: 'reset-data' })}><RotateCcw aria-hidden="true" /> Reset application data</button>
            <button type="button" className="primary-button" onClick={() => setSaved(true)}><Database aria-hidden="true" /> Apply demo preferences</button>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
