import React, { useState, useEffect, useCallback } from "react";
import { ToastContainer } from "react-toastify";
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Pagination from '@mui/material/Pagination';
import PRSubmissionModal from '../../components/pr_submission/PRSubmissionModal';
import { getPRStats, getPRHistory } from '../../services/pressReleaseService';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  
} from '@mui/material';
import WalletBox from '../../components/wallet/WalletBox'


const StatCard = ({ title, value, loading }) => {
  return (
    <Paper
      sx={{
        p: 2,
        textAlign: "center",
        height: '90%',
        marginLeft:'6px',
        cursor: 'pointer',
        backgroundColor: 'white',
        transition: '0.7s',
        '&:hover': {
          backgroundColor: 'rgba(23, 16, 83, 0.97)',
          '& .stat-title': {
            color: 'white',
          },
          '& .stat-value': {
            color: 'white',
          }
        },
      }}
    >
      <Typography
        variant="h6"
        className="stat-title"
        fontSize={18}
        sx={{
          color: 'text.secondary',
          transition: '0.3s',
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="h4"
        className="stat-value"
        sx={{
          fontWeight: 'bold',
          mt: 1,
          color: 'text.primary',
          transition: '0.3s',
          fontSize:'22px'
        }}
      >
        {loading ? (
          <CircularProgress size={24} />
        ) : (
          value !== undefined && value !== null ? value : '-'
        )}
      </Typography>
    </Paper>
  );
};

function Home() {
  const [isPRModelOpen, setIsPRModelOpen] = useState(false);
  const [editingPR, setEditingPR] = useState(null); // to hold PR being edited

  const [dashboardStats, setDashboardStats] = useState({
    totalPR: 0, pendingPR: 0, publishedPR: 0, rejectPR: 0,
  });
  const [prHistory, setPrHistory] = useState([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [fetchError, setFetchError] = useState(null);

const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);


  const fetchData = useCallback(async (page=1) => {
    setIsLoadingStats(true);
    setIsLoadingHistory(true);
    setFetchError(null);

    try {
      const [statsData, historyResponse] = await Promise.all([
        getPRStats(),
        getPRHistory({ limit: 10, page })
      ]);

      setDashboardStats(statsData || {
        totalPR: 0, pendingPR: 0, publishedPR: 0, rejectPR: 0
      });
      setPrHistory(historyResponse.pressRelease || []);
      setTotalPages(historyResponse.totalPages || 1);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setFetchError("Could not load dashboard data. Please try again later.");
    } finally {
      setIsLoadingStats(false);
      setIsLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    fetchData(currentPage);
  }, [fetchData,currentPage]);

  const handleOpenPRModal = () => {
    setIsPRModelOpen(true);
  };

  

  const handleClosePRModel = () => {
    setIsPRModelOpen(false);
  };

  const handlePRSubmittedSuccessfully = () => {
    handleClosePRModel();
    fetchData();
  };

  return (
    <Box sx={{ p: 1 }}>
   

      {fetchError && (
        <Typography color="error" sx={{ mb: 2 ,mt: 1}}>
          {fetchError}
        </Typography>
      )}

      <Grid container spacing={5} sx={{ mb: 7, mt:3 }}>
        <Grid size={{xs:12,sm:6,md:3}} >
          <StatCard  title="Total PR"  value={dashboardStats.totalPR } loading={isLoadingStats} />
        </Grid>
        <Grid size={{xs:12,sm:6,md:3}}>
          <StatCard title="Pending PR"  value={dashboardStats.pendingPR} loading={isLoadingStats}  bgcolor="red" />
        </Grid>
        <Grid size={{xs:12,sm:6,md:3}} >
          <StatCard title="Published PR" value={dashboardStats.publishedPR} loading={isLoadingStats} />
        </Grid>
        <Grid size={{xs:12,sm:6,md:3}} >
          <StatCard title="Reject PR" value={dashboardStats.rejectPR} loading={isLoadingStats} />
        </Grid>
      </Grid>

      {/* Wallet box — center it or place in Grid as you like */}
<Box sx={{ mb: 3 }}>
  <WalletBox />
</Box>


      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, mt:4 }}>
        <Typography variant="h6" sx={{backgroundColor:'rgb(89, 77, 196)',color:'white',borderRadius:50,px:3,py:0.5,marginLeft:'10px', fontSize:'15px'}}>Last 10 PR</Typography>
        <Button 
          variant="contained"
          color="primary"
          startIcon={<AddIcon sx={{color:'white'}}/>}
          onClick={handleOpenPRModal}
          sx={{color:"white",borderRadius:50,fontSize:12,width:150, backgroundColor: 'primary.main',
            '&:hover': {
              backgroundColor: 'rgb(21, 34, 75)', // or any custom color
            },}}
          
        >
          Add PR
        </Button>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: 3 }}>
  <Box p={2}>
    {isLoadingHistory ? (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    ) : prHistory.length > 0 ? (
      <>
        <TableContainer>
          <Table sx={{ minWidth: 750 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f0f0ff' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>PR No</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Plan</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Client</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Credit Used</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>City</TableCell>
            
                <TableCell sx={{ fontWeight: 'bold' }}>Date Time</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {prHistory.map((pr, index) => (
                <TableRow
                  key={pr._id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9',
                    '&:hover': {
                      backgroundColor: '#e8f0fe',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s ease',
                    },
                  }}
                >
                  <TableCell>{pr.prId || 0}</TableCell>
                  <TableCell>{pr.title || 'N/A'}</TableCell>
                  <TableCell>{pr.selectedPlan?.name || 'N/A'}</TableCell>
                  <TableCell>{pr.userId?.clientName || 'N/A'}</TableCell>
                  <TableCell>{pr.selectedPlan?.credits || 'N/A'}</TableCell>
                  <TableCell>{pr.city || 'N/A'}</TableCell>
                  
                  <TableCell>
                    {pr.createdAt ? new Date(pr.createdAt).toLocaleString() : '—'}
                  </TableCell>
                  <TableCell>{pr.status || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* ✅ Pagination */}
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(event, value) => setCurrentPage(value)}
            color="primary"
          />
        </Box>
      </>
    ) : (
      <Typography>No PR history available.</Typography>
    )}
  </Box>
</Paper>



      {isPRModelOpen && (
        <PRSubmissionModal
          isOpen={isPRModelOpen}
          onClose={handleClosePRModel}
          onPRSubmittedSuccessfully={handlePRSubmittedSuccessfully}
        />
      )}

      <ToastContainer />
    </Box>
  );
}

export default Home;
