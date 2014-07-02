var paramRegexString = '([^\\/]+)'
var restPathRegex = /\/:restpath$/

var escapeRegExp = string =>
  string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1")

var invalidUrlRegex = /[^\w\$\-\_\.\+\!\*\'\(\)\,]/
var invalidSubpathRegex = /[^\w\$\-\_\.\+\!\*\'\(\)\,\/]/

export var regexMatcher = (regex, fields=[]) =>
  (path, args) => {
    var matches = path.match(regex)
    if(!matches) return false

    for(var i=0; i<fields.length; i++) {
      var key = fields[i]
      var match = matches[i+1]

      args[key] = match
    }

    return true
  }

export var paramMatcher = paramPath => {
  var hasRestPath = restPathRegex.test(paramPath)

  if(hasRestPath)
    paramPath = paramPath.replace(restPathRegex, '')

  var parts = paramPath.split(/(:\w+)/)

  var regexString = '^'
  var matchFields = []

  parts.forEach(part => {
    if(part[0] == ':' && part.length > 1) {
      var field = part.slice(1)
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

  var regex = new RegExp(regexString)

  return regexMatcher(regex, matchFields)
}

export var paramUrlBuilder = (paramPath) => {
  var hasRestPath = restPathRegex.test(paramPath)

  if(hasRestPath)
    paramPath = paramPath.replace(restPathRegex, '')

  var parts = paramPath.split(/(:\w+)/)

  return (args, restPath='/') => {
    var url = ''

    parts.forEach(part => {
      if(part[0] == ':' && part.length > 1) {
        var field = part.slice(1)
        var value = args[field]

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