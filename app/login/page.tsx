'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { ArrowRight, Leaf, LoaderCircle, ShieldCheck } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    const normalizedEmail = email.trim()

    if (!normalizedEmail || !password) {
      setError('Please enter your email and password.')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: normalizedEmail,
          password,
        }),
      })

      const result = await response.json().catch(() => null)

      if (!response.ok) {
        setError(
          result?.message ||
            result?.error ||
            'Sign-in failed. Please check your credentials and try again.',
        )
        return
      }

      // The backend should establish the authenticated session.
      // Do not redirect until the login request succeeds.
      window.location.assign('/app')
    } catch {
      setError(
        'Unable to connect to the authentication service. Please try again.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="login-page">
      <div className="login-card">
        <Link
          href="/"
          className="login-brand"
          aria-label="PlateIQ home"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
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

          <span
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: '#17231B',
              letterSpacing: '-0.04em',
            }}
          >
            Plate<span style={{ color: '#16834B' }}>IQ</span>
          </span>
        </Link>

        <div className="eyebrow" style={{ marginTop: 24 }}>
          RESTAURANT INTELLIGENCE OS
        </div>

        <h1>Welcome back</h1>

        <p>
          Sign in to access your kitchen workspace and operational insights.
        </p>

        <form onSubmit={handleSubmit}>
          <label>
            <span>Kitchen Email</span>

            <input
              type="email"
              name="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@restaurant.com"
              required
              disabled={isLoading}
            />
          </label>

          <label>
            <span>Password</span>

            <input
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
              disabled={isLoading}
            />
          </label>

          {error && (
            <div
              role="alert"
              aria-live="polite"
              style={{
                marginTop: 14,
                padding: '12px 14px',
                borderRadius: 8,
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                color: '#B91C1C',
                fontSize: 13,
                lineHeight: 1.5,
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className="primary-button full"
            disabled={isLoading}
            style={{
              width: '100%',
              marginTop: 22,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 8,
              cursor: isLoading ? 'wait' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? (
              <>
                <LoaderCircle
                  aria-hidden="true"
                  size={16}
                  className="login-spinner"
                />
                Signing in...
              </>
            ) : (
              <>
                Sign In to Kitchen OS
                <ArrowRight aria-hidden="true" size={14} />
              </>
            )}
          </button>
        </form>

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 8,
            marginTop: 22,
            paddingTop: 18,
            borderTop: '1px solid #E2EEE2',
            color: '#69796E',
            fontSize: 11,
            lineHeight: 1.6,
          }}
        >
          <ShieldCheck
            aria-hidden="true"
            size={16}
            style={{ flexShrink: 0, color: '#16834B' }}
          />

          Your account access is managed by PlateIQ authentication.
        </div>

        <div style={{ marginTop: 18, textAlign: 'center', fontSize: 12 }}>
          <Link
            href="/"
            style={{
              color: '#52675A',
              textDecoration: 'none',
            }}
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  )
}