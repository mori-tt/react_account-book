import { Box, useMediaQuery, useTheme } from "@mui/material";
import MonthlySummary from "../components/MonthlySummary";
import Calender from "../components/Calender";
import TransactionMenu from "../components/TransactionMenu";
import TransactionForm from "../components/TransactionForm";
import { Transaction } from "../types";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Schema } from "../validation/schema";
import { DateClickArg } from "@fullcalendar/interaction/index.js";
import { useAppContext } from "../context/AppContext";
import useMonthlyTransactions from "../hooks/useMonthlyTransactions";

// interface HomeProps {
//   monthlyTransactions: Transaction[];
//   setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
//   onSaveTransaction: (transaction: Schema) => Promise<void>;
//   onDeleteTransaction: (
//     transactionId: string | readonly string[]
//   ) => Promise<void>;
//   onUpdateTransaction: (
//     transaction: Schema,
//     transactionId: string
//   ) => Promise<void>;
// }

const Home = () =>
  // {}:
  // monthlyTransactions,
  // setCurrentMonth,
  // onSaveTransaction,
  // onDeleteTransaction,
  // onUpdateTransaction,
  // HomeProps
  {
    const { isMobile } = useAppContext();
    const monthlyTransactions = useMonthlyTransactions();
    const today = format(new Date(), "yyyy-MM-dd");
    const [currentDay, setCurrentDay] = useState(today);
    const [isEntryDrawerOpen, setIsEntryDrawerOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] =
      useState<Transaction | null>(null);
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // // レスポンシブの設定（モバイル）
    // const theme = useTheme();
    // const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
    // console.log("isMobile", isMobile);

    // 1日分のデータを取得
    const dailyTransactions = useMemo(() => {
      return monthlyTransactions.filter((transaction) => {
        return transaction.date === currentDay;
      });
    }, [monthlyTransactions, currentDay]);
    // console.log("dailyTransactions", dailyTransactions);

    // フォームの閉じる処理
    const closeForm = () => {
      setSelectedTransaction(null);

      if (isMobile) {
        setIsDialogOpen(!setIsDialogOpen);
      } else {
        setIsEntryDrawerOpen(!isEntryDrawerOpen);
      }
    };

    // フォームの開閉処理
    const handleAddTransactionFrom = () => {
      if (isMobile) {
        setIsDialogOpen(true);
      } else {
        if (selectedTransaction) {
          setSelectedTransaction(null);
        } else {
          setIsEntryDrawerOpen(!isEntryDrawerOpen);
        }
      }
    };

    // 取引が選択された時の処理
    const handleSelectTransaction = (transaction: Transaction) => {
      // console.log("transaction", transaction);
      setSelectedTransaction(transaction);
      if (isMobile) {
        setIsDialogOpen(true);
      } else {
        setIsEntryDrawerOpen(true);
      }
    };

    // モバイル用Drawerを閉じる関数
    const handleCloseMobileDrawer = () => {
      setIsMobileDrawerOpen(false);
    };

    // 日付を選択した時の処理
    const handleDateClick = (dateInfo: DateClickArg) => {
      // console.log(dateInfo);
      setCurrentDay(dateInfo.dateStr);
      setIsMobileDrawerOpen(true);
    };
    return (
      <Box sx={{ display: "flex" }}>
        {/* left side */}
        <Box sx={{ flexGrow: 1 }}>
          <MonthlySummary
          // onthlyTransactions={monthlyTransactions}
          />
          <Calender
            // monthlyTransactions={monthlyTransactions}
            // setCurrentMonth={setCurrentMonth}
            setCurrentDay={setCurrentDay}
            currentDay={currentDay}
            today={today}
            onDateClick={handleDateClick}
          />
        </Box>
        {/* right side */}
        <Box>
          <TransactionMenu
            dailyTransactions={dailyTransactions}
            currentDay={currentDay}
            onAddTransactionFrom={handleAddTransactionFrom}
            onSelectTransaction={handleSelectTransaction}
            // isMobile={isMobile}
            open={isMobileDrawerOpen}
            onClose={handleCloseMobileDrawer}
          />
          <TransactionForm
            onCloseForm={closeForm}
            isEntryDrawerOpen={isEntryDrawerOpen}
            currentDay={currentDay}
            // onSaveTransaction={onSaveTransaction}
            selectedTransaction={selectedTransaction}
            // onDeleteTransaction={onDeleteTransaction}
            setSelectedTransaction={setSelectedTransaction}
            // onUpdateTransaction={onUpdateTransaction}
            // isMobile={isMobile}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
          />
        </Box>
      </Box>
    );
  };

export default Home;
