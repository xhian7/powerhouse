import { sql } from "bun"

async function createMenuTable() {
    return await sql`
        CREATE TABLE IF NOT EXISTS menu_items (
            id VARCHAR(50) PRIMARY KEY NOT NULL,
            "displayName" TEXT NOT NULL,
            description TEXT NOT NULL DEFAULT '',
            "targetUrl" TEXT,
            "parentId" VARCHAR(50),
            FOREIGN KEY ("parentId") REFERENCES menu_items(id) ON DELETE SET NULL
        )
    `
}

await createMenuTable()

export async function seedMenuItems() {
    return await sql`
        INSERT INTO menu_items (id, "displayName", description, "targetUrl", "parentId")
        VALUES
            ('MainMenu', 'Main Menu', 'The main menu of the app', NULL, NULL),
            ('Home', 'Home', 'Go to home page', '/pages/home', 'MainMenu'),
            ('Greet', 'Greet', 'Go to greeting page', '/pages/greet', 'MainMenu'),
            ('Settings', 'Settings', 'Go to settings page', NULL, 'MainMenu'),
            ('MenuSettings', 'Menu Settings', 'Go to menu settings page', '/pages/menu-settings', 'Settings')
        ON CONFLICT DO NOTHING`
}

export type MenuItem = {
    id: string
    displayName: string
    description: string
    targetUrl: string | null
    parentId: string | null
    children?: MenuItem[]
}

export async function getMenuItemById({
    id,
    withChildren = false
}: { id: string, withChildren?: boolean }) {

    const menuItem = await sql`
        SELECT * FROM menu_items WHERE id = ${id}
    `

    if (menuItem.length === 0) {
        return null
    }

    if (withChildren) {
        const childItems = await sql`
                SELECT * FROM menu_items WHERE "parentId" = ${id}
            `
        return { ...menuItem[0], children: childItems }
    }

    return menuItem[0]
}