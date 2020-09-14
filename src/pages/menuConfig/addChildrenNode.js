import React from "react"
import { Form, Modal, Select } from "antd"
import { isEmpty } from "@/utils/lang";
import { formLayoutMenuItem, MENU_ITEM } from "@/utils/constant";

const { Option } = Select;
const Index = props => {
    const { form, modalVisible, handleModalVisible, localMenu, values, handleAddMenu } = props;
    const getMenuNode = () => {
      let menuList = [];
      if (!values.key) {
        menuList = localMenu.filter(v => v.path && v.path.split('').filter(o => o === '/').length === 1)
        return menuList
      }
      const findSelectedMenu = localMenu.find(v => v.path === values.url);
      if (findSelectedMenu && !isEmpty(findSelectedMenu.children)) {
        menuList = findSelectedMenu.children;
        return menuList
      }
      if (findSelectedMenu && !isEmpty(findSelectedMenu.buttons)) {
        menuList = findSelectedMenu.buttons.map(v => ({ name: v.name, path: v.key}));
        return menuList
      }
    };

    const handleOk = () => {
      form.validateFields((err, { nodePath, type }) => {
        if (err) return;
        if (isEmpty(nodePath)) return;
        let params = {};
        const findSelectedMenu = localMenu.find(v => v.path === nodePath);
        // 如果key不存在, 则说明是增加一级菜单
        if (!values.key) {
          params = {
            name: findSelectedMenu.name,
            url: findSelectedMenu.path,
            type: 0,
            pid: 0,
          }
        }
        if (!isEmpty(findSelectedMenu)&& !isEmpty(findSelectedMenu.children) && String(type) === "1") {
          params = {
            name: findSelectedMenu.name,
            url: findSelectedMenu.path,
            type,
            pid: values.id,
          }
        }
        if (isEmpty(findSelectedMenu) && String(type) === "2"){
          const buttons = getMenuNode().find(v => v.path === nodePath);
          params = {
            name: buttons.name,
            type,
            pid: values.id,
            url: nodePath,
          }
        }
        handleAddMenu(params, handleModalVisible)
      })
    };
    return (
      <Modal
        width={640}
        title="新增菜单"
        visible={modalVisible}
        onCancel={handleModalVisible}
        onOk={handleOk}
      >
        <Form>
          <Form.Item {...formLayoutMenuItem} label="菜单名称">
            {form.getFieldDecorator('nodePath', {
              rules: [{ required: true, message: '请选择菜单名称' }]
            })(
              <Select>
                {
                  getMenuNode() && getMenuNode().map(v => (<Option value={v.path} key={v.path}>{v.name}</Option>))
                }
              </Select>
            )}
          </Form.Item>
          <Form.Item {...formLayoutMenuItem} label="菜单类型">
            {form.getFieldDecorator('type', {
              rules: [{ required: true, message: '请选择菜单类型' }]
            })(
              <Select>
                {
                  MENU_ITEM.map(v => (<Option value={v.key} key={v.key}>{v.value}</Option>))
                }
              </Select>
            )}
          </Form.Item>
        </Form>
      </Modal>
    )
};

export default Form.create()(Index)
