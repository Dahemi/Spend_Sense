import React from "react";
import { Line } from "@ant-design/charts";
import { db, auth } from "../../firebase";
import { collection, query, onSnapshot } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import NoTransactions from "../NoTransactions";

function Chart() {
  const [user] = useAuthState(auth);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If no user is logged in, exit early
    if (!user) {
      setIsLoading(false);
      return;
    }

    // Create a query to the user's transactions collection
    const q = query(collection(db, `users/${user.uid}/transactions`));

    // Set up a real-time listener
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        // Transform snapshot data
        const transactionArray = querySnapshot.docs
          .map((doc) => {
            const data = doc.data();

            // Ensure we have valid data
            if (data && data.date && data.amount) {
              return {
                // Group by month for more granular chart
                year: data.date.split("-")[0],
                month: data.date.split("-")[1],
                value: Number(data.amount) || 0,
                type: data.type || "unknown",
              };
            }
            return null;
          })
          .filter((item) => item !== null);

        // Aggregate data for chart
        const aggregatedData = aggregateTransactionData(transactionArray);

        console.log("Real-time Transformed Transactions:", aggregatedData);

        // Update state
        setTransactions(aggregatedData);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching real-time transactions:", error);
        toast.error("Failed to fetch real-time transactions");
        setIsLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [user]);

  // Function to aggregate transaction data
  const aggregateTransactionData = (transactions) => {
    // Group transactions by year-month and type
    const aggregatedMap = {};

    transactions.forEach((transaction) => {
      const key = `${transaction.year}-${transaction.month}`;

      if (!aggregatedMap[key]) {
        aggregatedMap[key] = {
          year: `${transaction.year}-${transaction.month}`,
          income: 0,
          expense: 0,
        };
      }

      // Aggregate based on transaction type
      if (transaction.type === "income") {
        aggregatedMap[key].income += transaction.value;
      } else if (transaction.type === "expense") {
        aggregatedMap[key].expense += transaction.value;
      }
    });

    // Convert aggregated map to array
    return Object.values(aggregatedMap)
      .map((item) => [
        {
          year: item.year,
          value: item.income,
          type: "Income",
        },
        {
          year: item.year,
          value: item.expense,
          type: "Expense",
        },
      ])
      .flat();
  };

  // Chart configuration
  const config = {
    data: transactions,
    xField: "year",
    yField: "value",
    seriesField: "type",
    width: 800,
    height: 400,
    point: {
      size: 5,
      shape: "diamond",
    },
    label: {
      style: {
        fill: "#aaa",
      },
    },
    // Add color mapping for better visualization
    color: ({ type }) => {
      return type === "Income" ? "#52c41a" : "#f5222d";
    },
    // Add legend
    legend: {
      position: "top",
    },
    // Smooth the line
    smooth: true,
  };

  // Render logic
  if (isLoading) {
    return <div>Loading chart data...</div>;
  }

  if (transactions.length === 0) {
    return (
      <div>
        <>
          <NoTransactions />
        </>
      </div>
    );
  }

  return (
    <div>
      <Line {...config} />
    </div>
  );
}

export default Chart;
