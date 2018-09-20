import React, { Component } from 'react'
import { connect } from 'react-redux'

import FloatingActionButton from 'material-ui/FloatingActionButton'
import FileDownloadIcon from 'material-ui/svg-icons/file/file-download'
import Snackbar from 'material-ui/Snackbar'

import { ReadJSON, LineBreak } from '../shared/ReadJSON'

const multi_text = ReadJSON().static_text
const $s = multi_text["host"]["download"]

const mapStateToProps = ({ page, participants, participantsNumber, maxRound, groupSize, groupsNumber, askStudentId, history, punish_history, punishmentFlag, punishmentRate, maxPunishment, money, roi }) => ({
    page,
    participants,
    participantsNumber,
    maxRound,
    groupSize,
    groupsNumber,
    askStudentId,
    history,
    punish_history,
    punishmentFlag,
    punishmentRate,
    maxPunishment,
    money,
    roi
})

class DownloadButton extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = { open: false }
    }

    id(uid) {
        const { participants, askStudentId } = this.props
        return  (askStudentId ? (',' + participants[uid].id) : '')
    }

    makeCsvRowData(arr) {
        const { maxRound } = this.props
        let temp = Array(maxRound).join(',').split(',')

        temp.push(...arr)
        return temp.slice(-maxRound).reverse().join(',')
    }

    handleClick() {
        const { page, participants, participantsNumber, maxRound, groupSize, groupsNumber, askStudentId, history, punish_history, punishmentFlag, punishmentRate, maxPunishment, money, roi } = this.props
        const fileName = 'PublicGoods.csv'

        const temp = Array(maxRound).join(',').split(',')
        let users = Object.keys(participants).map(id => {
            let user = participants[id]
            let inv_str = this.makeCsvRowData(user.invs)
            let profit_str = this.makeCsvRowData(user.profits.map((a,i) => ((punishmentFlag)?(a - user.punishments[i]*punishmentRate - user.used[i]):a)))
            let profits_sum = user.profits.reduce((acc, p) => acc + p, 0) - user.punishments.reduce((acc, p) => acc + p, 0) * punishmentRate - user.used.reduce((acc, p) => acc + p, 0)
            if (!punishmentFlag) return [id + this.id(id), inv_str, profit_str, profits_sum].join(',')
            
            let puni_str = this.makeCsvRowData(user.punishments.map(a=>a*punishmentRate))
            let use_str = this.makeCsvRowData(user.used)
            return [id + this.id(id), inv_str,puni_str,use_str,profit_str,profits_sum].join(',')
        })
        
        let colInv = temp.map((a, i) => $s["cols"][0] + (i + 1) + $s["cols"][4]).join(',')
        let colPro = temp.map((a, i) => $s["cols"][1] + (i + 1) + $s["cols"][4]).join(',')        
        let colPun = temp.map((a, i) => $s["cols"][2] + (i + 1) + $s["cols"][4]).join(',')
        let colUse = temp.map((a, i) => $s["cols"][3] + (i + 1) + $s["cols"][4]).join(',')
        let punis_col = (punishmentFlag)
            ? [$s["puni_col"][0], $s["puni_col"][1] + ',' + punishmentRate, $s["puni_col"][2] + ',' + maxPunishment].join('\n')
            : $s["puni_col"][4]

        let historyData = history.reverse().map(a => {
            let str = [a.investment, a.group_id, a.round + 1].join(',')
            return  a.id + ',' + this.id(a.uid) + str            
        })

        let punishHistoryData = Array.prototype.concat.apply([],punish_history).reverse().map(a => {
            let str = [(!a.punishment)?0:a.punishment*punishmentRate, a.group_id, a.round + 1].join(',')
            return  a.id + ',' + this.id(a.uid) + a.to_id + ',' + str                        
        })

        let date = new Date()
        let content = [$s["dt"][0], 
            $s["dt"][1] + ',' + date, 
            $s["dt"][2] + ',' + participantsNumber,
            $s["dt"][3] + ',' + groupsNumber,
            $s["dt"][4] + ',' + groupSize,
            $s["dt"][5] + ',' + maxRound,
            $s["dt"][6] + ',' + money,
            $s["dt"][7] + ',' + roi,
            punis_col,
            [$s["Ids"][0] + (askStudentId ? ',' + $s["Ids"][1]: '') , $s["inv_log"][0], $s["Ids"][2], $s["round"]].join(','),
            historyData.join('\n') + ((punishmentFlag) ? '\n'
                + [$s["Ids"][0] + (askStudentId ? ',' + $s["Ids"][1] : ''), $s["puni_log"][0], $s["puni_log"][1], $s["Ids"][2], $s["round"]].join(',') + '\n'
                + punishHistoryData.join('\n')
            : ''),
            $s["Ids"][0] + ',' + (askStudentId ? $s["Ids"][1] + ',' : '') + colInv + ',' + ((punishmentFlag) ? colPun + ',' + colUse + ',' : "") + colPro + "," + $s["cols"][5],
            users.join('\n')
        ].join('\n') + '\n'
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
                disabled={page != "result"}
                style={
                    { marginLeft: '2%' }
                }
            >
            <FileDownloadIcon/>
            </FloatingActionButton>
            <Snackbar
                open={this.state.open}
                message = {$s["snackbar"]}
                autoHideDuration = { 2000 }
                onRequestClose = { this.handleRequestClose.bind(this) }
            />
        </span>
        )
    }
}

export default connect(mapStateToProps)(DownloadButton)