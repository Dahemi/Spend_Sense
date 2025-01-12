import React from "react";
import "./styles.css";
import { Button, Card, Statistic } from "antd";
function Cards({
  balance,
  income,
  expense,
  showExpenseModal,
  showIncomeModal,
}) {
  return (
    <div className="cards-container">
      <Card className="minimal-card">
        <Statistic
          title="Current Balance"
          value={balance}
          precision={2}
          prefix="$"
          valueStyle={{ fontSize: "1.5rem", fontWeight: "bold" }}
        />
        <Button type="default" className="reset-button">
          Reset Balance
        </Button>
      </Card>

      <Card className="minimal-card">
        <Statistic
          title="Total Income"
          value={income}
          precision={2}
          prefix="$"
          valueStyle={{ fontSize: "1.5rem", fontWeight: "bold" }}
        />
        <Button
          type="default"
          className="reset-button"
          onClick={showIncomeModal}
        >
          Add Income
        </Button>
      </Card>

      <Card className="minimal-card">
        <Statistic
          title="Total Expense"
          value={expense}
          precision={2}
          prefix="$"
          valueStyle={{ fontSize: "1.5rem", fontWeight: "bold" }}
        />
        <Button
          type="default"
          className="reset-button"
          onClick={showExpenseModal}
        >
          Add Expense
        </Button>
      </Card>
    </div>
  );
}

export default Cards;
