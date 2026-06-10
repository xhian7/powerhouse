import { Hono } from 'hono'
import { api } from './api'
import { uiApi } from './ui'
import { renderToString } from "react-dom/server"
import { serveStatic } from 'hono/bun'
import { HtmlTemplate } from './ui/server/htmlTemplate'

export const app = new Hono()
app.use('/public/*', serveStatic({ root: './' }))
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
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <h1>Welcome to the app!</h1>
            </div>
        </div>
    </div>
</HtmlTemplate>)))