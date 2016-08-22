import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import FloatingActionButton from 'material-ui/FloatingActionButton'

import {
  submitColor
} from './actions'

const buttons = [
  {style: {float: "left"}},
  {style: {float: "left"}},
  {style: {float: "left"}},
  {style: {float: "left", clear: "left"}},
  {style: {float: "left"}},
  {style: {float: "left"}},
  {style: {float: "left", clear: "left"}},
  {style: {float: "left"}},
  {style: {float: "left"}}
]

const color = [
  "#ff8080",
  "#ffc800",
  "#ffff80",
  "#c0ff80",
  "#80ff80",
  "#80ffc0",
  "#80ffff",
  "#80c0ff",
  "#8080ff",
  "#c800ff",
  "#ff80ff",
  "#ff80c0",
]

const mapStateToProps = ({colors}) => ({
  colors
})

const mapDispatchToProps = (dispatch) => ({
  submitColor: (index) => () => bindActionCreators(submitColor, dispatch)(index)
})

const Experiment = ({colors, submitColor}) => (
  <div>
    <p>他のグループの実験が終了するまでお待ち下さい。</p>
    {
      buttons.map(({ style }, i) => (
        <FloatingActionButton
          key={i}
          backgroundColor={color[colors[i]]}
          style={Object.assign({
            margin: "1%"
          },style)}
          onClick={submitColor(i)}
        />
      ))
    }
  </div>
)

export default connect(mapStateToProps, mapDispatchToProps)(Experiment)
