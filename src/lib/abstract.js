import { 
  ExtensibleHandler, ExtensibleMiddleware 
} from './extensible-component'

const _componentKey = Symbol('@componentKey')

export const implementAbstract = (component, implMap) => {
  for(let subComponent of component.allComponents()) {
    if(subComponent.implement) {
      subComponent.implement(implMap)
    }
  }
}

export class AbstractHandler extends ExtensibleHandler {
  constructor(componentKey, options={}) {
    super(options)
    this[_componentKey] = componentKey
  }

  toMainHandleableBuilder() {
    const { concreteComponent } = this

    if(!concreteComponent) {
      throw new Error('Abstract handler component '+ 
        'not implemented: ' + this[_componentKey])
    }

    return concreteComponent.toHandleableBuilder()
  }

  implement(implMap) {
    // return if abstract component has been implemented before
    if(this.concreteComponent) return

    const componentKey = this[_componentKey]
    const concreteComponent = implMap[componentKey]

    // return if provided map don't have the specific key
    if(!concreteComponent) return 

    if(!component.isHandlerComponent) {
      throw new Error('Concrete component in ' +
        'implementation map is not handler component: ' + 
        componentKey)
    }

    this.subComponents.concreteComponent = concreteComponent
    return this
  }

  get concreteComponent() {
    return this.subComponents.concreteComponent
  }

  get componentType() {
    return 'AbstractHandler'
  }
}

export class AbstractMiddleware extends ExtensibleMiddleware {
  constructor(componentKey, options={}) {
    super(options)
    this[_componentKey] = componentKey
  }

  toMainHandleableMiddleware() {
    const { concreteComponent } = this

    if(!concreteComponent)
      throw new Error('Abstract middleware component ' + 
        'not implemented: ' + this[_componentKey])

    return concreteComponent.toMainHandleableMiddleware()
  }

  implement(implMap) {
    // return if abstract component has been implemented before
    if(this.concreteComponent) return

    const componentKey = this[_componentKey]
    const concreteComponent = implMap[componentKey]

    // return if provided map don't have the specific key
    if(!concreteComponent) return 

    if(!component.isMiddlewareComponent) {
      throw new Error('Concrete component in ' +
        'implementation map is not middleware component: ' + 
        componentKey)
    }

    this.subComponents.concreteComponent = concreteComponent
    return this
  }

  get concreteComponent() {
    return this.subComponents.concreteComponent
  }

  get componentType() {
    return 'AbstractMiddleware'
  }
}

export const abstractHandler = componentKey =>
  new AbstractHandler(componentKey)

export const abstractMiddleware = componentKey =>
  new AbstractMiddleware(componentKey)
