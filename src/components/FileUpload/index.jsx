import { Upload, Modal, message, Icon } from 'antd'
import React, { Component } from 'react'
import cn from 'classnames'
import Config from '@/utils/config';
import { isObjEqual } from '@/utils/utils'
import moment from 'moment'
import styles from './index.less'
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
      arrUrl: props.urls ? JSON.parse(props.urls) : [],
      preImg: false,
      curUrl: '',
      imgName: '',
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!isObjEqual(this.props.urls, nextProps.urls)) {
      this.setState({
        arrUrl: nextProps.urls ? JSON.parse(nextProps.urls) : [],
      })
    }
  }

  cOnMouseOver = (index) => {
    const { arrUrl } = this.state
    arrUrl[index].bool = true
    this.setState({
      arrUrl: arrUrl
    })
  }

  cOnMouseLeave = (index) => {
    const { arrUrl } = this.state
    arrUrl[index].bool = false
    this.setState({
      arrUrl: arrUrl
    })
  }

  renderFile = (v, index) => {
    console.log('render', v)
    const { createTime, name, path, type, uploadType, id, bool } = v
    return (
      <div
        key={id}
        onMouseOver={() => this.cOnMouseOver(index)}
        onMouseLeave={() => this.cOnMouseLeave(index)}
        className={styles.fileStyle}>
        <div>{name}</div>
        {bool ?
          <div>
            {
              type === 2
                ? <div className={styles.fileStyle_btn}>下载</div>
                : <div className={styles.fileStyle_btn}>查看</div>
            }
            <div className={styles.fileStyle_btn}>
              删除
            </div>
          </div>
          : null
        }
      </div>
    )
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
      const { code, msg, data } = info.file.response;
      if (code === 200) {
        arrUrl.push(data)
        this.setState({
          arrUrl,
        });
        this.props.handleSaveFileUrl(JSON.stringify(arrUrl))
      } else {
        message.error(msg)
      }
    }
  }


  render() {
    const { children, urls, uploadType } = this.props
    const { arrUrl, curUrl, imgName, preImg } = this.state
    // const { userId, kjxzToken } = getUserInfo()
    const uploadProps = {
      action: uploadUrl,
      data: { uploadType },
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

        {arrUrl.length > 0 && (
          <div className={styles.customFileArea}>
            {arrUrl.map((v, index) => this.renderFile(v, index))}
          </div>
        )}
      </div>

    )
  }
}
export default FileUploadNo