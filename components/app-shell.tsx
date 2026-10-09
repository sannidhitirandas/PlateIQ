'use client'

import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Activity,
  Bell,
  CloudRain,
  Gauge,
  LayoutDashboard,
  Leaf,
  Menu,
  Package,
  Search,
  Settings2,
  Sparkles,
  ClipboardList,
  User,
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
  const router = useRouter()
  const { state, dispatch } = usePlateIQ()
  const [menuOpen, setMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const unreadCount = state.notifications.filter((notification) => !notification.read).length
  const currentItem = [...navItems, ['Chef Profile', '/app/chef-profile'] as const]
    .sort((a, b) => b[1].length - a[1].length)
    .find(([, href]) => isCurrentRoute(pathname, href))

  useEffect(() => {
    setMenuOpen(false)
    setNotificationsOpen(false)
    setSearchOpen(false)
  }, [pathname])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        setNotificationsOpen(false)
        setSearchOpen(false)
      }
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        setSearchOpen((open) => !open)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const searchResults = searchQuery.trim()
    ? [
        ...state.dishes.filter((d) => d.name.toLowerCase().includes(searchQuery.toLowerCase())).map((d) => ({
          title: d.name,
          category: `Dish (${d.category})`,
          href: '/app/kitchen-planner',
        })),
        ...state.inventory.filter((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase())).map((i) => ({
          title: i.name,
          category: `Ingredient (${i.status} stock)`,
          href: '/app/inventory',
        })),
        ...navItems.filter(([label]) => label.toLowerCase().includes(searchQuery.toLowerCase())).map(([label, href]) => ({
          title: label,
          category: 'Page Navigation',
          href,
        })),
      ]
    : []

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

      {/* Sidebar */}
      <aside id="plateiq-navigation" className={`sidebar ${menuOpen ? 'open' : ''}`} aria-label="Main navigation">
        <div className="brand">
          <div className="brand-mark"><Leaf aria-hidden="true" /></div>
          <span>Plate<span>IQ</span></span>
          <button className="mobile-close" type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <X aria-hidden="true" />
          </button>
        </div>

        <div className="restaurant-switch" aria-label={`Current restaurant: ${state.restaurant.name}`}>
          <span className="restaurant-avatar">
            {state.restaurant.name.slice(0, 2).toUpperCase()}
          </span>
          <span className="restaurant-switch-copy">
            <strong>{state.restaurant.name}</strong>
            <small>{state.restaurant.city}, {state.restaurant.country}</small>
          </span>
        </div>

        <nav className="primary-navigation" aria-label="Workspace">
          {navItems.map(([label, href], index) => {
            const Icon = iconByLabel[label] ?? LayoutDashboard
            const active = isCurrentRoute(pathname, href)
            const groupLabel =
              index === 0
                ? 'CORE OPERATIONS'
                : index === 3
                ? 'INTELLIGENCE & PLANNING'
                : index === 7
                ? 'AI ASSISTANT & STRATEGY'
                : index === 9
                ? 'SYSTEM'
                : null

            return (
              <div className="nav-item-group" key={label}>
                {groupLabel && <div className="sidebar-section-label">{groupLabel}</div>}
                <Link
                  href={href}
                  className={`nav-item ${active ? 'active' : ''}`}
                  aria-current={active ? 'page' : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  <Icon aria-hidden="true" />
                  <span>{label}</span>
                </Link>
              </div>
            )
          })}
        </nav>

        <div className="sidebar-bottom">
          <Link
            href="/app/chef-profile"
            className={`profile profile-link ${pathname === '/app/chef-profile' ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
            aria-label="Open chef profile and brigade details"
          >
            <div className="profile-avatar">
              <User style={{ width: 14, height: 14 }} />
            </div>
            <div>
              <strong>Head Chef</strong>
              <small>{state.restaurant.name}</small>
            </div>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
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
            <span>Workspace</span>
            <span className="breadcrumb-slash">/</span>
            <strong>{currentItem?.[0] ?? 'Overview'}</strong>
          </div>

          {/* Quick Search Input */}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 12px',
              borderRadius: 8,
              border: '1px solid #DCE5DA',
              background: '#F8FAF6',
              color: '#6F8073',
              fontSize: 11,
              width: 'min(280px, 35vw)',
              cursor: 'pointer',
            }}
          >
            <Search style={{ width: 14, height: 14 }} />
            <span style={{ flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Search items, tickets, pages...
            </span>
            <kbd style={{ fontSize: 9, background: '#E2EBE0', padding: '1px 4px', borderRadius: 4, color: '#174B32' }}>⌘K</kbd>
          </button>

          <div className="top-actions">
            {/* Notifications Wrap */}
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
                    <p style={{ padding: '12px 0', fontSize: 12, color: '#718576', textAlign: 'center' }}>
                      No notifications at this time.
                    </p>
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

            <Link href="/app/chef-profile" className="top-avatar" aria-label="Signed in as Head Chef" title="Head Chef Profile">
              <User style={{ width: 16, height: 16 }} />
            </Link>
          </div>
        </header>

        {children}
      </section>

      {/* Quick Search Modal */}
      {searchOpen && (
        <div className="drawer-backdrop" role="presentation" onClick={() => setSearchOpen(false)}>
          <div
            style={{
              position: 'fixed',
              top: '15%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'min(540px, 92vw)',
              background: '#fff',
              borderRadius: 16,
              boxShadow: '0 20px 60px rgba(10,35,20,0.18)',
              border: '1px solid #DCE5DA',
              zIndex: 140,
              padding: 18,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 12, borderBottom: '1px solid #E5EBE2' }}>
              <Search style={{ width: 18, height: 18, color: '#16834B' }} />
              <input
                type="text"
                autoFocus
                placeholder="Type to search dishes, ingredients, or pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ flex: 1, border: 0, outline: 'none', fontSize: 13, color: '#17231B' }}
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                style={{ border: 0, background: 'none', color: '#718576', cursor: 'pointer', fontSize: 12 }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginTop: 12, maxHeight: 280, overflowY: 'auto' }}>
              {searchResults.length > 0 ? (
                searchResults.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    onClick={() => setSearchOpen(false)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 12px',
                      borderRadius: 8,
                      marginBottom: 4,
                      background: '#F8FAF6',
                      color: '#17231B',
                      fontSize: 12,
                    }}
                  >
                    <strong>{item.title}</strong>
                    <span style={{ fontSize: 10, color: '#68826D' }}>{item.category}</span>
                  </Link>
                ))
              ) : searchQuery ? (
                <p style={{ margin: '14px 0', fontSize: 12, color: '#78897C', textAlign: 'center' }}>No matching results found.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11, color: '#6E8072' }}>
                  <span style={{ fontWeight: 700, color: '#174B32' }}>Quick Navigation:</span>
                  <Link href="/app" onClick={() => setSearchOpen(false)}>• Overview Dashboard</Link>
                  <Link href="/app/live-operations" onClick={() => setSearchOpen(false)}>• Live Operations &amp; KDS</Link>
                  <Link href="/app/kitchen-planner" onClick={() => setSearchOpen(false)}>• Tasks &amp; Prep Schedule</Link>
                  <Link href="/app/demand-forecast" onClick={() => setSearchOpen(false)}>• Demand Forecasting</Link>
                  <Link href="/app/inventory" onClick={() => setSearchOpen(false)}>• Inventory Intelligence</Link>
                  <Link href="/app/waste-intelligence" onClick={() => setSearchOpen(false)}>• Food Waste Management</Link>
                  <Link href="/app/copilot" onClick={() => setSearchOpen(false)}>• AI Copilot Strategy Hub</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
