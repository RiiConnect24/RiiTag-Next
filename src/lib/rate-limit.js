import LRU from 'lru-cache';

const rateLimit = (options) => {
  const tokenCache = new LRU({
    max: Number.parseInt(options.uniqueTokenPerInterval || 500, 10),
    maxAge: Number.parseInt(options.interval || 60_000, 10),
  });

  return {
    check: (response, limit, token) =>
      new Promise((resolve, reject) => {
        const tokenCount = tokenCache.get(token) || [0];
        if (tokenCount[0] === 0) {
          tokenCache.set(token, tokenCount);
        }
        tokenCount[0] += 1;

        const currentUsage = tokenCount[0];
        const isRateLimited = currentUsage >= Number.parseInt(limit, 10);
        response.setHeader('X-RateLimit-Limit', limit);
        response.setHeader(
          'X-RateLimit-Remaining',
          isRateLimited ? 0 : limit - currentUsage
        );

        return isRateLimited ? reject() : resolve();
      }),
  };
};

export default rateLimit;
