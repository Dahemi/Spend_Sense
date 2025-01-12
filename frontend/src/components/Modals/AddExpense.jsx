import React from "react";
import {
  Card,
  Col,
  Row,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
} from "antd";

/**
 * AddExpense component
 *
 * @param {Object} props
 * @param {Boolean} props.isExpenseModalVisible - Whether the modal is visible
 * @param {Function} props.handleExpenseCancel - Function to handle modal cancel
 * @param {Function} props.onFinish - Function to handle form submission
 */
function AddExpense({ onFinish }) {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={(values) => {
        onFinish(values, "expense");
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
            message: "Please input the name of the transaction!",
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
          { required: true, message: "Please input the expense amount!" },
        ]}
      >
        <Input type="number" className="custom-input" />
      </Form.Item>
      <Form.Item
        style={{ fontWeight: 600 }}
        label="Date"
        name="date"
        rules={[{ required: true, message: "Please select the expense date!" }]}
      >
        <DatePicker className="custom-input" format="YYYY-MM-DD" />
      </Form.Item>
      <Form.Item
        label="Tag"
        name="tag"
        style={{ fontWeight: 600 }}
        rules={[{ required: true, message: "Please select a tag!" }]}
      >
        <Select className="select-input-2">
          <Select.Option value="food">Food</Select.Option>
          <Select.Option value="education">Education</Select.Option>
          <Select.Option value="office">Office</Select.Option>
          {/* Add more tags here */}
        </Select>
      </Form.Item>
      <Form.Item>
        <Button className="btn btn-blue" type="primary" htmlType="submit">
          Add Expense
        </Button>
      </Form.Item>
    </Form>
  );
}

export default AddExpense;
