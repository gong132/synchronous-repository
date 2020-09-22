
import React from 'react';
import PropTypes from 'prop-types';
import { message } from 'antd';
let lockReconnect = false
let tt = null
class Websocket extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ws: window.WebSocket
        ? new window.WebSocket(this.props.url, this.props.protocol)
        : new window.MozWebSocket(this.props.url, this.props.protocol),
      attempts: 1,
    };
    this.sendMessage = this.sendMessage.bind(this);
    this.setupWebsocket = this.setupWebsocket.bind(this);
    this.heartCheckStart = this.heartCheckStart.bind(this)
    this.heartCheckReset = this.heartCheckReset.bind(this)
    this.wsReconnect = this.wsReconnect.bind(this)
  }

  componentDidMount() {
    this.setupWebsocket();
  }

  componentWillUnmount() {
    this.shouldReconnect = false;
    clearTimeout(this.timeoutID);
    const websocket = this.state.ws;
    websocket.close();
  }

  setupWebsocket() {
    const websocket = this.state.ws;
    console.log('***********************')
    websocket.onopen = () => {
      this.logging('Websocket connected');
      this.heartCheckReset()
      if (typeof this.props.onOpen === 'function') this.props.onOpen();
    };

    websocket.onerror = e => {
      if (typeof this.props.onError === 'function') this.props.onError(e);
      console.log('websocket连接出错')
      this.wsReconnect()
    };

    websocket.onmessage = evt => {
      const receiveData = JSON.parse(evt.data)
      const {heartCheck} = receiveData
      console.log('heartCheck:', heartCheck)
      if (heartCheck === '0') {
        this.heartCheckReset()
        this.props.onMessage(JSON.stringify(receiveData));
        return true;
      }
      if (heartCheck === '1') {
        this.heartCheckReset()
        return true;
      }
    };

    this.shouldReconnect = this.props.reconnect;
    websocket.onclose = evt => {
      console.log('关闭websocket')
      this.logging(
        `Websocket disconnected,the reason: ${evt.reason},the code: ${evt.code}`,
      );
      if (typeof this.props.onClose === 'function') { this.props.onClose(evt.code, evt.reason); }
      if (this.shouldReconnect) {
        if (!this.generateInterval) {
          console.log('websocket服务连接超时! 请稍后再试!')
          message.error('websocket服务连接超时! 请稍后再试!');
          // this.heartCheck().reset()
          this.wsReconnect()
          return;
        }
        const time = this.generateInterval(this.state.attempts);
        this.timeoutID = setTimeout(() => {
          const {attempts} = this.state
          this.setState({ attempts: attempts + 1 });
          this.setState({
            ws: window.WebSocket
              ? new window.WebSocket(this.props.url, this.props.protocol)
              : new window.MozWebSocket(this.props.url, this.props.protocol),
          });
          this.setupWebsocket();
        }, time);
      }
    };

    window.onbeforeunload = () => {
        websocket.close()
    }
  }

  // websocket重连
  wsReconnect = () => {
    const self = this
    if (lockReconnect) {
      return
    }
    lockReconnect = true
    tt && clearTimeout(tt)
    tt = setTimeout(() => {
      console.log('重连中...')
      lockReconnect = false
      self.setupWebsocket()
    }, 4000);
  }

  heartCheckStart = () => {
    const websocket = this.state.ws
    this.timeout = 60000
    this.timeoutInset = 5000
    this.timeoutObj = null
    this.serverTimeoutObj = null

    this.timeoutObj && window.clearTimeout(this.timeoutObj)
    this.serverTimeoutObj && window.clearTimeout(this.serverTimeoutObj)
    this.timeoutObj = setTimeout(() => {
      // 这里发送一个心跳，后端收到后返回一个心跳消息
      // onmessage拿到返回的心跳就说明连接正常
      const obj = {
        heartCheck: '1'
      }
      const msg = JSON.stringify(obj)
      console.log(msg)
      websocket.send(msg)

      this.serverTimeoutObj = setTimeout(() => {
        console.log('超过5s未接收到消息')
        websocket.close()
      }, this.timeoutInset);
      
    }, this.timeout);
  }

  heartCheckReset = () => {
    window.clearTimeout(this.timeoutObj)
    window.clearTimeout(this.serverTimeoutObj)
    this.heartCheckStart()
  }

  logging(logline) {
    if (this.props.debug === true) {
      console.log(logline);
    }
  }

  sendMessage(messages) {
    let msg = JSON.parse(messages)
    msg.heartCheck = '0' // 心跳检测默认传0
    msg = JSON.stringify(msg)
    console.log('msg', msg)
    const websocket = this.state.ws;
    websocket.send(msg);
  }

  render() {
    return <div />;
  }
}

Websocket.defaultProps = {
  debug: false,
  reconnect: true,
};

Websocket.propTypes = {
  url: PropTypes.string.isRequired,
  onMessage: PropTypes.func.isRequired,
  // onOpen: PropTypes.func,
  // onClose: PropTypes.func,
  // onError: PropTypes.func,
  debug: PropTypes.bool,
  reconnect: PropTypes.bool,
  // protocol: PropTypes.string,
  // reconnectIntervalInMilliSeconds: PropTypes.number,
};

export default Websocket;
