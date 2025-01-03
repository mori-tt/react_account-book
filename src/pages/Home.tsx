import { Box } from "@mui/material";
import MonthlySummary from "../components/MonthlySummary";
import Calender from "../components/Calender";
import TransactionMenu from "../components/TransactionMenu";
import TransactionForm from "../components/TransactionForm";
import { Transaction } from "../types";
import { useState } from "react";
import { format } from "date-fns";

interface HomeProps {
  monthlyTransactions: Transaction[];
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
}

const Home = ({ monthlyTransactions, setCurrentMonth }: HomeProps) => {
  const today = format(new Date(), "yyyy-MM-dd");
  const [currentDay, setCurrentDay] = useState(today);
  const [isEntryDrawerOpen, setIsEntryDrawerOpen] = useState(false);

  const dailyTransactions = monthlyTransactions.filter((transaction) => {
    return transaction.date === currentDay;
  });
  // console.log("dailyTransactions", dailyTransactions);

  const closeForm = () => {
    setIsEntryDrawerOpen(!isEntryDrawerOpen);
  };

  // フォームの開閉処理
  const handleAddTransactionFrom = () => {
    setIsEntryDrawerOpen(!isEntryDrawerOpen);
  };
  return (
    <Box sx={{ display: "flex" }}>
      {/* left side */}
      <Box sx={{ flexGrow: 1 }}>
        <MonthlySummary monthlyTransactions={monthlyTransactions} />
        <Calender
          monthlyTransactions={monthlyTransactions}
          setCurrentMonth={setCurrentMonth}
          setCurrentDay={setCurrentDay}
          currentDay={currentDay}
          today={today}
        />
      </Box>
      {/* right side */}
      <Box>
        <TransactionMenu
          dailyTransactions={dailyTransactions}
          currentDay={currentDay}
          onAddTransactionFrom={handleAddTransactionFrom}
        />
        <TransactionForm
          onCloseForm={closeForm}
          isEntryDrawerOpen={isEntryDrawerOpen}
          currentDay={currentDay}
        />
      </Box>
    </Box>
  );
};

export default Home;
