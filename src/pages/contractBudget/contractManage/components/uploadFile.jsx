import { Upload, Modal, message, Icon } from 'antd'
import React, { Component } from 'react'
import cn from 'classnames'
import Config from '@/utils/config';
import moment from 'moment'
import styles from '../index.less'
import {
  imgTypes,
  fileTypes,
  judgeFileType,
} from '@/utils/constant';
const { uploadUrl } = Config.config
class FileUploadNo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      arrUrl: props.urls,
      preImg: false,
      curUrl: '',
      imgName: '',
      editable: false,
    }
  }

  handleSubmitFile = (info) => {
    if (!info.file) {
      return false
    }
    let { arrUrl } = this.state;
    if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    } else if (info.file.status === 'done') {
      if (judgeFileType(info.file, imgTypes) && judgeFileType(info.file, fileTypes)) {
        message.warning('暂不支持该文件类型上传！')
        return
      }
      const res = info.file.response;
      if (res.status == 'done') {
        let o = {
          fileName: res.name,
          url: res.url,
          createTime: time,
          creator: userName
        }
        arrUrl.push(o)
        this.setState({
          arrUrl,
        });
        // this.props.handleSaveFileUrl(arrUrl)
      } else {
        message.error(res.msg)
      }
    }
  }


  render() {
    const { children, urls } = this.props
    const { arrUrl, curUrl, imgName, preImg } = this.state
    // const { userId, kjxzToken } = getUserInfo()
    const uploadProps = {
      action: uploadUrl,
      // data: { userId },
      showUploadList: false,
      // headers: { Token: kjxzToken },
      beforeUpload: file => {
        const isLt2M = file.size / 1024 / 1024 < 20;
        if (!isLt2M) {
          message.error('文件大小不能超过20MB');
          return false
        }
      },
      // onRemove: this.onRemove,
      onChange: this.handleSubmitFile,
    }
    return (
      <div className={styles.myUpload}>
        {/* <Modal
          visible={preImg}
          onCancel={() => this.previewImage('', '', false)}
          width={'80%'}
          style={{ top: 30 }}
          footer={null}
        >
          <img style={{ width: '100%' }} src={curUrl} alt='' title={imgName} />
        </Modal> */}
        <Upload {...uploadProps}
        >
          {children}
        </Upload>

        {/* {arrUrl.length > 0 && (
          <div className={styles.customFileArea}>
            {arrUrl.map((v, index) => this.renderFile(v.fileName, v.url, index, v.type, arrUrl))}
          </div>
        )} */}
      </div>

    )
  }
}
export default FileUploadNo