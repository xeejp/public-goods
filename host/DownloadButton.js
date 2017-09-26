import React, { Component } from 'react'
import { connect } from 'react-redux'

import FloatingActionButton from 'material-ui/FloatingActionButton'
import FileDownloadIcon from 'material-ui/svg-icons/file/file-download'
import Snackbar from 'material-ui/Snackbar'

import { ReadJSON, LineBreak } from '../shared/ReadJSON'

const multi_text = ReadJSON().static_text

const mapStateToProps = ({ }) => ({
    
})

class DownloadButton extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = { open: false }
    }

    handleClick() {
        const { } = this.props
        const fileName = 'PublicGoods.csv'

        let bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
        let blob = new Blob([bom, content])
        let url = window.URL || window.webkitURL
        let blobURL = url.createObjectURL(blob)

        let a = document.createElement('a')
        a.download = fileName
        a.href = blobURL
        a.click()
        this.setState({ open: true })
    }

    handleRequestClose() {
        this.setState({ open: false })
    }

    render() {
        const { page } = this.props
        return ( <span>
            <FloatingActionButton 
                onClick={this.handleClick.bind(this)}
                disabled={/*page != "result"*/true}
                style={
                    { marginLeft: '2%' }
                }
            >
            <FileDownloadIcon/>
            </FloatingActionButton>
            <Snackbar
                open={this.state.open}
                message = { multi_text["download"]["dddt"][4] }
                autoHideDuration = { 2000 }
                onRequestClose = { this.handleRequestClose.bind(this) }
            />
        </span>
        )
    }
}

export default connect(mapStateToProps)(DownloadButton)