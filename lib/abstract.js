import { 
  ExtensibleHandler, ExtensibleMiddleware 
} from './extensible-component'

var defineAbstractComponent = (Parent, mixin) => {
  class AbstractComponent extends Parent {
    constructor(componentKey) {
      this._componentKey = componentKey
    }

    implement(componentMap) {
      super.implement(componentMap)

      if(this._concreteComponent) return

      var componentKey = this._componentKey
      var concreteComponent = componentMap[componentKey]

      if(!concreteComponent) return

      this.validateConcreteComponent(concreteComponent)

      this._concreteComponent = concreteComponent
    }

    doFork(forkedInstance, forkTable) {
      if(this._concreteComponent) {
        forkedInstance._concreteComponent =
          this._concreteComponent.fork(forkTable)
      }

      super.doFork(forkedInstance, forkTable)
    }
  }

  Object.assign(AbstractComponent.prototype, mixin)

  return AbstractComponent
}

export var AbstractHandler = defineAbstractComponent(
  ExtensibleHandler, {
    toMainHandleableBuilder() {
      var concreteComponent = this._concreteComponent

      if(!concreteComponent) {
        throw new Error('Abstract handler component '+ 
          'not implemented: ' + this._componentKey)
      }

      return concreteComponent.toHandleableBuilder()
    },

    validateConcreteComponent(component) {
      if(!concreteComponent.isHandlerComponent()) {
        throw new Error('Concrete component in ' +
          'implementation map is not handler component: ' + 
          componentKey)
      }
    }
  })

export var AbstractMiddleware = defineAbstractComponent(
  ExtensibleMiddleware, {
    toMainHandleableMiddleware() {
      var concreteComponent = this._concreteComponent

      if(!concreteComponent)
        throw new Error('Abstract middleware component ' + 
          'not implemented: ' + this._componentKey)

      return concreteComponent.toMainHandleableMiddleware()
    }
  })

export var abstractHandler = componentKey =>
  new AbstractHandler(componentKey)

export var abstractMiddleware = componentKey =>
  new AbstractMiddleware(componentKey)