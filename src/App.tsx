import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Report from "./pages/Report";
import NoMatch from "./pages/NoMatch";
import AppLayout from "./components/layout/AppLayout";
import { theme } from "./theme/theme";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { useEffect, useState } from "react";
import { Transaction } from "./types";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { formatMonth } from "./utils/formatting";
import { Schema } from "./validation/schema";

function App() {
  // Firestoreエラーかどうかを判定する型ガード
  function isFireStoreError(
    err: unknown
  ): err is { code: string; message: string } {
    return typeof err === "object" && err !== null && "code" in err;
  }

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  // firestoreのデータを全て取得
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Transactions"));
        const transactionsData = querySnapshot.docs.map((doc) => {
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, " => ", doc.data());
          return {
            ...doc.data(),
            id: doc.id,
          } as Transaction;
        });
        // console.log(transactionsData);
        setTransactions(transactionsData);
      } catch (err) {
        if (isFireStoreError(err)) {
          console.error("FireStoreエラーは: ", err);
          console.error(err.message);
          console.error(err.code);
        } else {
          console.error("一般的なエラーは: ", err);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  // console.log("transactions", transactions);
  // console.log("isLoading", isLoading);

  // ひと月分のデータを取得
  const monthlyTransactions = transactions.filter((transaction) => {
    return transaction.date.startsWith(formatMonth(currentMonth));
  });
  // console.log(monthlyTransactions);

  // 取引を保存する処理
  const handleSaveTransaction = async (transaction: Schema) => {
    // console.log("transaction", transaction);

    try {
      //firestoreにデータを保存
      // Add a new document with a generated id.
      const docRef = await addDoc(collection(db, "Transactions"), transaction);
      console.log("Document written with ID: ", docRef.id);

      const newTransaction = {
        id: docRef.id,
        ...transaction,
      } as Transaction;
      // console.log("newTransaction", newTransaction);
      setTransactions((prevTransaction) => [
        ...prevTransaction,
        newTransaction,
      ]);
    } catch (err) {
      if (isFireStoreError(err)) {
        console.error("FireStoreエラーは: ", err);
      } else {
        console.error("一般的なエラーは: ", err);
      }
    }
  };

  // 取引を削除する処理
  const handleDeleteTransaction = async (
    transactionIds: string | readonly string[]
  ) => {
    try {
      const idsToDelete = Array.isArray(transactionIds)
        ? transactionIds
        : [transactionIds];
      // console.log("idsToDelete", idsToDelete);

      for (const id of idsToDelete) {
        // firestoreのデータ削除;
        await deleteDoc(doc(db, "Transactions", id));
      }

      // const filteredTransactions = transactions.filter(
      //   (transaction) => transaction.id !== transactionIds
      // );

      const filteredTransactions = transactions.filter(
        (transaction) => !idsToDelete.includes(transaction.id)
      );
      console.log("filteredTransactions", filteredTransactions);
      setTransactions(filteredTransactions);
    } catch (err) {
      if (isFireStoreError(err)) {
        console.error("FireStoreエラーは: ", err);
      } else {
        console.error("一般的なエラーは: ", err);
      }
    }
  };

  const handleUpdateTransaction = async (
    transaction: Schema,
    transactionId: string
  ) => {
    try {
      const docRef = doc(db, "Transactions", transactionId);
      await updateDoc(docRef, transaction);
      // フロント更新
      const updatedTransactions = transactions.map((t) =>
        t.id === transactionId ? { ...t, ...transaction } : t
      );
      // console.log("updatedTransactions", updatedTransactions);
      setTransactions(updatedTransactions);
    } catch (err) {
      if (isFireStoreError(err)) {
        console.error("FireStoreエラーは: ", err);
      } else {
        console.error("一般的なエラーは: ", err);
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route
              index
              element={
                <Home
                  monthlyTransactions={monthlyTransactions}
                  setCurrentMonth={setCurrentMonth}
                  onSaveTransaction={handleSaveTransaction}
                  onDeleteTransaction={handleDeleteTransaction}
                  onUpdateTransaction={handleUpdateTransaction}
                />
              }
            />
            <Route
              path="/report"
              element={
                <Report
                  currentMonth={currentMonth}
                  setCurrentMonth={setCurrentMonth}
                  monthlyTransactions={monthlyTransactions}
                  isLoading={isLoading}
                  onDeleteTransaction={handleDeleteTransaction}
                />
              }
            />
            <Route path="*" element={<NoMatch />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
