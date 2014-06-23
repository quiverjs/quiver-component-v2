class Component {
  constructor() {
    this._sourceStack = new Error().stack
  }

  get name() {
    throw new Error('unimplemented')
  }

  get sourceStack() {
    return this._sourceStack
  }

  freeze() {
    this._frozen = true
  }

  get isFrozen() {
    return this._frozen
  }
}
