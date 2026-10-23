import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { signIn, signUp } from '../lib/auth-client'

/* mode is either "login" or "signup". One component handles both pages. */
export function Login({ mode }) {
  const navigate = useNavigate()
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setBusy(true)

    const form = new FormData(e.currentTarget)
    const email = String(form.get('email'))
    const password = String(form.get('password'))
    const name = String(form.get('name') ?? '')

    try {
      const result =
        mode === 'signup'
          ? await signUp.email({ email, password, name })
          : await signIn.email({ email, password })

      if (result.error) {
        setError(result.error.message ?? 'That did not work. Try again?')
        return
      }
      navigate('/')
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-3xl font-bold text-teal">
        {mode === 'signup' ? 'Create an account' : 'Welcome back'}
      </h1>
      <p className="mt-2 text-sm text-blue">
        {mode === 'signup'
          ? 'Sign up to save your favorite destinations.'
          : 'Sign in to see your saved destinations.'}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {mode === 'signup' && (
          <Field label="Name" name="name" type="text" autoComplete="name" required />
        )}
        <Field label="Email" name="email" type="email" autoComplete="email" required />
        <Field
          label="Password"
          name="password"
          type="password"
          autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
          minLength={8}
          required
          hint="At least 8 characters."
        />

        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full cursor-pointer rounded-full bg-teal px-6 py-3 font-semibold text-white transition hover:bg-teal-light disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? 'One moment...' : mode === 'signup' ? 'Create account' : 'Sign in'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-blue">
        {mode === 'signup' ? (
          <>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-teal underline">
              Sign in
            </Link>
          </>
        ) : (
          <>
            New here?{' '}
            <Link to="/signup" className="font-semibold text-teal underline">
              Create an account
            </Link>
          </>
        )}
      </p>
    </div>
  )
}

/* A label + input pair, so the form above stays short. */
function Field({ label, name, hint, ...inputProps }) {
  const hintId = hint ? `${name}-hint` : undefined

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-teal">
        {label}
      </label>
      <input
        id={name}
        name={name}
        aria-describedby={hintId}
        className="mt-1 w-full rounded-lg border border-thistle bg-white px-3 py-2 outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/20"
        {...inputProps}
      />
      {hint && (
        <p id={hintId} className="mt-1 text-xs text-blue">
          {hint}
        </p>
      )}
    </div>
  )
}