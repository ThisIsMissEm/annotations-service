import { ApplicationService } from '@adonisjs/core/types'
import { configProvider } from '@adonisjs/core'

import BaseProvider from '@adonisjs/session/session_provider'
import { RuntimeException } from '@adonisjs/core/exceptions'

export default class SessionProvider extends BaseProvider {
  constructor(protected app: ApplicationService) {
    super(app)
  }

  async register() {
    const { default: SessionMiddleware } = await import('#middleware/session_middleware')
    this.app.container.singleton(SessionMiddleware, async (resolver) => {
      const sessionConfigProvider = this.app.config.get('session', {})
      const config = await configProvider.resolve<any>(this.app, sessionConfigProvider)
      if (!config) {
        throw new RuntimeException(
          'Invalid "config/session.ts" file. Make sure you are using the "defineConfig" method'
        )
      }
      const emitter = await resolver.make('emitter')
      return new SessionMiddleware(config, emitter)
    })
  }
}
