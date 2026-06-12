import { defineModule } from '#core/module'
import { settingsApi } from './api'
import menuSettingsPage from './ui/menuSettings/index.html'

export default defineModule({
    name: 'settings',
    apiBasePath: '/settings',
    api: settingsApi,
    pages: {
        '/pages/menu-settings': menuSettingsPage,
    },
})
