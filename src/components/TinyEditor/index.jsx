/**
 * @name 富文本插件
 * @author gong
 * Copyright @2020-8-17
 * @todo
 * @description
 *    height = 500, // 高度
      content, // 内容
      disabled = false, // 控制文本框是否可编辑
      uploadUrl // 上传url
 *
 */
import React, { Component } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { plugins, toolbar } from './plugins';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }

  componentDidMount() { }

  handleEditorChange = (content) => {
    const { onContentChange } = this.props;
    onContentChange(content);
  }

  handleUploadImg = (blobInfo, success, failure, progress) => {
    console.log(blobInfo, success, failure, progress)
    const {
      uploadUrl,
    } = this.props;
    let xhr, formData;
    xhr = new XMLHttpRequest();
    xhr.withCredentials = false;
    xhr.open('POST', uploadUrl);
    xhr.upload.onprogress = function (e) {
      progress(e.loaded / e.total * 100);
    };
    xhr.onload = function () {
      let json;
      if (xhr.status < 200 || xhr.status >= 300) {
        failure('HTTP Error: ' + xhr.status);
        return;
      }
      json = JSON.parse(xhr.responseText);
      if (!json || typeof json.location != 'string') {
        failure('Invalid JSON: ' + xhr.responseText);
        return;
      }
      success(json.location);
    };
    xhr.onerror = function () {
      failure('Image upload failed due to a XHR Transport error. Code: ' + xhr.status);
    };
    formData = new FormData();
    formData.append('file', blobInfo.blob(), blobInfo.filename());

    xhr.send(formData);
  }

  render() {
    const {
      height = 500, // 高度
      content, // 内容
      disabled = false, // 控制文本框是否可编辑
      editorKey,
    } = this.props;
    const cusToolbar = toolbar;
    const pastProps = {
      paste_retain_style_properties: 'all',
      paste_word_valid_elements: '*[*]',
      paste_convert_word_fake_lists: false,
      paste_webkit_styles: 'all',
      paste_merge_formats: true,
      paste_data_images: true,
    }
    return (
      <Editor
        value={content}
        disabled={disabled}
        onEditorChange={this.handleEditorChange}
        init={{
          key:editorKey,
          height: height,
          plugins,
          toolbar: cusToolbar,
          language: 'zh_CN',
          branding: false, // 隐藏右下角技术支持
          menubar: true,
          ...pastProps,
          file_picker_types: '*',
          relative_urls: false,
          remove_script_host: false,
          images_upload_handler: this.handleUploadImg,
        }}
      />
    );
  }
}

export default App;
