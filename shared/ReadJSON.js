import React from 'react'

export function ReadJSON() {
  if(typeof ReadJSON.text === 'undefined') ReadJSON.text = require('./language.json')
  return ReadJSON.text
}

export function LineBreak(text) {
  var regex = /(\n)/g
  return text.split(regex).map(function (line) {
    if (line.match(regex)) {
      return React.createElement('br')
    }
    else {
      return line
    }
  })
}

export function InsertVariable(text, variables, dynamic_variables) {
  if(dynamic_variables) Object.assign(variables, dynamic_variables)
  Object.keys(variables).forEach(key => text = text.split('<' + key + '>').join(variables[key]))
  return text;
}
