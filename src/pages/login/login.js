import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {Alert, message, Checkbox, Form, Input, Button} from 'antd';
import Login from '@/components/Login';
import styles from './login.less';
import storage from "@/utils/storage";
import {isEmpty} from "@/utils/lang";

@connect(({ login, global, loading }) => ({
  login,
  global,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      autoLogin: false,
      username: undefined,
      password: undefined,
    };
  }

  changeAutoLogin = (e) => {
    this.setState({
      autoLogin: e.target.checked
    })
  }

  handleSubmit = () => {
    const { form, dispatch } = this.props
    form.validateFields((err, values) => {
      console.log(values, "values")
      if (err) return
      if (!values.username) {
        message.error('请输入用户名');
        return;
      }

      if (!values.password) {
        message.error('请输入密码');
        return;
      }
      dispatch({
        type: 'login/login',
        payload: {
          userId: values.username,
          password: values.password,
        },
      }).then(result => {
        if (!result) return
        storage.remove("user")
        if (this.state.autoLogin) {
          storage.set("user", {
            username: values.username,
            password: values.password,
          })
        }
      });
    })
  };

  componentDidMount() {
    const user = storage.get("user", {})
    if (!isEmpty(user)) {
      this.setState({
        username: user?.username,
        password: user?.password,
        autoLogin: true,
      })
    }
  }

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { submitting, form } = this.props;
    const { autoLogin, username, password } = this.state;
    return (
      <div className={styles.bossMain}>
        <div className={styles.main}>
          <Login>
            <div className={styles.cusTabTitle}>欢迎登录需求管理平台</div>
            <Form>
              <div className={styles.labelStyle}>账号</div>
              <Form.Item>
                {form.getFieldDecorator("username", {
                  initialValue: username
                })(<Input placeholder="登录账号" />)}
              </Form.Item>
              <div className={styles.labelStyle}>密码</div>
              <Form.Item>
                {form.getFieldDecorator("password", {
                  initialValue: password
                })(<Input.Password placeholder="登录密码" />)}
              </Form.Item>
            </Form>
            <Button type="primary" loading={submitting} onClick={this.handleSubmit} className={styles.submitBtn}>
              登录
            </Button>
            <div className={styles.cusAutoLogin}>
              <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
                保存密码
              </Checkbox>
            </div>
          </Login>
        </div>
      </div>
    );
  }
}

export default Form.create()(LoginPage);
