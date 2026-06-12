import { defineModule } from '#core/module'
import { homeApi } from './api'
import counterDemoPage from './ui/counterDemo/index.html'
import greetPage from './ui/greet/index.html'

export default defineModule({
    name: 'home',
    apiBasePath: '/home',
    api: homeApi,
    pages: {
        '/pages/home': counterDemoPage,
        '/pages/greet': greetPage,
    },
})
