import React, { PureComponent } from 'react';
import { connect } from 'dva'
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
import { Row, Col, Mentions, message, Card, List, Popover, Icon, Empty, Modal, Button, Popconfirm, Divider } from 'antd';
import Config from '@/utils/config'
import styles from './chartCard.less';

const { envIP } = Config.config
@connect(({ demand }) => ({
  demand,
  comLangList: demand.comLangList
}))
class ChartCard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      sendData: '',
      contextMenuVisible: false,
      textContent: '',
      receiveMsg: [],
      isAdd: false,
      visibleComLangModal: false,
    };
  }

  componentDidMount() {
    this.handleQueryComLang()

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

  // 查询常用语
  handleQueryComLang = () => {
    this.props.dispatch({
      type: 'demand/queryCommonLang'
    })
  }

  // 添加至常用语
  handleAddtoComLang = comLang => {
    if (!comLang) {
      message.error('您未选中任何文字');
      return true;
    }
    console.log(comLang)
    this.props.dispatch({
      type: 'demand/addCommonLang',
      payload: { content: comLang }
    }).then(res => {
      if (res) {
        this.handleQueryComLang()
      }
    })
  };

  // 修改常用语
  handleUpdateComLang = (params) => {
    this.props.dispatch({
      type: 'demand/updateCommonLang',
      payload: {
        ...params
      }
    }).then(res => {
      if (res) {
        this.handleQueryComLang()
      }
    })
  }

  // 选择常用语到聊天框
  handleAddComLangToMessage = (content) => {
    const { sendData } = this.state
    this.setState({
      sendData: `${sendData}${content}`
    })
  }


  // 发消息
  handleSendMsg = () => {
    const { sendData } = this.state
    const { title } = this.props
    const no = getParam('no')
    const { token } = getUserInfo()
    const sendMsg = {
      linkId: no,
      content: sendData,
      title,
      userToken: token,
    }
    const send = JSON.stringify(sendMsg);
    this.refWebSocket.sendMessage(send);
    this.setState({
      sendData: ''
    })
  }

  // 接消息
  handleReceiveMessage = (msg) => {
    const copyMsg = JSON.parse(msg)
    this.setState({
      receiveMsg: copyMsg.message
    })
  }

  render() {
    const { sendData, contextMenuVisible, textContent, receiveMsg, isAdd, comLangVisible } = this.state;
    const { handleModalVisible, assignorVisible, ITAssignVisible, comLangList } = this.props;
    const styleObj = {
      backgroundColor: 'white',
      borderColor: '#2E5BFF',
      color: '#2E5BFF',
    };
    const { userInfo: { userId, userName } } = getUserInfo();
    const no = getParam('no')
    const comLangMenu = (
      <Card
        title="常用语"
        extra={<Icon
          type="setting"
          onClick={() => {
            this.setState({ comLangVisible: true, isAdd: false })
          }}
        />}
        bordered={false}
        bodyStyle={{ padding: 0 }}
        className={styles.comLangCard}
      >
        {console.log(comLangList)}
        {
          !_.isEmpty(comLangList)
            ? <List
              size="small"
              // loading={loadingQueryComLangList}
              dataSource={comLangList}
              className={styles.comLangCard__list}
              renderItem={item => <List.Item
                className={styles.comLangItem}
              >
                <div
                  className={styles.comLangItem_content}
                  onClick={() => this.handleAddComLangToMessage(item.content)}
                >{item.content}
                </div>
              </List.Item>}
            />
            : <Empty
              style={{ width: 252, height: 100, left: 100, textAlign: 'center' }}
              imageStyle={{ marginTop: 80 }}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
        }
      </Card>
    )
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
          {!_.isEmpty(receiveMsg) &&
            receiveMsg.map((m, i) => (
              <div key={i.toString()} className={styles.msgContent}>
                <div className={styles.msgContent_head}>
                  <div className={styles.msgContent_head_name}>{m.userName}</div>
                  <div className={styles.msgContent_head_time}>{m.createTime}</div>
                </div>
                <div className={styles.msgContent_body}>{m.content}</div>
              </div>
            ))}
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
                <Popover
                  content={comLangMenu}
                  placement="top"
                >
                  <div>
                    <CustomBtn
                      type="others"
                      title="常用语"
                      style={{
                        ...styleObj,
                        padding: '8px 23px',
                      }}
                    />
                  </div>
                </Popover>

                <CustomBtn
                  type="others"
                  title="确定"
                  style={{
                    padding: '8px 30px',
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
                  marginTop: '12px',
                }}
                img={itIcon}
                disabled={!ITAssignVisible}
                onClick={() => handleModalVisible(true, "itAssessModalVisible")}
                text="IT评估"
              />
              <OptButton
                style={{
                  marginTop: '12px',
                }}
                disabled={!assignorVisible}
                onClick={() => handleModalVisible(true, "turnAssessModalVisible")}
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
          url={`ws://${envIP}:80/websocket/${userName}-${userId}&${no}`}
          onMessage={this.handleReceiveMessage}
          // onOpen={this.handleOpen}
          // onClose={this.handleClose}
          reconnect
          debug
          // protocol={token}
          ref={WebsocketRef => {
            this.refWebSocket = WebsocketRef;
          }}
        />
        <Modal
          title="常用语设置"
          visible={comLangVisible}
          footer={null}
          onCancel={() => this.setState({ comLangVisible: false })}
          bodyStyle={{ padding: '10px 12px' }}
          maskClosable={false}
          width={600}
        >
          {!isAdd
            ? <List
              size="small"
              footer={
                <Row type="flex" justify="center">
                  <Col>
                    <Button
                      icon="plus"
                      size="small"
                      type="primary"
                      ghost
                      onClick={() => this.setState({ isAdd: true, opreateType: 'add' })}
                    >
                      添加常用语
                    </Button>
                  </Col>
                </Row>
              }
              dataSource={comLangList}
              renderItem={item => <List.Item
              >
                <div className={styles.comLangListItem}>
                  <div className={styles.comLangListItem__content}>{item.content}</div>
                  <div className={styles.comLangListItem__operation}>
                    <Popconfirm
                      key="list-edit-confirm"
                      title="是否删除此常用语"
                      onConfirm={() => this.handleDeleteComLang(item)}
                    >
                      <a style={{ color: 'red' }} key="list-edit">删除</a>
                    </Popconfirm>
                    <Divider type="vertical" />
                    <a onClick={() => this.handleComLangEdit(item)} key="list-edit">编辑</a>
                  </div>
                </div>
              </List.Item>}
            />
            : <div>
              <div>
                {/* <Mentions
                  value={opreateType === 'add' ? comLang : curComLangInfo.news}
                  onChange={this.handleComLangchange}
                  rows="8"
                  loading={loadingQueryUsers}
                  onSearch={handleUserSearchChange}
                  placeholder="请输入需添加的常用语"
                >
                  {allUsersList.map(item => (
                    <Option key={item.userId} value={`${item.userName}-${item.userId}`}>
                      {item.userName}-{item.userId}-{item.deptName}
                    </Option>
                  ))}
                </Mentions> */}
              </div>
              <Row type="flex" justify="end" style={{ marginTop: 10 }}>
                <Col>
                  <Button
                    icon="close"
                    size="small"
                    type="primary"
                    ghost
                    onClick={() => this.setState({ isAdd: false })}
                  >
                    取消
              </Button>
                  <Divider type="vertical" />
                  <Button
                    // icon={opreateType === 'add' ? 'plus' : 'edit'}
                    size="small"
                    type="primary"
                    ghost
                    onClick={() => this.onSubmitComLang(comLang)}
                  >
                    {/* {opreateType === 'add' ? '添加常用语' : '编辑常用语'} */}
                  </Button>
                </Col>
              </Row>
            </div>}
        </Modal>
      </GlobalSandBox>
    );
  }
}

export default ChartCard;
