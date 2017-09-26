import React from 'react'

export default ({ children }) => {
  const point = Math.round(children)
  return <span>{point}</span>
}
