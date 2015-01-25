let paramRegexString = '([^\\/]+)'
let restPathRegex = /\/:restpath$/

let escapeRegExp = string =>
  string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1")

let invalidUrlRegex = /[^\w\$\-\_\.\+\!\*\'\(\)\,]/
let invalidSubpathRegex = /[^\w\$\-\_\.\+\!\*\'\(\)\,\/]/

export let regexMatcher = (regex, fields=[]) =>
  (path, args) => {
    let matches = path.match(regex)
    if(!matches) return false

    for(let i=0; i<fields.length; i++) {
      let key = fields[i]
      let match = matches[i+1]

      args[key] = match
    }

    return true
  }

export let paramMatcher = paramPath => {
  let hasRestPath = restPathRegex.test(paramPath)

  if(hasRestPath)
    paramPath = paramPath.replace(restPathRegex, '')

  let parts = paramPath.split(/(:\w+)/)

  let regexString = '^'
  let matchFields = []

  parts.forEach(part => {
    if(part[0] == ':' && part.length > 1) {
      let field = part.slice(1)
      matchFields.push(field)

      regexString += paramRegexString

    } else {
      regexString += escapeRegExp(part)
    }
  })

  if(hasRestPath) {
    regexString += '(\\/.*)'
    matchFields.push('path')
  }

  regexString += '$'

  let regex = new RegExp(regexString)

  return regexMatcher(regex, matchFields)
}

export let paramUrlBuilder = (paramPath) => {
  let hasRestPath = restPathRegex.test(paramPath)

  if(hasRestPath)
    paramPath = paramPath.replace(restPathRegex, '')

  let parts = paramPath.split(/(:\w+)/)

  return (args, restPath='/') => {
    let url = ''

    parts.forEach(part => {
      if(part[0] == ':' && part.length > 1) {
        let field = part.slice(1)
        let value = args[field]

        if(typeof(value) != 'string')
          throw new Error('args value for subpath ' 
            + field + ' is not of type string')

        if(invalidUrlRegex.test(value))
          throw new Error('args value must be url escaped before hand')

        url += value

      } else {
        url += part
      }
    })

    if(hasRestPath) {
      if(invalidSubpathRegex.test(restPath))
        throw new Error('args value must be url escaped before hand')

      if(url.slice(-1) == '/' && restPath[0] == '/') {
        url += restPath.slice(1)
      } else {
        url += restPath
      }
    }

    return url
  }
}