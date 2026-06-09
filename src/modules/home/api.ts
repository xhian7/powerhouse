import { Hono } from 'hono'

export const homeApi = new Hono()
homeApi.get('/greet', (c) => c.text('World!'))