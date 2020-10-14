import { Upload, Modal, message, Icon } from 'antd'
import React, { Component } from 'react'
import Config from '@/utils/config';
import { isObjEqual, getUserInfo } from '@/utils/utils'
import axios from 'axios'
import delIcon from '@/assets/icon/cz_del.svg'
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
      arrUrl,
    })
  }

  cOnMouseLeave = (index) => {
    const { arrUrl } = this.state
    arrUrl[index].bool = false
    this.setState({
      arrUrl,
    })
  }

  handleDownLoad = (url) => {
    window.location.href = url;
  }

  handlePreview = (url, bool) => {
    this.setState({
      preImg: bool,
      curUrl: url
    })
    // const a = document.createElement('a')
    // a.href = url
    // a.target='__blank'
    // a.click()
  }

  renderFile = (v, index) => {
    const { name, path, type, id, bool } = v
    return (
      <div
        key={id}
        onFocus={() => console.log('focus')}
        onMouseLeave={() => this.cOnMouseLeave(index)}
        className={styles.fileStyle}
        onMouseOver={() => this.cOnMouseOver(index)}
      >
        <div>{name}</div>
        {bool ?
          <div>
            {
              type === 2
                ?
                  <div
                    className={styles.fileStyle_btn}
                    onClick={() => this.handleDownLoad(path)}
                  >
                  下载
                  </div>
                : 
                  <div
                    className={styles.fileStyle_btn}
                    onClick={() => this.handlePreview(path, true)}
                  >查看
                  </div>
            }
            <div
              onClick={() => this.handleDeleteFile(v, index)}
              className={styles.fileStyle_btn}
            >
              <Icon component={delIcon} />
            </div>
          </div>
          : null
        }
      </div>
    )
  }

  // 删除附件
  handleDeleteFile = (v, index) => {
    const { token } = getUserInfo()
    console.log(v)
    axios({
      url: '/server/attachment/delete',
      type: 'json',
      method: 'get',
      contentType: 'application/json',
      headers: { Authorization: token },
      params: { id: v.id },
    }).then(() => {
      const { arrUrl } = this.state
      arrUrl.splice(index, 1)
      this.props.handleSaveFileUrl(JSON.stringify(arrUrl))
      this.setState({
        arrUrl
      })
    })
  }

  handleSubmitFile = (info) => {
    if (!info.file) {
      return false
    }
    const { arrUrl } = this.state;
    console.log('arrUrl:', arrUrl)
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
    const { children, uploadType, linkId } = this.props
    const { arrUrl, curUrl, imgName, preImg } = this.state
    const { token } = getUserInfo()
    const uploadProps = {
      action: uploadUrl,
      data: { uploadType, linkId },
      showUploadList: false,
      headers: { Authorization: token },
      beforeUpload: file => {
        const isLt2M = file.size / 1024 / 1024 < 20;
        if (!isLt2M) {
          message.error('文件大小不能超过20MB');
          return false
        }
      },
      onChange: this.handleSubmitFile,
    }
    return (
      <div className={styles.myUpload}>
        <Modal
          visible={preImg}
          onCancel={() => this.handlePreview('', false)}
          width="80%"
          style={{ top: 30 }}
          footer={null}
        >
          <img style={{ width: '100%' }} src={curUrl} alt='' title={imgName} />
        </Modal>
        <Upload {...uploadProps}>
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