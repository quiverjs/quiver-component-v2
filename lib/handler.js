import { MiddlewareExtensibleComponent } from './middleware-extensible.js'

class HandlerComponent extends MiddlewareExtensibleComponent {
  constructor(options) {
    super(options)
  }

  get handleableBuilder() {
    throw new Error('unimplemented in abstract class')
  }

  loadHandler(config, options) {
    throw new Error('unimplemented in abstract class')
  }
}
