import { mixin } from 'quiver-object'

import { 
  ExtensibleHandler, ExtensibleMiddleware 
} from './extensible-component'

const _init = Symbol('@init')
const _implKey = Symbol('@implKey')
const _defaultComponent = Symbol('@defaultComponent')

export const implementAbstract = (component, implMap) => {
  for(let subComponent of component.allComponents()) {
    if(subComponent.implement) {
      subComponent.implement(implMap)
    }
  }
}

const AbstractComponentMixin = {
  [_init](implKey, defaultComponent) {
    this[_implKey] = implKey

    if(defaultComponent) {
      this.validateConcreteComponent(defaultComponent)
      this.subComponents.defaultComponent = defaultComponent
    }
  },

  get implKey() {
    return this[_implKey]
  },

  get implKeyString() {
    return this.implKey.toString()
  },

  get concreteComponent() {
    const component = this.subComponents.concreteComponent
    if(component) return component

    return this.subComponents.defaultComponent
  },

  toConcreteComponent() {
    if(this.concreteComponent) {
      return this.concreteComponent
    }

    throw new Error('Abstract component is not implemented: ' 
      + this.implKeyString)
  },

  implement(implMap) {
    // return if abstract component has been implemented before
    if(this.concreteComponent) return

    const implKey = this[_implKey]
    const concreteComponent = implMap[implKey]

    // return if provided map don't have the specific key
    if(!concreteComponent) return 

    this.validateConcreteComponent(concreteComponent)

    this.subComponents.concreteComponent = concreteComponent
    return this
  }
}

export class AbstractHandler extends ExtensibleHandler {
  constructor(implKey, defaultComponent, options={}) {
    super(options)
    this[_init](implKey, defaultComponent)
  }

  toMainHandleableBuilder() {
    return this.toConcreteComponent().toHandleableBuilder()
  }

  validateConcreteComponent(component) {
    if(component.isHandlerComponent) return

    throw new Error(
      'Concrete component imust be handler component: ' 
      + this.implKey.toString())
  }

  get componentType() {
    return 'AbstractHandler'
  }
}

export class AbstractMiddleware extends ExtensibleMiddleware {
  constructor(implKey, options={}) {
    super(options)
    this[_implKey] = implKey
  }

  toMainHandleableMiddleware() {
    return this.toConcreteComponent().toMainHandleableMiddleware()
  }

  validateConcreteComponent(component) {
    if(component.isMiddlewareComponent) return

    throw new Error(
      'Concrete component must be middleware component: ' 
      + this.implKey.toString())
  }

  get componentType() {
    return 'AbstractMiddleware'
  }
}

mixin(AbstractHandler, AbstractComponentMixin)
mixin(AbstractMiddleware, AbstractComponentMixin)

export const abstractHandler = (implKey) =>
  new AbstractHandler(implKey)

export const abstractMiddleware = (implKey) =>
  new AbstractMiddleware(implKey)
