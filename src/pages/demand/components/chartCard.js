import React, { PureComponent } from 'react';
import GlobalSandBox from '@/components/commonUseModule/globalSandBox';
import CustomBtn from '@/components/commonUseModule/customBtn';
import OptButton from '@/components/commonUseModule/optButton';
import Websocket from '@/components/Websocket';
import itIcon from '@/assets/icon/Button_itpg.svg';
import turnIcon from '@/assets/icon/Button_zpg.svg';
// import backIcon from '@/assets/icon/Button_xqth.svg';
import msgIcon from '@/assets/icon/modular_xx.svg';
import _ from 'lodash';
import { getUserInfo, getParam } from '@/utils/utils';
import { Row, Col, Mentions, message } from 'antd';
import styles from './chartCard.less';

class ChartCard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      sendData: '',
      contextMenuVisible: false,
      textContent: '',
    };
  }

  componentDidMount() {
    window.document.getElementById('messageArea').oncontextmenu = () => {
      this.messagePage = true;
      return false;
    };

    document.addEventListener('contextmenu', this._handleContextMenu);
    document.addEventListener('click', this._handleClick);
    document.addEventListener('scroll', this._handleScroll);
  }

  _handleContextMenu = event => {
    const textContent = window.getSelection().toString();
    if (!this.messagePage) return;
    this.setState({ contextMenuVisible: true, textContent });
    const clickX = event.clientX; // 事件发生的X坐标
    const clickY = event.clientY; // 事件发生的Y坐标
    const screenW = window.innerWidth; // 文档显示区域的宽度
    const screenH = window.innerHeight; // 文档显示区域的高度
    const rootW = this.root.offsetWidth; // 右击菜单本身元素的宽度
    const rootH = this.root.offsetHeight; // 右击菜单本身元素的高度

    // right 为 true时说明鼠标点击的位置到浏览器的右边界的宽度可以放置contextMenu
    // 否则，就放到左边 top与bottom同理
    const right = screenW - clickX > rootW;
    const left = !right;
    const top = screenH - clickY > rootH;
    const bottom = !top;

    if (right) {
      this.root.style.left = `${clickX + 15}px`;
    }
    if (left) {
      this.root.style.left = `${clickX - rootW - 15}px`;
    }
    if (top) {
      this.root.style.top = `${clickY + 15}px`;
    }
    if (bottom) {
      this.root.style.left = `${clickY - rootH - 15}px`;
    }
    this.messagePage = false;
  };

  _handleClick = event => {
    const { contextMenuVisible } = this.state;
    const wasOutside = !(event.target.contains === this.root);
    if (wasOutside && contextMenuVisible) {
      this.setState({ contextMenuVisible: false });
    }
  };

  _handleScroll = () => {
    const { contextMenuVisible } = this.state;
    if (contextMenuVisible) {
      this.setState({ contextMenuVisible: false });
    }
  };

  handleSendDatachange = content => {
    this.setState({
      sendData: content,
    });
  };

  // 添加至常用语
  handleAddtoComLang = comLang => {
    if (!comLang) {
      message.error('您未选中任何文字');
      return;
    }
    console.log('保存内容：', comLang); 
  };

  // 发消息
  handleSendMsg = () => {
    const { sendData } = this.state
    console.log('sendData:', sendData)
  }

  // 接消息
  handleReceiveMessage = (msg) => {
    console.log('msg:', msg)
  }

  render() {
    const { sendData, contextMenuVisible, textContent } = this.state;
    const { handleModalVisible } = this.props;
    const styleObj = {
      backgroundColor: 'white',
      borderColor: '#2E5BFF',
      color: '#2E5BFF',
    };
    const msgData = [
      {
        userName: '测试443264',
        msg:
          '@测试222194-014785有一条需求需要运营团队受理，需求名称:关联关联提给总部需求编号: R2005140097@测试504517-000531有一条需求需要运营团队受理，需求名称:关联关联提給部求编号: R2005140097',
        time: '2020-05-24   00：32：43',
      },
    ];
    const { userInfo: { userId, userName } } = getUserInfo();
    const id = getParam('id')
    return (
      <GlobalSandBox title="评论" img={msgIcon}>
        <div className={styles.msgContext} id="messageArea">
          {contextMenuVisible ? (
            <div
              ref={ref => {
                this.root = ref;
                return true;
              }}
              className={styles.contextMenu_wrap}
            >
              <div className={styles.contextMenu_separator} />
              <div
                onClick={() => this.handleAddtoComLang(textContent)}
                className={styles.contextMenu_option}
              >
                添加至常用语
              </div>
            </div>
          ) : null}
          {!_.isEmpty(msgData) &&
            msgData.map(m => {
              return (
                <div className={styles.msgContent}>
                  <div className={styles.msgContent_head}>
                    <div className={styles.msgContent_head_name}>{m.userName}</div>
                    <div className={styles.msgContent_head_time}>{m.time}</div>
                  </div>
                  <div className={styles.msgContent_body}>{m.msg}</div>
                </div>
              );
            })}
        </div>
        <Row type="flex" gutter={{ xs: 8, sm: 16, md: 24 }}>
          <Col span={21}>
            <div className={styles.sendContext}>
              <Mentions
                value={sendData}
                placeholder="您可以输入并@所需要提及的相关人员"
                onChange={this.handleSendDatachange}
                rows="6"
              >
                <Mentions.Option value="sample">Sample</Mentions.Option>
              </Mentions>
              <div className={styles.sendContext_btn}>
                <CustomBtn
                  type="others"
                  title="常用语"
                  style={{
                    ...styleObj,
                    padding: '8px 23px',
                  }}
                />
                <CustomBtn
                  type="others"
                  title="确定"
                  style={{
                    padding: '8px 23px',
                    backgroundColor: '#2E5BFF',
                    color: 'white',
                    marginLeft: '16px',
                  }}
                  onClick={this.handleSendMsg}
                />
              </div>
            </div>
          </Col>
          <Col span={3}>
            <div className={styles.sideBtn}>
              <OptButton
                style={{
                  ...styleObj,
                  marginTop: '12px',
                }}
                img={itIcon}
                onClick={() => handleModalVisible(true, "itAssessModalVisible")}
                text="IT评估"
              />
              <OptButton
                style={{
                  ...styleObj,
                  marginTop: '12px',
                }}
                img={turnIcon}
                text="转评估人"
              />
              {/* <OptButton
                style={{
                  backgroundColor: 'white',
                  borderColor: '#F44A5E',
                  color: '#F44A5E',
                  marginTop: '12px',
                }}
                img={backIcon}
                text="需求退回"
              /> */}
            </div>
          </Col>
        </Row>
        <Websocket
          url={`ws://10.90.48.22:80/websocket/${userName}-${userId}&${id}`}
          onMessage={this.handleReceiveMessage}
          // onOpen={this.handleOpen}
          // onClose={this.handleClose}
          // reconnect
          // debug
          ref={WebsocketRef => {
            this.refWebSocket = WebsocketRef;
          }}
        />
      </GlobalSandBox>
    );
  }
}

export default ChartCard;
