import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Drawer,
  Grid,
  List,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";
//アイコン
import NotesIcon from "@mui/icons-material/Notes";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DailySummary from "./DailySummary";
import { Transaction } from "../types";
import { formatCurrency } from "../utils/formatting";
import IconComponents from "./common/IconComponents";
import { useAppContext } from "../context/AppContext";

interface TransactionProps {
  dailyTransactions: Transaction[];
  currentDay: string;
  onAddTransactionFrom: () => void;
  onSelectTransaction: (transaction: Transaction) => void;
  // isMobile: boolean;
  open: boolean;
  onClose: () => void;
}

const TransactionMenu = ({
  dailyTransactions,
  currentDay,
  onAddTransactionFrom,
  onSelectTransaction,
  // isMobile,
  open,
  onClose,
}: TransactionProps) => {
  const { isMobile } = useAppContext();
  const menuDrawerWidth = 320;
  return (
    <Drawer
      sx={{
        width: isMobile ? "auto" : menuDrawerWidth,
        "& .MuiDrawer-paper": {
          width: isMobile ? "auto" : menuDrawerWidth,
          boxSizing: "border-box",
          p: 2,
          ...(isMobile && {
            height: "80vh",
            borderTopRightRadius: 8,
            borderTopLeftRadius: 8,
          }),
          ...(!isMobile && {
            top: 64,
            height: `calc(100% - 64px)`,
          }),
        },
      }}
      variant={isMobile ? "temporary" : "permanent"}
      anchor={isMobile ? "bottom" : "right"}
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
    >
      <Stack sx={{ height: "100%" }} spacing={2}>
        <Typography fontWeight={"fontWeightBold"}>
          日時： {currentDay}
        </Typography>
        <DailySummary
          dailyTransactions={dailyTransactions}
          columns={isMobile ? 3 : 2}
        />
        {/* 内訳タイトル&内訳追加ボタン */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 1,
          }}
        >
          {/* 左側のメモアイコンとテキスト */}
          <Box display="flex" alignItems="center">
            <NotesIcon sx={{ mr: 1 }} />
            <Typography variant="body1">内訳</Typography>
          </Box>
          {/* 右側の追加ボタン */}
          <Button
            startIcon={<AddCircleIcon />}
            color="primary"
            onClick={onAddTransactionFrom}
          >
            内訳を追加
          </Button>
        </Box>
        {/* 取引一覧 */}
        <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
          <List aria-label="取引履歴">
            <Stack spacing={2}>
              {dailyTransactions.map((transaction) => (
                <ListItem key={transaction.id} disablePadding>
                  <Card
                    sx={{
                      width: "100%",
                      backgroundColor:
                        transaction.type === "income"
                          ? (theme) => theme.palette.incomeColor.light
                          : (theme) => theme.palette.expenseColor.light,
                    }}
                    onClick={() => onSelectTransaction(transaction)}
                  >
                    <CardActionArea>
                      <CardContent>
                        <Grid
                          container
                          spacing={1}
                          alignItems="center"
                          wrap="wrap"
                        >
                          <Grid item xs={1}>
                            {/* icon */}
                            {IconComponents[transaction.category]}
                          </Grid>
                          <Grid item xs={2.5}>
                            <Typography
                              variant="caption"
                              display="block"
                              gutterBottom
                            >
                              {transaction.category}
                            </Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography variant="body2" gutterBottom>
                              {transaction.content}
                            </Typography>
                          </Grid>
                          <Grid item xs={4.5}>
                            <Typography
                              gutterBottom
                              textAlign={"right"}
                              color="text.secondary"
                              sx={{
                                wordBreak: "break-all",
                              }}
                            >
                              ¥{formatCurrency(transaction.amount)}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </ListItem>
              ))}
            </Stack>
          </List>
        </Box>
      </Stack>
    </Drawer>
  );
};
export default TransactionMenu;
