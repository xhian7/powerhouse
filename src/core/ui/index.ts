import { Hono } from 'hono'
import { menuApi } from './server/menu'

export const uiApi = new Hono()
uiApi.route('/', menuApi)
