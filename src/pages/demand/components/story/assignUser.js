import React, { useState } from "react";
import {Button, Form, message, Select} from "antd";
import { formLayoutItemAddEdit } from "@/utils/constant";
import {isEmpty} from "@/utils/lang";

const FormItem = Form.Item;
const { Option } = Select;
const Index = props => {
  const { userList, handleVisible, onOk, rows } = props;
  console.log(rows, "rows")
  const [userId, setUserId] = useState(undefined)
  const handleOk = () =>{
    if (isEmpty(userId)) {
      message.error("请选择指派人");
      return
    }
    const params = {
      userId,
      demandId: rows.id,
      userName: userList?.list ? userList?.list.find(v => v.userId === userId)?.userName : null,
    }
    onOk(params)
  }
  return (
    <div style={{ width: 300 }}>
      <Form>
        <FormItem {...formLayoutItemAddEdit} label="关注人">
          <Select
            value={userId}
            placeholder="请选择关注人"
            onClick={e => e.stopPropagation()}
            onChange={val => setUserId(val)}
          >
            {
              userList?.list && userList?.list.map(v => (
                <Option value={v.userId} key={v.userId.toString()}>
                  {v.userName}
                </Option>
              ))
            }
          </Select>
        </FormItem>
      </Form>
      <div className="rFlex">
        <Button
          ghost
          type="primary"
          onClick={e => {
            e.stopPropagation();
            handleVisible(false)
          }}
        >
          取消
        </Button>
        <Button
          className="margin-left-12"
          type="primary"
          onClick={e => {
            e.stopPropagation();
            handleOk()
          }}
        >
          确认
        </Button>
      </div>
    </div>
  )
}

export default Index
