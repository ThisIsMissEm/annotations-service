import { ApplicationService } from '@adonisjs/core/types'
import { ShieldConfig } from '@adonisjs/shield/types'

export default class ShieldProvider {
  constructor(protected app: ApplicationService) {}

  async register() {
    const { default: ShieldMiddleware } = await import('#middleware/shield_middleware')
    this.app.container.bind(ShieldMiddleware, async () => {
      const config = this.app.config.get<ShieldConfig>('shield', {})
      const encryption = await this.app.container.make('encryption')
      if (this.app.usingEdgeJS) {
        const edge = await import('edge.js')
        return new ShieldMiddleware(config, encryption, edge.default)
      }
      return new ShieldMiddleware(config, encryption)
    })
  }
}
