import React, { Component } from 'react'
import { connect } from 'react-redux'

import FloatingActionButton from 'material-ui/FloatingActionButton'
import ImageEdit from 'material-ui/svg-icons/image/edit'

const mapStateToProps = () => ({})

class EditQuestion extends Component {
  constructor(props){
    super(props)
  }

  render(){
    const { style, disabled } = this.props
    return (<span>
      <FloatingActionButton onClick={null} style={style} disabled={disabled}>
         <ImageEdit />
      </FloatingActionButton>
    </span>)
  }
}

export default connect(mapStateToProps)(EditQuestion)
