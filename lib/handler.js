import { Component } from './component.js'

export class HandlerComponent extends Component {
  get handleableBuilder() {
    throw new Error('unimplemented in abstract class')
  }

  loadHandleable(config, options) {
    throw new Error('unimplemented in abstract class')
  }

  loadHandler(config, options) {
    throw new Error('unimplemented in abstract class')
  }
}
