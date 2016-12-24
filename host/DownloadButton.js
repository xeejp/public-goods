import React from 'react'
import { connect } from 'react-redux'

import FloatingActionButton from 'material-ui/FloatingActionButton'
import FileFileDownload from 'material-ui/svg-icons/file/file-download'

const mapStateToProps = ({ }) => ({ })

const DownloadButton = ({fileName, list, style, disabled }) => (
  <FloatingActionButton
    style={style}
    disabled={disabled}
    onClick={() => {
      var content = list.map(line => line.join(',')).join("\n")
      var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
      var blob = new Blob([bom,content], {type: 'text/csv'});
      var url = window.URL || window.webkitURL;
      var blobURL = url.createObjectURL(blob);

      if(window.navigator.msSaveBlob){
        window.navigator.msSaveBlob(blob, fileName)
      }
      else{
        var a = document.createElement('a');
         a.download = fileName;
         a.href = blobURL;
         a.click();  
       }
     }
    }
    ><FileFileDownload /></FloatingActionButton>
)

export default connect(mapStateToProps)(DownloadButton) 
