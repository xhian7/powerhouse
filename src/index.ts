import { homePage, greetPage } from '#modules/home'
// Important: The order of imports matters. The app must be imported after the pages to avoid circular dependencies.
import { app } from '#core/index'

const server = Bun.serve({
    routes: {
        '/pages/home': homePage,
        '/pages/greet': greetPage
    },
    fetch: app.fetch,
})

console.log(`Server running at ${server.url}`)