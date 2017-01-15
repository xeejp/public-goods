import React, { Component } from 'react'
import { connect } from 'react-redux'

import FloatingActionButton from 'material-ui/FloatingActionButton'
import ImageEdit from 'material-ui/svg-icons/image/edit'

import ReactTooltip from 'react-tooltip'

const mapStateToProps = () => ({})

class EditQuestion extends Component {
  constructor(props){
    super(props)
  }

  render(){
    const { style, disabled } = this.props
    return (<span>
      <span data-tip={"設定項目なし"}>
        <FloatingActionButton onClick={null} style={style} disabled={true}>
          <ImageEdit />
        </FloatingActionButton>
      </span>
      <ReactTooltip place="bottom" type="error" effect="solid" offset={{ top: -28, left: -28}} />
    </span>)
  }
}

export default connect(mapStateToProps)(EditQuestion)
