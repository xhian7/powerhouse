import { Hono } from 'hono'

export const settingsApi = new Hono()

settingsApi.get('/info', (c) =>
    c.json({
        framework: 'PowerHouse',
        message: 'Settings module is wired up correctly.',
    }),
)
