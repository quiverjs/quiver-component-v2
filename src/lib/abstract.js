import { 
  ExtensibleHandler, ExtensibleMiddleware 
} from './extensible-component'

let defineAbstractComponent = (Parent, mixin) => {
  class AbstractComponent extends Parent {
    constructor(componentKey, options={}) {
      this._componentKey = componentKey

      super(options)
    }

    implement(componentMap) {
      if(!this.concreteComponent) {
        let componentKey = this._componentKey
        let concreteComponent = componentMap[componentKey]

        if(concreteComponent) {
          this.validateConcreteComponent(concreteComponent)
          this.subComponents.concreteComponent = concreteComponent
        }
      }

      return super.implement(componentMap)
    }

    get concreteComponent() {
      return this.subComponents.concreteComponent
    }
  }

  Object.assign(AbstractComponent.prototype, mixin)

  return AbstractComponent
}

export let AbstractHandler = defineAbstractComponent(
  ExtensibleHandler, {
    toMainHandleableBuilder() {
      let { concreteComponent } = this

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

export let AbstractMiddleware = defineAbstractComponent(
  ExtensibleMiddleware, {
    toMainHandleableMiddleware() {
      let { concreteComponent } = this

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

export let abstractHandler = componentKey =>
  new AbstractHandler(componentKey)

export let abstractMiddleware = componentKey =>
  new AbstractMiddleware(componentKey)