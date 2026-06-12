import { Hono } from 'hono'
import { api } from './api'
import { uiApi } from './ui'
import { renderToString } from "react-dom/server"
import { serveStatic } from 'hono/bun'
import { HtmlTemplate } from './ui/server/htmlTemplate'
import { modules } from '#modules/index'

export const app = new Hono()

app.use('/public/*', serveStatic({ root: './' }))

// Discover every module's API and mount it under `/api/<basePath>`.
for (const module of modules) {
    if (module.api && module.apiBasePath) {
        api.route(module.apiBasePath, module.api)
    }
}

app.route('/api', api)
app.route('/ui', uiApi)

app.get('/', (c) => c.html(renderToString(<HtmlTemplate
    title="My App"
    customHeadChildren={<link rel="stylesheet" href="/public/appLayout.css" />}>
    <div className="app-layout">
        <div className="app-menu"
            hx-get='/ui/menu/MainMenu'
            hx-trigger='load'>
        </div>
        <div className="app-page-content" id="page-content">
            <div className="app-welcome">
                <h1>Welcome to the app!</h1>
            </div>
        </div>
    </div>
</HtmlTemplate>)))

app.notFound((c) => c.text('Not found', 404))

app.onError((err, c) => {
    console.error('Unhandled error:', err)
    return c.text('Internal Server Error', 500)
})