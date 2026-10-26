function getClientIp(req) {
  const cloudflareIp = req.get("cf-connecting-ip");
  if (cloudflareIp) return cloudflareIp.trim();

  const forwardedFor = req.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();

  return req.ip || req.socket.remoteAddress || "unknown";
}

function createRateLimiter({ windowMs, max, message }) {
  const windows = new Map();
  let lastCleanup = 0;

  return function rateLimit(req, res, next) {
    const now = Date.now();
    if (now - lastCleanup >= windowMs) {
      for (const [ip, window] of windows) {
        if (window.resetAt <= now) windows.delete(ip);
      }
      lastCleanup = now;
    }

    const ip = getClientIp(req);
    let current = windows.get(ip);
    if (!current || current.resetAt <= now) {
      current = { count: 0, resetAt: now + windowMs };
      windows.set(ip, current);
    }
    if (current.count >= max) {
      res.set("Retry-After", String(Math.ceil((current.resetAt - now) / 1000)));
      return res.status(429).json({ ok: false, errors: [message] });
    }

    current.count += 1;
    return next();
  };
}

module.exports = { createRateLimiter, getClientIp };
