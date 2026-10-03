'use client'

import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Activity,
  Bell,
  ChevronDown,
  CloudRain,
  Gauge,
  LayoutDashboard,
  Leaf,
  Menu,
  Package,
  Settings2,
  Sparkles,
  ClipboardList,
  X,
} from 'lucide-react'
import { navItems, usePlateIQ } from './plateiq-state'

const iconByLabel: Record<string, typeof LayoutDashboard> = {
  Overview: LayoutDashboard,
  'Live Operations': Activity,
  Tasks: ClipboardList,
  Forecasting: Gauge,
  Inventory: Package,
  'Waste Management': Leaf,
  'External Factors': CloudRain,
  'AI Copilot': Sparkles,
  Insights: Activity,
  Settings: Settings2,
}

function isCurrentRoute(pathname: string, href: string) {
  if (href === '/app') return pathname === '/app'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { state, dispatch } = usePlateIQ()
  const [menuOpen, setMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const unreadCount = state.notifications.filter((notification) => !notification.read).length
  const currentItem = [...navItems, ['Chef Profile', '/app/chef-profile'] as const]
    .sort((a, b) => b[1].length - a[1].length)
    .find(([, href]) => isCurrentRoute(pathname, href))

  useEffect(() => {
    setMenuOpen(false)
    setNotificationsOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!menuOpen && !notificationsOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        setNotificationsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [menuOpen, notificationsOpen])

  return (
    <main className="app-shell">
      {menuOpen && (
        <button
          className="sidebar-backdrop"
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <aside id="plateiq-navigation" className={`sidebar ${menuOpen ? 'open' : ''}`} aria-label="Main navigation">
        <div className="brand">
          <div className="brand-mark"><Leaf aria-hidden="true" /></div>
          <span>Plate<span>IQ</span></span>
          <button className="mobile-close" type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <X aria-hidden="true" />
          </button>
        </div>

        <button className="restaurant-switch" type="button" aria-label="Current restaurant: Jubilee Hills, Hyderabad">
          <span className="restaurant-avatar">JH</span>
          <span className="restaurant-switch-copy">
            <strong>Jubilee Hills</strong>
            <small>Hyderabad, India</small>
          </span>
          <ChevronDown aria-hidden="true" />
        </button>

        <div className="sidebar-section-label">WORKSPACE</div>
        <nav className="primary-navigation" aria-label="Workspace">
          {navItems.map(([label, href]) => {
            const Icon = iconByLabel[label] ?? LayoutDashboard
            const active = isCurrentRoute(pathname, href)

            return (
              <Link
                href={href}
                key={label}
                className={`nav-item ${active ? 'active' : ''}`}
                aria-current={active ? 'page' : undefined}
                onClick={() => setMenuOpen(false)}
              >
                <Icon aria-hidden="true" />
                <span>{label}</span>
                {label === 'Live Operations' && <span className="live-pill">LIVE</span>}
                {label === 'AI Copilot' && <span className="new-pill">AI</span>}
              </Link>
            )
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-status"><span className="status-pulse" /> Kitchen intelligence workspace</div>
          <Link href="/app/chef-profile" className={`profile profile-link ${pathname === '/app/chef-profile' ? 'active' : ''}`} onClick={() => setMenuOpen(false)} aria-label="Open chef profile and brigade details">
            <div className="profile-avatar">AM</div>
            <div><strong>Arjun Mehta</strong><small>Restaurant manager</small></div>
          </Link>
        </div>
      </aside>

      <section className="content">
        <header className="topbar">
          <button
            className="menu-button"
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation menu"
            aria-controls="plateiq-navigation"
            aria-expanded={menuOpen}
          >
            <Menu aria-hidden="true" />
          </button>

          <div className="breadcrumbs" aria-label="Breadcrumb">
            <span>Workspace</span><span className="breadcrumb-slash">/</span>
            <strong>{currentItem?.[0] ?? 'Overview'}</strong>
          </div>

          <div className="top-actions">
            <div className="system-live"><span /> <span className="system-live-label">Workspace demo</span></div>

            <div className="notification-wrap">
              <button
                className="icon-button"
                type="button"
                aria-label={unreadCount ? `Notifications, ${unreadCount} unread` : 'Notifications'}
                aria-expanded={notificationsOpen}
                onClick={() => setNotificationsOpen((open) => !open)}
              >
                <Bell aria-hidden="true" />
                {unreadCount > 0 && <i>{unreadCount > 9 ? '9+' : unreadCount}</i>}
              </button>

              {notificationsOpen && (
                <div className="notification-panel" role="dialog" aria-label="Notifications">
                  <div className="notification-head">
                    <strong>Notifications</strong>
                    <button type="button" onClick={() => dispatch({ type: 'read-notifications' })}>Mark all read</button>
                  </div>
                  {state.notifications.length === 0 ? (
                    <p>No operational notifications yet. Start a demo scenario to generate activity.</p>
                  ) : (
                    state.notifications.slice(0, 5).map((notification) => (
                      <Link
                        key={notification.id}
                        href={notification.href}
                        className={`notification-item ${notification.read ? 'read' : ''}`}
                        onClick={() => {
                          dispatch({ type: 'read-notification', notificationId: notification.id })
                          setNotificationsOpen(false)
                        }}
                      >
                        <strong>{notification.title}</strong>
                        <span>{notification.description}</span>
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="demo-switch"><span>Demo mode</span><DemoToggle /></div>
            <div className="top-avatar" aria-label="Signed in as Arjun Mehta">AM</div>
          </div>
        </header>
        {children}
      </section>
    </main>
  )
}

function DemoToggle() {
  const { state, dispatch } = usePlateIQ()

  return (
    <button
      className={state.demo.running ? 'on' : ''}
      type="button"
      onClick={() => dispatch({ type: 'toggle' })}
      aria-label={state.demo.running ? 'Pause demo mode' : 'Start demo mode'}
      aria-pressed={state.demo.running}
    >
      <b />
    </button>
  )
}
