import { Box } from "@mui/material";
import MonthlySummary from "../components/MonthlySummary";
import Calender from "../components/Calender";
import TransactionMenu from "../components/TransactionMenu";
import TransactionForm from "../components/TransactionForm";
import { Transaction } from "../types";

interface HomeProps {
  monthlyTransactions: Transaction[];
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
}

const Home = ({ monthlyTransactions, setCurrentMonth }: HomeProps) => {
  return (
    <Box sx={{ display: "flex" }}>
      {/* left side */}
      <Box sx={{ flexGrow: 1 }}>
        <MonthlySummary monthlyTransactions={monthlyTransactions} />
        <Calender
          monthlyTransactions={monthlyTransactions}
          setCurrentMonth={setCurrentMonth}
        />
      </Box>
      {/* right side */}
      <Box>
        <TransactionMenu />
        <TransactionForm />
      </Box>
    </Box>
  );
};

export default Home;
