import { safePromised } from 'quiver-promise'

let assertFunction = fn => {
  if(typeof(fn) != 'function') {
    throw new Error('argument must be of type function')
  }
}

export let safeHandler = (handler, options={}) => {
  let { safeWrapped=false } = options

  if(safeWrapped) return handler

  assertFunction(handler)
  options.safeWrapped = true

  return safePromised(handler)
}

export let safeBuilder = (builder, options={}) => {
  let { safeWrapped=false } = options

  if(safeWrapped) return builder

  assertFunction(builder)
  options.safeWrapped = true

  let wrappedBuilder = safePromised(builder)

  return (...args) =>
    wrappedBuilder(...args).then(safeHandler)
}