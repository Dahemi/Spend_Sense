import React from "react";
import Cards from "../components/Cards";
import "../components/Cards/styles.css";
import { Modal } from "antd";
import { useState } from "react";
import AddExpense from "../components/Modals/AddExpense";
import AddIncome from "../components/Modals/AddIncome";
import { addDoc, collection } from "firebase/firestore";
import { toast } from "react-toastify";
import { db, auth } from "../firebase";
function Dashboard() {
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);

  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };

  const onFormSubmit = (values, type) => {
    //object with transaction details
    const newTransaction = {
      type: type,
      name: values.name,
      amount: values.amount,
      date: values.date.format("YYYY-MM-DD"), // Convert to string
      tag: values.tag,
      createdAt: new Date(),
    };

    addTransaction(newTransaction);
  };

  const addTransaction = async (transaction) => {
    const user = auth.currentUser; // Ensure user is authenticated
    if (!user) {
      toast.error("User not authenticated");
      return;
    }

    // Add transaction to the database
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log("Document written with ID: ", docRef.id);
      toast.success("Transaction added successfully!");
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("Error adding transaction!");
    }
  };

  return (
    <div className="dashboard-container">
      <Cards
        showExpenseModal={showExpenseModal}
        showIncomeModal={showIncomeModal}
      />
      <Modal
        style={{ fontWeight: 600 }}
        title="Add Income"
        visible={isIncomeModalVisible}
        onCancel={handleIncomeCancel}
        onFinish={onFormSubmit}
        footer={null}
      >
        <AddIncome
          isIncomeModalVisible={isIncomeModalVisible}
          handleIncomeCancel={handleIncomeCancel}
          onFinish={onFormSubmit}
        />
      </Modal>
      <Modal
        style={{ fontWeight: 600 }}
        title="Add Expense"
        onCancel={handleExpenseCancel}
        visible={isExpenseModalVisible}
        onFinish={onFormSubmit}
        footer={null}
      >
        <AddExpense
          isExpenseModalVisible={isExpenseModalVisible}
          handleExpenseCancel={handleExpenseCancel}
          onFinish={onFormSubmit}
        />
      </Modal>
    </div>
  );
}

export default Dashboard;
