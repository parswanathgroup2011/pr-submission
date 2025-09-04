// src/pages/PlanMaster.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  TextField,
  IconButton,
  CircularProgress,
  Tooltip,
  Button,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { getAllPlans } from '../../services/planService';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';


const PlanMaster = () => {
  const [plans, setPlans] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getAllPlans();
        setPlans(data);
      } catch (error) {
        console.error('Failed to load plans:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const filteredPlans = plans.filter((plan) =>
    plan.name?.toLowerCase().includes(search.toLowerCase()) ||
    plan.description?.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredPlans.length / itemsPerPage);
  const paginatedPlans = filteredPlans.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-screen bg-gray-50">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
      

<Typography 
  variant="h6" 
  sx={{ 
    fontWeight: 600, 
    color: '#1976d2',
    fontSize: '1.1rem'
  }}
>
  Plan For PressRelease
</Typography>
     
     <Box className="flex justify-end mb-6">
    <Box className="bg-white p-3 rounded-lg sm:w-1/3">
      <div className="flex items-center border border-gray-300 rounded px-3 py-2 focus-within:border-gray-300">
        <SearchIcon color="action" className="mr-2" />
        <input
          type="text"
          placeholder="Search plans by name or description"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="flex-1 outline-none focus:outline-none focus:ring-0"
          style={{ boxShadow: 'none' }}
        />
      </div>
    </Box>
  </Box>



      <TableContainer
        component={Paper}
        className="shadow-2xl rounded-xl border border-gray-200 hover:shadow-indigo-300 transition-shadow duration-300"
      >
        <Table>
          <TableHead>
            <TableRow className="bg-indigo-100">
              <TableCell className="font-semibold text-gray-700">Plan ID</TableCell>
              <TableCell className="font-semibold text-gray-700">Name</TableCell>
              <TableCell className="font-semibold text-gray-700">Description</TableCell>
              <TableCell className="font-semibold text-gray-700">Credits</TableCell>
              <TableCell className="font-semibold text-gray-700">TAT</TableCell>
              <TableCell className="font-semibold text-gray-700">Disclaimer</TableCell>
              <TableCell className="font-semibold text-gray-700">Backlink</TableCell>
              <TableCell className="font-semibold text-gray-700">Languages</TableCell>
              <TableCell className="font-semibold text-gray-700">Website Count</TableCell>
              <TableCell className="font-semibold text-gray-700">Type</TableCell>
              {/* <TableCell className="font-semibold text-gray-700">Action</TableCell> */}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedPlans.map((plan, index) => (
              <TableRow
              key={plan._id || index}
              className="hover:bg-indigo-50 cursor-pointer transition-all duration-200 ease-in-out"
            >
            
                <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                <TableCell>{plan.name}</TableCell>
                <TableCell>{plan.description}</TableCell>
                <TableCell className="text-green-600 font-medium">
                  ₹{Number(plan.credits).toLocaleString()}
                </TableCell>
                <TableCell>{plan.tat}</TableCell>
                <TableCell>{plan.disclaimer}</TableCell>
                <TableCell>{plan.backlink}</TableCell>
                <TableCell>
                  <span className="text-sm text-gray-700">
                    {plan.language?.join(', ')}
                  </span>
                </TableCell>
                <TableCell>{plan.websiteCountText}</TableCell>
                <TableCell>
                  <span className="capitalize bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    {plan.type}
                  </span>
                </TableCell>
                {/* <TableCell>
                  <Tooltip title="More Info">
                    <IconButton size="small" color="primary">
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Box className="flex justify-center mt-6 flex-wrap gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <Button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              variant={currentPage === pageNum ? 'contained' : 'outlined'}
              color="primary"
              size="small"
            >
              {pageNum}
            </Button>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default PlanMaster;
