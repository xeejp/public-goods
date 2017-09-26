import React from 'react'

export function ReadJSON() {
  if(typeof ReadJSON.text === 'undefined') ReadJSON.text = require('json!./language.json')
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