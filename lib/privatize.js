export var privatizedConstructor = Component =>
  (...args) => {
    var component = new Component(...args)

    return (bundle={}) =>
      component.makePrivate(bundle)
  }