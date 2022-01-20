import { DeleteFilled, EditFilled } from "@ant-design/icons";
import { Button, Popconfirm, Row, Form } from "antd";
import React from "react";

const FormButtons = ({ actionLoading, handleClearForm }) => {
  return (
    <Row justify="space-between" align="middle" style={{ width: "100%" }}>
      <Form.Item>
        <Popconfirm
          title="از پاک کردن فرم مطمئن هستید؟"
          onConfirm={handleClearForm}
          okText="بله"
          cancelText="خیر"
        >
          <Button danger type="primary">
            پاک کردن
          </Button>
        </Popconfirm>
      </Form.Item>
      <Form.Item>
        <Button loading={actionLoading} type="primary" htmlType="submit">
          تایید
        </Button>
      </Form.Item>
    </Row>
  );
};

export default FormButtons;
