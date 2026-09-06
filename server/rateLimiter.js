// ============================================
// LIGHTWEIGHT IN-MEMORY RATE LIMITER
// Protects endpoints from brute-force & spam
// ============================================

export function createRateLimiter({ windowMs = 15 * 60 * 1000, max = 10, message = 'Too many requests, please try again later.' } = {}) {
  const requests = new Map()

  // Periodically clean up expired entries
  setInterval(() => {
    const now = Date.now()
    for (const [ip, data] of requests.entries()) {
      if (now > data.resetTime) {
        requests.delete(ip)
      }
    }
  }, windowMs).unref() // unref so it won't prevent process exit

  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown'
    const now = Date.now()

    let record = requests.get(ip)

    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + windowMs,
      }
      requests.set(ip, record)
      return next()
    }

    record.count += 1

    if (record.count > max) {
      const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000)
      res.set('Retry-After', retryAfterSeconds.toString())
      return res.status(429).json({ message, retryAfter: retryAfterSeconds })
    }

    next()
  }
}
