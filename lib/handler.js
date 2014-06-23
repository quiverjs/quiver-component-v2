import { MiddlewareExtensibleComponent } from './middleware-extensible.js'

class HandlerComponent extends MiddlewareExtensibleComponent {
  get handleableBuilder() {
    throw new Error('unimplemented in abstract class')
  }
}
