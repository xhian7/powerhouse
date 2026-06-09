import { Hono } from 'hono'
import { api } from './api'
import { Main } from './ui/server/main'
import { renderToString } from "react-dom/server"
import { serveStatic } from 'hono/bun'

export const app = new Hono()
app.use('/public/*', serveStatic({ root: './' }))
app.route('/api', api)
app.get('/', (c) => c.html(renderToString(<Main />)))