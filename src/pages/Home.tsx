import { Box } from "@mui/material";
import MonthlySummary from "../components/MonthlySummary";
import Calender from "../components/Calender";
import TransactionMenu from "../components/TransactionMenu";
import TransactionForm from "../components/TransactionForm";

const Home = () => {
  return (
    <Box sx={{ display: "flex" }}>
      {/* left side */}
      <Box sx={{ flexGrow: 1 }}>
        <MonthlySummary />
        <Calender />
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
