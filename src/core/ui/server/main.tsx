import { HtmlTemplate } from "./htmlTemplate";
import { AppLayout } from "./appLayout";

export function Main() {
    return <HtmlTemplate 
    title="My App"
    customHeadChildren={<link rel="stylesheet" href="/public/appLayout.css" />}>
        <AppLayout />
    </HtmlTemplate>
}