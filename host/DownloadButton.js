import React, { Component } from 'react'
import { connect } from 'react-redux'

import FloatingActionButton from 'material-ui/FloatingActionButton'
import FileDownloadIcon from 'material-ui/svg-icons/file/file-download'
import Snackbar from 'material-ui/Snackbar'

import { ReadJSON, LineBreak } from '../shared/ReadJSON'

const multi_text = ReadJSON().static_text

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

    handleClick() {
        const { page, participants, participantsNumber, maxRound, groupSize, groupsNumber, askStudentId, history, punish_history, punishmentFlag, punishmentRate, maxPunishment, money, roi } = this.props
        const fileName = 'PublicGoods.csv'

        const temp = Array(maxRound).join(',').split(',')
        let users = Object.keys(participants).map(id => {
            let user = participants[id]
            let inv_str = Array.concat(temp, user.invs).slice(-maxRound).reverse().join(',')
            let profit_str = Array.concat(temp, user.profits.map((a,i) => ((punishmentFlag)?(a - user.punishments[i]*punishmentRate - user.used[i]):a))).slice(-maxRound).reverse().join(',')
            let profits_sum = user.profits.reduce((acc, p) => acc + p, 0) - user.punishments.reduce((acc, p) => acc + p, 0) * punishmentRate - user.used.reduce((acc, p) => acc + p, 0)
            if (!punishmentFlag) return [id + this.id(id), inv_str, profit_str, profits_sum].join(',')
            
            let puni_str = Array.concat(temp, user.punishments.map(a=>a*punishmentRate)).slice(-maxRound).reverse().join(',')
            let use_str = Array.concat(temp, user.used).slice(-maxRound).reverse().join(',')
            return [id + this.id(id), inv_str,puni_str,use_str,profit_str,profits_sum].join(',')
        })

        let colInv = temp.map((a, i) => "投資" + (i + 1) + "回目").join(',')
        let colPro = temp.map((a, i) => "利益" + (i + 1) + "回目").join(',')        
        let colPun = temp.map((a, i) => "受けた罰則" + (i + 1) + "回目").join(',')
        let colUse = temp.map((a, i) => "与えた罰則" + (i + 1) + "回目").join(',')
        let punis_col = (punishmentFlag)
            ? ["罰則有り", "罰則の倍率" + ',' + punishmentRate, "罰則に使えるポイントの最大値" + ',' + maxPunishment].join('\n')
            : "罰則なし"

        let historyData = history.reverse().map(a => {
            let str = [a.investment, a.group_id, a.round + 1].join(',')
            return  a.id + ',' + this.id(a.uid) + str            
        })

        let punishHistoryData = Array.prototype.concat.apply([],punish_history).reverse().map(a => {
            let str = [(!a.punishment)?0:a.punishment*punishmentRate, a.group_id, a.round + 1].join(',')
            return  a.id + ',' + this.id(a.uid) + a.to_id + ',' + str                        
        })

        let date = new Date()
        let content = ["公共財", 
            "実験日" + ',' + date, 
            "登録者数" + ',' + participantsNumber,
            "グループ数" + ',' + groupsNumber,
            "1グループの人数" + ',' + groupSize,
            "ラウンド" + ',' + maxRound,
            "初期値" + ',' + money,
            "ROI" + ',' + roi,
            punis_col,
            ["ID" + (askStudentId ? ',' + "学籍番号": '') , "投資額", "グループID", "ラウンド"].join(','),
            historyData.join('\n') + ((punishmentFlag) ? '\n'
                + ["ID" + (askStudentId ? ',' + "学籍番号" : ''), "罰則先ID", "罰則ポイント", "グループID", "ラウンド"].join(',') + '\n'
                + punishHistoryData.join('\n')
            : ''),
            "ID" + ',' + (askStudentId ? "学籍番号" + ',' : '') + colInv + ',' + ((punishmentFlag) ? colPun + ',' + colUse + ',' : "") + colPro + "," + "総利益",
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
                message = {""}
                autoHideDuration = { 2000 }
                onRequestClose = { this.handleRequestClose.bind(this) }
            />
        </span>
        )
    }
}

export default connect(mapStateToProps)(DownloadButton)