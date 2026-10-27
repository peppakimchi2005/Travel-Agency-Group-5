import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router'
import { formatPrice } from '../lib/format'

const MAX_ATTEMPTS = 6 // how many times we ask the server
const WAIT_MS = 2000 // pause between attempts

export function OrderSuccess() {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('orderId')

  const [order, setOrder] = useState(null)
  const [checking, setChecking] = useState(true)
  const [problem, setProblem] = useState('') // 'login' | 'notfound' | 'error' | ''

  useEffect(() => {
    if (!orderId) {
      setProblem('notfound')
      setChecking(false)
      return
    }

    let cancelled = false
    let timer
    let attempts = 0

    async function checkOrder() {
      attempts += 1
      try {
        const res = await fetch(`/api/orders/${orderId}`, {
          credentials: 'include', // sends the login cookie
        })
        if (cancelled) return

        if (res.status === 401) {
          setProblem('login')
          setChecking(false)
          return
        }
        if (res.status === 404) {
          setProblem('notfound')
          setChecking(false)
          return
        }
        if (!res.ok) throw new Error('Request failed')

        const data = await res.json()
        if (cancelled) return
        setOrder(data)

        // Webhook may not have arrived yet: wait and ask again.
        if (data.status === 'pending' && attempts < MAX_ATTEMPTS) {
          timer = setTimeout(checkOrder, WAIT_MS)
        } else {
          setChecking(false)
        }
      } catch (err) {
        console.error('Failed to load order', err)
        if (!cancelled) {
          setProblem('error')
          setChecking(false)
        }
      }
    }

    checkOrder()

    // Cleanup: stop checking if the user leaves the page.
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [orderId])

  let content

  if (problem === 'login') {
    content = (
      <>
        <h1 className="text-3xl font-bold text-teal">Please sign in</h1>
        <p className="mt-3 text-blue">Sign in to see your order.</p>
        <Link to="/login" className="mt-4 inline-block font-semibold text-teal underline">
          Go to login
        </Link>
      </>
    )
  } else if (problem === 'notfound') {
    content = (
      <>
        <h1 className="text-3xl font-bold text-teal">Order not found</h1>
        <p className="mt-3 text-blue">We couldn't find that order.</p>
      </>
    )
  } else if (problem === 'error') {
    content = (
      <>
        <h1 className="text-3xl font-bold text-teal">Something went wrong</h1>
        <p className="mt-3 text-blue">We couldn't load your order. Refresh the page to try again.</p>
      </>
    )
  } else if (!order || (checking && order.status === 'pending')) {
    content = (
      <>
        <h1 className="text-3xl font-bold text-teal">Confirming your payment...</h1>
        <p className="mt-3 text-blue">This usually takes a few seconds. Please don't close this page.</p>
      </>
    )
  } else if (order.status === 'paid') {
    content = (
      <>
        <h1 className="text-3xl font-bold text-teal">Payment successful</h1>
        <p className="mt-3 text-blue">Thank you! Your trip is booked.</p>
        <div className="mt-6 rounded-lg bg-white p-5">
          <p className="text-sm text-blue">Order #{order.id}</p>
          {order.items.map((item, i) => (
            <p key={i} className="mt-2 font-semibold text-teal">
              {item.name} × {item.quantity}
            </p>
          ))}
          <p className="mt-3 text-xl font-bold text-blue">{formatPrice(order.totalAmount)}</p>
          <p className="mt-2 inline-block rounded-full bg-teal-light px-3 py-1 text-sm font-semibold text-white">
            Paid
          </p>
        </div>
      </>
    )
  } else if (order.status === 'pending') {
    content = (
      <>
        <h1 className="text-3xl font-bold text-teal">Still waiting for confirmation</h1>
        <p className="mt-3 text-blue">
          We haven't received the payment confirmation yet. Refresh this page in a moment.
        </p>
      </>
    )
  } else {
    content = (
      <>
        <h1 className="text-3xl font-bold text-teal">Payment not completed</h1>
        <p className="mt-3 text-blue">Your order status is: {order.status}.</p>
      </>
    )
  }

  return (
    <div className="bg-sand">
      <div className="mx-auto max-w-[700px] px-6 py-16 text-center">
        {content}
        <Link to="/" className="mt-8 inline-block font-semibold text-teal underline">
          Back to home
        </Link>
      </div>
    </div>
  )
}