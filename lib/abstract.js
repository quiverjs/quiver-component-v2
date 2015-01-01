import { 
  ExtensibleHandler, ExtensibleMiddleware 
} from './extensible-component'

var defineAbstractComponent = (Parent, mixin) => {
  class AbstractComponent extends Parent {
    constructor(componentKey, options={}) {
      this._componentKey = componentKey
      super(options)
    }

    each(iteratee) {
      if(this._concreteComponent) {
        iteratee(this._concreteComponent)
      }

      super.each(iteratee)
    }

    doMap(target, mapper, mapTable) {
      if(this._concreteComponent) {
        target._concreteComponent =
          mapper(this._concreteComponent, mapTable)
      }

      super.doMap(target, mapper, mapTable)
    }

    implement(componentMap) {
      if(!this._concreteComponent) {
        var componentKey = this._componentKey
        var concreteComponent = componentMap[componentKey]

        if(concreteComponent) {
          this.validateConcreteComponent(concreteComponent)
          this._concreteComponent = concreteComponent
        }
      }

      return super.implement(componentMap)
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
      if(!component.isHandlerComponent) {
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
    },

    validateConcreteComponent(component) {
      if(!component.isMiddlewareComponent) {
        throw new Error('Concrete component in ' +
          'implementation map is not middleware component: ' + 
          componentKey)
      }
    }
  })

export var abstractHandler = componentKey =>
  new AbstractHandler(componentKey)

export var abstractMiddleware = componentKey =>
  new AbstractMiddleware(componentKey)