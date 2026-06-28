import { Redis } from '@upstash/redis';

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const isRedisConfigured =
  redisUrl &&
  redisUrl !== 'your-upstash-redis-url-here' &&
  redisToken &&
  redisToken !== 'your-upstash-redis-token-here';

if (!isRedisConfigured) {
  console.warn(
    '[redis] UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN is not set. ' +
    'Caching will be bypassed.'
  );
}

export const redis = isRedisConfigured
  ? new Redis({
      url: redisUrl,
      token: redisToken,
    })
  : null;
