import { Component } from './component.js'

export class MiddlewareComponent extends Component {
  constructor(options) {
    super(options)
  }

  get handleableMiddleware() {
    throw new Error('unimplemented in abstract class')
  }
}
