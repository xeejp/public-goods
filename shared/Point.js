import React from 'react'

export default ({ children }) => {
  const point = Math.round(children)
  if(isNaN(point)) return <span>{"-"}</span>
  return <span>{point}</span>
}
