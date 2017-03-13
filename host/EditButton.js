import React, { Component } from 'react'

import FloatingActionButton from 'material-ui/FloatingActionButton'
import ImageEdit from 'material-ui/svg-icons/image/edit'

const EditButton = ({ style, disabled }) => {
  return (
    <span>
      <FloatingActionButton onClick={null} style={style} disabled={disabled}>
        <ImageEdit />
      </FloatingActionButton>
    </span>
  )
}

export default EditButton
