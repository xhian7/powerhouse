import { Hono } from 'hono'
import { renderToString } from 'react-dom/server'
import { getMenuItemById, type MenuItem, seedMenuItems } from './db'

await seedMenuItems()

function MenuItems(props: { items: MenuItem[] }) {
    return <>
        {props.items.map(child => {
            if (!child.targetUrl) {
                return <div
                    key={child.id}
                    className="app-menu-item"
                    hx-get={`/ui/submenu/${child.id}`}
                    hx-swap="outerHTML">
                    <span>{child.displayName}</span>
                </div>
            }
            return <div
                key={child.id}
                className="app-menu-item"
                hx-get={child.targetUrl}
                hx-target="#page-content"
                hx-disabled-elt="this">
                <span>{child.displayName}</span>
            </div>
        })}
    </>
}

function SubMenu(props: { menu: MenuItem, collapse?: boolean }) {
    if (props.collapse) {
        return <div
            key={props.menu.id}
            className="app-menu-item"
            hx-get={`/ui/submenu/${props.menu.id}`}
            hx-swap="outerHTML">
            <span>{props.menu.displayName}</span>
        </div>
    }
    return <div id={`submenu-${props.menu.id}`}>
        <div
            key={props.menu.id}
            className="app-menu-item"
            hx-get={`/ui/submenu/${props.menu.id}/collapse`}
            hx-target={`#submenu-${props.menu.id}`}
            hx-swap="outerHTML">
            <span>{props.menu.displayName}</span>
        </div>
        <div className="app-menu-submenu">
            <MenuItems items={props.menu.children || []} />
        </div>
    </div>
}

export function Menu(props: { menu: MenuItem }) {
    return <>
        <div className="app-menu-header">
            <span>{props.menu.displayName}</span>
        </div>
        <div>
            <MenuItems items={props.menu.children || []} />
        </div>
    </>
}

export const menuApi = new Hono()
menuApi.get('/menu/:id', async (c) => {
    const { id } = c.req.param()

    const menu = await getMenuItemById({ id, withChildren: true })

    if (!menu) {
        return c.text('Menu not found', 404)
    }

    return c.html(renderToString(<Menu menu={menu} />))
})
menuApi.get('/submenu/:id', async (c) => {
    const { id } = c.req.param()

    const menu = await getMenuItemById({ id, withChildren: true })
    if (!menu) {
        return c.text('Menu not found', 404)
    }
    return c.html(renderToString(<SubMenu menu={menu} />))
})
menuApi.get('/submenu/:id/collapse', async (c) => {
    const { id } = c.req.param()

    const menu = await getMenuItemById({ id, withChildren: true })
    if (!menu) {
        return c.text('Menu not found', 404)
    }

    return c.html(renderToString(<SubMenu menu={menu} collapse={true} />))
})