import React from "react";
import { Modal, Input, Button, Form, DatePicker, Select } from "antd";
import "./styles.css";

function AddIncome({ onFinish }) {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={(values) => {
        onFinish(values, "income"); // Calls the parent component's function
        form.resetFields();
      }}
    >
      <Form.Item
        style={{ fontWeight: 600 }}
        label="Name"
        name="name"
        rules={[
          {
            required: true,
            message: "Please input the income name!",
          },
        ]}
      >
        <Input type="text" className="custom-input" />
      </Form.Item>
      <Form.Item
        style={{ fontWeight: 600 }}
        label="Amount"
        name="amount"
        rules={[
          {
            required: true,
            message: "Please input the income amount!",
          },
        ]}
      >
        <Input type="number" className="custom-input" />
      </Form.Item>
      <Form.Item
        style={{ fontWeight: 600 }}
        label="Date"
        name="date"
        rules={[
          {
            required: true,
            message: "Please select the income date!",
          },
        ]}
      >
        <DatePicker className="custom-input" format="YYYY-MM-DD" />
      </Form.Item>
      <Form.Item
        style={{ fontWeight: 600 }}
        label="Tag"
        name="tag"
        rules={[
          {
            required: true,
            message: "Please select a tag!",
          },
        ]}
      >
        <Select className="select-input-2">
          <Select.Option value="salary">Salary</Select.Option>
          <Select.Option value="investment">Investment</Select.Option>
          <Select.Option value="other">Other</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Button className="btn btn-blue" type="primary" htmlType="submit">
          Add Income
        </Button>
      </Form.Item>
    </Form>
  );
}

export default AddIncome;
