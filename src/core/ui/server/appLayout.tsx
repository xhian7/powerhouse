import { Menu } from "./menu";

export function AppLayout() {
    return <div className="app-layout">
        <div className="app-menu">
            <Menu />
        </div>
        <div className="app-page-content" id="page-content">
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
                <h1>Welcome to the app!</h1>
            </div>
        </div>
    </div>
}