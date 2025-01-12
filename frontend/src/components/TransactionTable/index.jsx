import React, { useState, useEffect } from "react";
import { Table, Tag, Button, Upload, Divider } from "antd";
import { db, auth } from "../../firebase";
import { collection, query, getDocs, addDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import Papa from "papaparse";
import { toast } from "react-toastify";

function TransactionTable({
  updateBalanceCallback,
  transactions,
  setTransactions,
}) {
  const [user] = useAuthState(auth);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
  });

  const addTransactionsFromCSV = async (csvTransactions) => {
    if (!user) {
      toast.error("User not authenticated");
      return;
    }
    try {
      const batch = csvTransactions.map(async (transaction) => {
        const docRef = await addDoc(
          collection(db, `users/${user.uid}/transactions`),
          {
            ...transaction,
            createdAt: new Date(),
            type: transaction.type || "expense",
          }
        );
        return { ...transaction, key: docRef.id };
      });

      const newTransactions = await Promise.all(batch);
      setTransactions((prev) => [...prev, ...newTransactions]);
      updateBalanceCallback();
      toast.success(
        `${newTransactions.length} transactions imported successfully!`
      );
    } catch (error) {
      console.error("Error importing transactions:", error);
      toast.error("Failed to import transactions");
    }
  };

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
      } catch (error) {
        console.error("Error fetching transactions:", error);
        toast.error("Error fetching transactions");
      }
    };
    fetchTransactions();
  }, [user, setTransactions]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      sorter: (a, b) => a.amount - b.amount,
      render: (amount, record) => (
        <Tag color={record.type === "income" ? "green" : "red"}>
          {record.type === "income" ? "+" : "-"} ${amount}
        </Tag>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => a.date.localeCompare(b.date),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      filters: [
        { text: "Income", value: "income" },
        { text: "Expense", value: "expense" },
      ],
      onFilter: (value, record) => record.type === value,
    },
  ];

  const exportToCSV = () => {
    const csvData = transactions.map(({ name, amount, date, type }) => ({
      Name: name,
      Amount: amount,
      Date: date,
      Type: type,
    }));
    const csvString = Papa.unparse(csvData);
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
  };

  const importFromCSV = (file) => {
    if (!user) {
      toast.error("Please log in first");
      return;
    }
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const validTransactions = results.data
          .filter((t) => t.Name && t.Amount && t.Date)
          .map((t) => ({
            name: t.Name,
            amount: Number(t.Amount),
            date: t.Date,
            type: t.Type || "expense",
          }));
        if (validTransactions.length > 0) {
          addTransactionsFromCSV(validTransactions);
        } else {
          toast.error("No valid transactions found in the CSV.");
        }
      },
      error: (error) => {
        console.error("CSV parsing error:", error);
        toast.error("Error parsing CSV file");
      },
    });
  };

  return (
    <div>
      <Table
        dataSource={transactions}
        columns={columns}
        pagination={{
          ...pagination,
          onChange: (current, pageSize) => setPagination({ current, pageSize }),
        }}
      />
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={exportToCSV}>
          Export to CSV
        </Button>
        <br />
        <br />

        <Upload
          accept=".csv"
          beforeUpload={(file) => {
            importFromCSV(file);
            return false;
          }}
        >
          <Button type="primary">Import from CSV</Button>
        </Upload>
      </div>
    </div>
  );
}

export default TransactionTable;
