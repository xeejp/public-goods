import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Card, CardText, CardTitle } from 'material-ui/Card'
import CircularProgress from 'material-ui/CircularProgress'

const mapStateToProps = ({}) => ({
})

const Experiment = ({}) => (
            <div>
                <Card>
                    <CardTitle title="公共財実験" subtitle="待機中"/>
                    <CardText>
                        <p>他のグループの終了を待っています。</p>
                        <p>この画面のまましばらくお待ち下さい。</p>
                    </CardText>
                    <div style={{textAlign: "center"}}>
                        <CircularProgress size={2}/>
                    </div>
                </Card>
            </div>
)

export default connect(mapStateToProps)(Experiment)
