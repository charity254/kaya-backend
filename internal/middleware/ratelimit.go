package middleware

import (
	"sync"
	"time"
)

type requestInfo struct {
	count int
	windowStart time.Time //when the current 15 minute window starts
}

type RateLimiter struct {
	mu sync.Mutex
	requests map[string]requestInfo
	limit int
	window time.Duration
}

func NewRateLimiter(limit int, window time.Duration) *RateLimiter {
	return &RateLimiter{
		requests: make(map[string]requestInfo),
		limit: limit,
		window: window,
	}
}

func (rl *RateLimiter) IsAllowed(identifier string) bool {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	now := time.Now()
	info, exists := rl.requests[identifier]

	if !exists || now.Sub(info.windowStart) > rl.window {
		rl.requests[identifier] = requestInfo{
			count:	        1,
			windowStart:	now,
		}
		return true
	}
	if info.count >= rl.limit {
		return false
	}

	rl.requests[identifier] = requestInfo{
		count:       info.count+1,
		windowStart: info.windowStart,
	}
	return true
}