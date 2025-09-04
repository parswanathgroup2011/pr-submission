import React,{useEffect,useState} from 'react';
import {Box,Paper,Typography,TextField,Button,CircularProgress} from '@mui/material';
import {toast} from 'react-toastify';
import { getWalletBalance,rechargeWallet } from '../../services/walletApi';

export default function WalletBox() {
  const [balance,setBalance] = useState(null);
  const [loading,setLoading] = useState(true);
  const [amount,setAmount] = useState('');
  const [busy,setBusy] = useState(false);


  const fetchBalance = async () => {
    setLoading(true);
    try{
      const res = await getWalletBalance();
      setBalance(res.balance ?? 0)
    }catch(err){
      console.log(err);
      toast.error("Failed to load Wallet Balance")
    }finally{
      setLoading(false)
    }
  };

  useEffect (() => {fetchBalance();},[]);

  const handleRecharge = async () => {
    const num = parseFloat(amount);
    if(isNaN(num) || num <= 0){
      toast.warn('Enter a valid amount (> 0)');
      return;
    }
    setBusy(true);
    try{
      const res = await rechargeWallet(num);
      setBalance(res.balance ?? balance);
      setAmount('');
      toast.success("Wallet Recharged");

    }catch(err){
      console.error(err);
      toast.error(err ?.response?.data?.message || 'Recharge failed');
    }finally {
      setBusy(false)
    }
  };



 return (
    <Paper
      sx={{
        p: 3,
        mb: 4,
        maxWidth: 520,
        mx: 'auto',
        backgroundColor: '#f9fafb',
        border: '1px solid #e0e0e0',
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      }}
    >
      {/* Title */}
      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontWeight: 600, color: '#333' }}
      >
        Wallet
      </Typography>

      {/* Balance section */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, color: '#1976d2' }}
        >
          {loading ? <CircularProgress size={22} /> : `₹${(balance ?? 0).toFixed(2)}`}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary', fontStyle: 'italic' }}
        >
          Available Balance
        </Typography>
      </Box>

      {/* Input + Button */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Enter Amount"
          type="number"
          inputProps={{ min: 0, step: '0.01' }}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={busy}
        />
        <Button
          variant="contained"
          onClick={handleRecharge}
          disabled={busy}
          sx={{ minWidth: 150, fontWeight: 600,fontSize:'0.7rem' }}
        >
          {busy ? <CircularProgress size={50} color="inherit" /> : 'Recharge Now'}
        </Button>
      </Box>
    </Paper>
  );
}