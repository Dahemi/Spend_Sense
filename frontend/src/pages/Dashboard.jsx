import React, { useEffect, useState } from "react";
import { Modal, Divider } from "antd";
import { addDoc, collection, query, getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
import { db, auth } from "../firebase";
import Cards from "../components/Cards";
import AddExpense from "../components/Modals/AddExpense";
import AddIncome from "../components/Modals/AddIncome";
import TransactionTable from "../components/TransactionTable";
import "../components/Cards/styles.css";
import Chart from "../components/Charts";
import NoTransactions from "../components/NoTransactions";

function Dashboard() {
  const [user, loading] = useAuthState(auth);

  // State variables for controlling modals and data
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [setLoading] = useState(false);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  /**
   * Functions to show/hide modals
   */
  const showExpenseModal = () => setIsExpenseModalVisible(true);
  const showIncomeModal = () => setIsIncomeModalVisible(true);
  const handleExpenseCancel = () => setIsExpenseModalVisible(false);
  const handleIncomeCancel = () => setIsIncomeModalVisible(false);

  /**
   * Handle form submission for adding transactions
   */
  const onFormSubmit = (values, type) => {
    const newTransaction = {
      type,
      name: values.name,
      amount: Number(values.amount),
      date: values.date.format("YYYY-MM-DD"),
      tag: values.tag,
      createdAt: new Date(),
    };
    addTransaction(newTransaction);
  };

  /**
   * Add a transaction to Firestore
   */
  const addTransaction = async (transaction) => {
    //get currently authenticated user
    const user = auth.currentUser;
    if (!user) {
      toast.error("User not authenticated");
      return;
    }
    try {
      //adding data to the subcollection
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log("Document written with ID: ", docRef.id);
      toast.success("Transaction added successfully!");

      setTransactions((prevTransactions) => [...prevTransactions, transaction]);
      calculateBalance();
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("Error adding transaction!");
    }
  };

  /**
   * Fetch transactions from Firestore on initial render
   */
  useEffect(() => {
    if (!user) return;

    const fetchTransactions = async () => {
      try {
        const q = query(collection(db, `users/${user.uid}/transactions`));
        const querySnapshot = await getDocs(q);
        const transactionArray = querySnapshot.docs.map((doc) => ({
          key: doc.id,
          ...doc.data(),
        }));
        setTransactions(transactionArray);
        calculateBalance();
      } catch (error) {
        console.error("Error fetching transactions:", error);
        toast.error("Error fetching transactions");
      }
    };

    fetchTransactions();
  }, [user]);

  /**
   * Calculate income, expenses, and total balance
   */
  const calculateBalance = () => {
    if (!transactions || transactions.length === 0) {
      setIncome(0);
      setExpenses(0);
      setTotalBalance(0);
      return;
    }
    const calculatedIncome = transactions
      .filter((transaction) => transaction.type === "income")
      .reduce((total, transaction) => total + Number(transaction.amount), 0);

    const calculatedExpenses = transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((total, transaction) => total + Number(transaction.amount), 0);

    setIncome(calculatedIncome);
    setExpenses(calculatedExpenses);
    setTotalBalance(calculatedIncome - calculatedExpenses);
  };

  /**
   * Recalculate balance when transactions change
   */
  useEffect(() => {
    if (transactions.length > 0) {
      calculateBalance();
    }
  }, [transactions]);

  /**
   * Log current states for debugging
   */
  useEffect(() => {
    console.log("Current Transactions:", transactions);
    console.log("Income:", income);
    console.log("Expenses:", expenses);
    console.log("Total Balance:", totalBalance);
  }, [transactions, income, expenses, totalBalance]);

  return (
    <div className="dashboard-container">
      <Cards
        showExpenseModal={showExpenseModal}
        showIncomeModal={showIncomeModal}
        balance={totalBalance}
        income={income}
        expense={expenses}
      />
      <Modal
        style={{ fontWeight: 600 }}
        title="Add Income"
        visible={isIncomeModalVisible}
        onCancel={handleIncomeCancel}
        footer={null}
      >
        <AddIncome onFinish={onFormSubmit} />
      </Modal>
      <Modal
        style={{ fontWeight: 600 }}
        title="Add Expense"
        visible={isExpenseModalVisible}
        onCancel={handleExpenseCancel}
        footer={null}
      >
        <AddExpense onFinish={onFormSubmit} />
      </Modal>

      <Divider />

      <Chart />

      <Divider />

      {/* Render the transaction table */}
      <TransactionTable
        transactions={transactions}
        setTransactions={setTransactions}
        updateBalanceCallback={calculateBalance}
      />
    </div>
  );
}

export default Dashboard;
