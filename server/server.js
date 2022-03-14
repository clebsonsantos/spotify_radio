import { createServer } from 'http'
import { handle } from './routes.js'


export default createServer(handle)