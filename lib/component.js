export class Component {
  constructor(options={}) {
    var { name='' } = options
    this._name = name
  }

  get name() {
    return this._name
  }
}
