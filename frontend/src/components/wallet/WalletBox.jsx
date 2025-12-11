import React, { useEffect, useState } from 'react';
import {
  Box, Paper, Typography, TextField, Button, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, Divider
} from '@mui/material';

import { toast } from 'react-toastify';
import { getWalletBalance } from '../../services/walletApi';
import { manualTopupRequest } from '../../services/manualTopupApi';

export default function WalletBox() {

  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
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

  useEffect(() => { fetchBalance(); }, []);

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
  formData.append("amount", finalAmount); // 🔥 SEND GST AMOUNT
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

      {/* Wallet Card */}
    {/* Wallet Card */}
<Paper
  sx={{
    p: 3,
    mb: 4,
    maxWidth: 520,
    mx: 'auto',
    borderRadius: 3,
    background: '#ffffff',
    border: '1px solid #dce3f0',
    boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
  }}
>
  <Typography
    variant="h6"
    sx={{
      fontWeight: 600,
      mb: 1,
      color: '#1e3a8a', // deep blue
      letterSpacing: "0.2px"
    }}
  >
    Wallet Balance
  </Typography>

  {/* Colored Balance Card */}
  <Box
    sx={{
      background: 'linear-gradient(135deg, #3b82f6, #2563eb)', // soft blue gradient
      borderRadius: 2,
      p: 2.5,
      mb: 3,
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}
  >
    <Typography variant="h4" sx={{ fontWeight: 700 }}>
      {loading ? <CircularProgress size={22} color="inherit" /> : `₹${(balance ?? 0).toFixed(2)}`}
    </Typography>
    <Typography sx={{ opacity: 0.9 }}>Available</Typography>
  </Box>

  {/* Input + Recharge Button */}
  <Box sx={{ display: 'flex', gap: 1 }}>
    <TextField
      fullWidth
      size="small"
      placeholder="Enter Amount"
      type="number"
      value={amount}
      onChange={(e) => setAmount(e.target.value)}
      sx={{
        background: '#f1f5f9',
        borderRadius: '8px',
        '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: '#3b82f6'
        },
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: '#2563eb'
        }
      }}
    />

    <Button
      variant="contained"
      onClick={() => setOpenManual(true)}
      disabled={busy}
      sx={{
        textTransform: 'none',
        fontWeight: 600,
        background: '#2563eb',
        borderRadius: '8px',
        px: 2,
        '&:hover': { background: '#1e40af' }
      }}
    >
      Recharge
    </Button>
  </Box>
</Paper>

      {/* Modal */}
      <Dialog open={openManual} onClose={() => setOpenManual(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Top Up Credits</DialogTitle>

        <DialogContent dividers>

          {/* Info Box */}
          <Box
            sx={{
              background: '#fff8e6',
              border: '1px solid #ffe7b3',
              p: 1.5,
              borderRadius: 1,
              mb: 3
            }}
          >
            <Typography sx={{ fontSize: 14, color: '#8a5a00' }}>
              Manual payments are processed 10AM–7PM. Razorpay payments reflect instantly.
            </Typography>
          </Box>

          {/* Amount Fields */}
          <Typography sx={{ fontWeight: 600, mb: 1 }}>Amount to add:</Typography>

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              size="small"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <TextField
              size="small"
              label="Incl. GST"
              value={`₹ ${calculateGST(amount)}`}
              InputProps={{ readOnly: true }}
              sx={{ width: 180 }}
            />
          </Box>
          {/* ⭐ Total Payable Line (ADD THIS BELOW GST FIELD) */}
          <Typography sx={{ mt: -1, mb: 2, fontWeight: 600, color: "#1e40af" }}>
            Total Payable: ₹{calculateGST(amount)}
          </Typography>

          {/* Quick Buttons */}
          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
            {[100, 200, 500, 1000, 5000].map((v) => (
              <Button
                key={v}
                variant="outlined"
                size="small"
                onClick={() => setAmount(Number(amount || 0) + v)}
                sx={{ textTransform: 'none' }}
              >
                + ₹{v}
              </Button>
            ))}
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Upload Screenshot */}
          <Typography sx={{ fontWeight: 600, mb: 1 }}>Payment Screenshot</Typography>
          <Button
            variant="outlined"
            component="label"
            fullWidth
            size="medium"
            sx={{ textTransform: 'none' }}
          >
            Upload Screenshot
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
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <img
                src={preview}
                alt="preview"
                style={{ width: 180, borderRadius: 8, border: '1px solid #ddd' }}
              />
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Bank & QR */}
          <Box sx={{ display: 'flex', gap: 3 }}>

            {/* Bank Details */}
            <Box sx={{ width: '50%', p: 2, borderRadius: 2, border: '1px solid #e5e7eb' }}>
              <Typography sx={{ fontWeight: 600, mb: 1 }}>Account Details</Typography>
              <Typography>Legal Name: Parswanath Event Management</Typography>
              <Typography>Bank: SBI</Typography>
              <Typography>Type: Current</Typography>
              <Typography>A/C No: 36547026226</Typography>
              <Typography>IFSC: SBIN0002661</Typography>
            </Box>

            {/* QR */}
            <Box sx={{ width: '50%', textAlign: 'center' }}>
              <img
                src="/manualpayment-qr.jpeg"
                style={{ width: 210, borderRadius: 8 ,marginLeft:80}}
              />
              <Typography sx={{ mt: 1 }}>Scan & Pay</Typography>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setOpenManual(false)}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={submitManualPayment}
            disabled={busy}
            sx={{ textTransform: 'none' }}
          >
            {busy ? <CircularProgress size={20} /> : "Submit Payment"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
