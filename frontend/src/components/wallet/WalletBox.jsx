import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Divider,
  Stack,
} from "@mui/material";
import { toast } from "react-toastify";
import { getWalletBalance } from "../../services/walletApi";
import { manualTopupRequest } from "../../services/manualTopupApi";
import AppDialog from "../ui/AppDialog";

export default function WalletBox() {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);
  const [openManual, setOpenManual] = useState(false);
  const [screenshot, setScreenshot] = useState(null);
  const [preview, setPreview] = useState(null);

  const GST_PERCENT = 18;

  const calculateGST = (amt) => {
    if (!amt || amt <= 0) return 0;
    return Math.round(Number(amt) + (Number(amt) * GST_PERCENT) / 100);
  };

  const fetchBalance = async () => {
    setLoading(true);
    try {
      const res = await getWalletBalance();
      setBalance(res.balance ?? 0);
    } catch (err) {
      toast.error("Failed to load wallet balance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const submitManualPayment = async () => {
    if (!amount || amount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (!screenshot) {
      toast.error("Please upload a screenshot");
      return;
    }

    const finalAmount = calculateGST(amount);
    const formData = new FormData();
    formData.append("amount", finalAmount);
    formData.append("screenshot", screenshot);

    try {
      setBusy(true);
      await manualTopupRequest(formData);
      toast.success(
        `Manual payment submitted successfully. You paid ₹${finalAmount}. Credits will be added once admin approves.`
      );
      setScreenshot(null);
      setPreview(null);
      setAmount("");
      setOpenManual(false);
    } catch (err) {
      toast.error("Failed to submit manual payment");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Paper elevation={1} sx={{ p: 3, borderRadius: "12px", maxWidth: 520 }}>
        <Typography variant="body2" color="text.secondary">
          Wallet balance
        </Typography>
        <Typography variant="h4" sx={{ mt: 0.5, mb: 2 }}>
          {loading ? <CircularProgress size={22} /> : `₹${(balance ?? 0).toFixed(2)}`}
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
          <TextField
            placeholder="Enter amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Button variant="contained" onClick={() => setOpenManual(true)} disabled={busy} sx={{ minWidth: 120 }}>
            Recharge
          </Button>
        </Stack>
      </Paper>

      <AppDialog
        open={openManual}
        onClose={() => setOpenManual(false)}
        title="Top up credits"
        maxWidth="md"
        actions={
          <>
            <Button variant="outlined" onClick={() => setOpenManual(false)}>
              Cancel
            </Button>
            <Button variant="contained" onClick={submitManualPayment} disabled={busy}>
              {busy ? <CircularProgress size={20} /> : "Submit payment"}
            </Button>
          </>
        }
      >
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Manual payments are processed 10AM–7PM. Razorpay payments reflect instantly.
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 1 }}>
          <TextField
            label="Amount to add"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <TextField label="Incl. GST" value={`₹ ${calculateGST(amount)}`} InputProps={{ readOnly: true }} />
        </Stack>
        <Typography variant="subtitle2" color="primary" sx={{ mb: 2 }}>
          Total payable: ₹{calculateGST(amount)}
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
          {[100, 200, 500, 1000, 5000].map((v) => (
            <Button key={v} variant="outlined" size="small" onClick={() => setAmount(Number(amount || 0) + v)}>
              + ₹{v}
            </Button>
          ))}
        </Stack>
        <Divider sx={{ my: 2 }} />
        <Button variant="outlined" component="label" fullWidth>
          Upload screenshot
          <input
            hidden
            type="file"
            onChange={(e) => {
              setScreenshot(e.target.files[0]);
              setPreview(URL.createObjectURL(e.target.files[0]));
            }}
          />
        </Button>
        {preview && (
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Box component="img" src={preview} alt="preview" sx={{ width: 180, borderRadius: 1, border: "1px solid", borderColor: "divider" }} />
          </Box>
        )}
        <Divider sx={{ my: 3 }} />
        <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
          <Box sx={{ flex: 1, p: 2, border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
            <Typography sx={{ fontWeight: 600, mb: 1 }}>Account details</Typography>
            <Typography variant="body2">Legal Name: Parswanath Event Management</Typography>
            <Typography variant="body2">Bank: SBI</Typography>
            <Typography variant="body2">Type: Current</Typography>
            <Typography variant="body2">A/C No: 36547026226</Typography>
            <Typography variant="body2">IFSC: SBIN0002661</Typography>
          </Box>
          <Box sx={{ flex: 1, textAlign: "center" }}>
            <Box component="img" src="/manualpayment-qr.jpeg" alt="Scan and pay" sx={{ width: 210, borderRadius: 1 }} />
            <Typography variant="body2" sx={{ mt: 1 }}>
              Scan & pay
            </Typography>
          </Box>
        </Stack>
      </AppDialog>
    </>
  );
}
