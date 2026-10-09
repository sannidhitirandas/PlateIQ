import Link from 'next/link'
import {
  ArrowRight,
  Leaf,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Zap,
} from 'lucide-react'

const workflowSteps = [
  {
    step: '01',
    title: 'Forecast',
    description:
      'Plan for expected demand using forecasting insights and operational data.',
    icon: TrendingUp,
  },
  {
    step: '02',
    title: 'Prepare',
    description:
      'Organize preparation batches around expected demand and ingredient requirements.',
    icon: Zap,
  },
  {
    step: '03',
    title: 'Monitor',
    description:
      'Review kitchen activity, station workloads, and ingredient inventory in one workspace.',
    icon: ShieldCheck,
  },
  {
    step: '04',
    title: 'Adapt',
    description:
      'Use operational insights to respond to changing demand and kitchen conditions.',
    icon: Sparkles,
  },
  {
    step: '05',
    title: 'Reduce Waste',
    description:
      'Identify opportunities to improve ingredient usage, reduce surplus, and control costs.',
    icon: Leaf,
  },
]

export default function LandingPage() {
  return (
    <main className="landing">
      {/* Navigation */}
      <nav className="landing-nav" aria-label="Main navigation">
        <Link
          href="/"
          aria-label="PlateIQ home"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
          <div
            className="brand-mark"
            style={{
              width: 28,
              height: 28,
              background: '#174B32',
              color: '#fff',
              borderRadius: 8,
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <Leaf aria-hidden="true" style={{ width: 16, height: 16 }} />
          </div>

          <strong style={{ fontSize: 22, letterSpacing: '-0.04em' }}>
            Plate<span style={{ color: '#16834B' }}>IQ</span>
          </strong>
        </Link>

        <div
          style={{
            display: 'flex',
            gap: 16,
            alignItems: 'center',
          }}
        >
          <Link
            href="/app"
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: '#2D3E35',
              textDecoration: 'none',
            }}
          >
            Explore Platform
          </Link>

          <Link
            href="/login"
            className="primary-button"
            style={{ padding: '8px 16px', fontSize: 12 }}
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div>
          <div
            className="eyebrow"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: '#16834B',
            }}
          >
            <Sparkles aria-hidden="true" style={{ width: 14, height: 14 }} />
            INTELLIGENT KITCHEN OPERATIONS
          </div>

          <h1>
            Know what your kitchen needs <em>before</em> your customers do.
          </h1>

          <p>
            Forecast demand, plan preparation, monitor inventory, and
            discover opportunities to reduce food waste—all through one
            intelligent kitchen operations workspace.
          </p>

          <div className="hero-actions">
            <Link
              href="/app"
              className="primary-button"
              style={{
                padding: '12px 24px',
                fontSize: 13,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              Explore PlateIQ
              <ArrowRight aria-hidden="true" style={{ width: 16, height: 16 }} />
            </Link>

            <a
              href="#how"
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: '#174B32',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                textDecoration: 'none',
              }}
            >
              See How It Works <span aria-hidden="true">↓</span>
            </a>
          </div>

          {/* Platform capabilities */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 18,
              marginTop: 28,
            }}
          >
            {[
              'Demand Planning',
              'Inventory Intelligence',
              'Waste Reduction',
            ].map((item) => (
              <div
                key={item}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 11,
                  color: '#52675A',
                }}
              >
                <ShieldCheck
                  aria-hidden="true"
                  style={{
                    width: 14,
                    height: 14,
                    color: '#16834B',
                    flexShrink: 0,
                  }}
                />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Product Preview */}
        <div className="hero-card">
          <div
            className="section-kicker"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            <span>Kitchen Intelligence</span>

            <span
              className="status-badge"
              style={{
                background: '#E2F2E5',
                color: '#174B32',
              }}
            >
              Operations Workspace
            </span>
          </div>

          <h2>One workspace. Better-informed decisions.</h2>

          <p
            style={{
              color: '#69796E',
              fontSize: 13,
              lineHeight: 1.7,
              margin: '12px 0 20px',
            }}
          >
            Explore the tools that help restaurant teams understand demand,
            organize preparation, monitor inventory, and improve daily
            operations.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: 10,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                padding: 14,
                borderRadius: 10,
                background: '#F0F8F0',
              }}
            >
              <TrendingUp
                aria-hidden="true"
                style={{
                  width: 18,
                  height: 18,
                  color: '#16834B',
                  marginBottom: 10,
                }}
              />

              <strong
                style={{
                  display: 'block',
                  fontSize: 13,
                  color: '#174B32',
                }}
              >
                Forecasting
              </strong>

              <span
                style={{
                  display: 'block',
                  marginTop: 5,
                  fontSize: 11,
                  color: '#69796E',
                  lineHeight: 1.5,
                }}
              >
                Understand demand patterns
              </span>
            </div>

            <div
              style={{
                padding: 14,
                borderRadius: 10,
                background: '#F0F8F0',
              }}
            >
              <Leaf
                aria-hidden="true"
                style={{
                  width: 18,
                  height: 18,
                  color: '#16834B',
                  marginBottom: 10,
                }}
              />

              <strong
                style={{
                  display: 'block',
                  fontSize: 13,
                  color: '#174B32',
                }}
              >
                Waste Management
              </strong>

              <span
                style={{
                  display: 'block',
                  marginTop: 5,
                  fontSize: 11,
                  color: '#69796E',
                  lineHeight: 1.5,
                }}
              >
                Identify improvement opportunities
              </span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              paddingTop: 16,
              borderTop: '1px solid #E2EEE2',
            }}
          >
            <img
              src="/chicken-biryani.png"
              alt="Chicken biryani representing restaurant food preparation"
              style={{
                width: 76,
                height: 76,
                objectFit: 'cover',
                borderRadius: 10,
                flexShrink: 0,
              }}
            />

            <div>
              <strong
                style={{
                  display: 'block',
                  color: '#174B32',
                  fontSize: 13,
                }}
              >
                Connected Kitchen Operations
              </strong>

              <p
                style={{
                  margin: '5px 0 0',
                  fontSize: 11,
                  lineHeight: 1.6,
                  color: '#69796E',
                }}
              >
                Bring essential kitchen planning and operational tools
                together in one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="how" aria-labelledby="how-heading">
        <div className="eyebrow" style={{ color: '#16834B' }}>
          HOW PLATEIQ WORKS
        </div>

        <h2 id="how-heading">
          From uncertainty to smarter kitchen decisions.
        </h2>

        <p
          style={{
            maxWidth: 620,
            margin: '12px auto 0',
            textAlign: 'center',
            color: '#69796E',
            fontSize: 13,
            lineHeight: 1.8,
          }}
        >
          Connect the decisions that matter across your kitchen, from
          anticipating demand to making better use of ingredients.
        </p>

        <div className="steps">
          {workflowSteps.map((item) => {
            const Icon = item.icon

            return (
              <article key={item.step}>
                <span>{item.step}</span>

                <Icon
                  aria-hidden="true"
                  style={{
                    width: 22,
                    height: 22,
                    color: '#16834B',
                    margin: '14px 0',
                  }}
                />

                <strong>{item.title}</strong>

                <p>{item.description}</p>
              </article>
            )
          })}
        </div>
      </section>

      {/* Call to Action */}
      <section className="landing-cta">
        <div className="eyebrow" style={{ color: '#B8E5C5' }}>
          INTELLIGENT KITCHEN OPERATIONS
        </div>

        <h2>Turn kitchen uncertainty into informed decisions.</h2>

        <p
          style={{
            maxWidth: 560,
            margin: '12px auto 22px',
            color: 'inherit',
            fontSize: 13,
            lineHeight: 1.8,
            opacity: 0.85,
          }}
        >
          Explore PlateIQ&apos;s approach to demand forecasting, inventory
          intelligence, kitchen operations, and waste management.
        </p>

        <Link
          href="/app"
          className="primary-button"
          style={{
            padding: '14px 28px',
            fontSize: 14,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          Explore the Platform
          <ArrowRight aria-hidden="true" style={{ width: 16, height: 16 }} />
        </Link>
      </section>

      {/* Footer */}
      <footer
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
          padding: '24px 0',
          fontSize: 11,
          color: '#69796E',
        }}
      >
        <span>© {new Date().getFullYear()} PlateIQ</span>

        <span>Intelligent Kitchen Operations</span>

        <Link
          href="/login"
          style={{
            color: '#174B32',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          Sign In
        </Link>
      </footer>
    </main>
  )
}