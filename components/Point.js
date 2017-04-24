import React from 'react'

export default ({ children }) => {
  const point = children.toFixed(1).replace(/\.0$/, '')
  return <span>{point}</span>
}
