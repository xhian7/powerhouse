export function Menu() {
    return <div>
        <div className="app-menu-header">
            <span>Main Menu</span>
        </div>
        <div>
            <div
                className="app-menu-item"
                hx-get="/pages/home"
                hx-target="#page-content"
                hx-disabled-elt="this">
                <span>Counter (demo)</span>
            </div>
            <div
                className="app-menu-item"
                hx-get="/pages/greet"
                hx-target="#page-content"
                hx-disabled-elt="this">
                <span>Greeting</span>
            </div>
        </div>
    </div>
}