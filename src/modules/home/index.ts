import { api } from "#core/api";
import { homeApi } from "./api";
export { default as homePage } from './ui/counterDemo/index.html'
export { default as greetPage } from './ui/greet/index.html'

// Register the homeApi routes under the main api
api.route('/home', homeApi)
