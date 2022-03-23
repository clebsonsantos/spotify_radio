import { Service } from './service.js';
import { logger } from './util.js';

export class Controller {
  constructor(){
    this.service = new Service()
  }

  async getFileStream(filename){
    return this.service.getFileStream(filename)
  }
  async handleCommand({ comamnd }){
    logger.info(`command received: ${comamnd}`)
    const cmd = comamnd.toLowerCase()
    const result = {
       result: "ok"
    }
    if(cmd.includes('start')){
      this.service.startStreamming()
      return result
    }

    if(cmd.includes('stop')){
      this.service.stopStreamming()
      return result
    }
    return this.service.startStreamming()
  }

  createClientStream(){
    const {id, clientStream} = this.service.createClientStream()

    const onClose = () => {
      logger.info(`closing connection of ${id}`)
      this.service.removeClientStream(id)
    }

    return {
      stream: clientStream,
      onClose
    }
  }
}