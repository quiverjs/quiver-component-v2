import { Component } from './component.js'

export class MiddlewareComponent extends Component {
  get handleableMiddleware() {
    throw new Error('unimplemented in abstract class')
  }
}
