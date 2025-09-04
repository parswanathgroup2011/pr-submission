import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Typography, Paper, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  CircularProgress, Pagination, Chip
} from '@mui/material';
import PRSubmissionModal from '../../components/pr_submission/PRSubmissionModal';
import { getPRHistory, deletePressRelease } from '../../services/pressReleaseService';
import { handleSuccess, handleError } from '../../utils';

const getCustomColor = (status) => {
  switch (status) {
    case 'published':
      return { bg: '#C8E6C9', text: '#256029' }; // light green
    case 'pending':
      return { bg: 'rgba(27, 27, 27, 1)', color: 'rgba(255, 254, 254, 1)' }; // yellowish
    case 'draft':
      return { bg: '#ECEFF1', text: '#455A64' }; // light gray
    case 'rejected':
      return { bg: '#FFCDD2', text: '#C62828' }; // light red
    default:
      return { bg: '#E0E0E0', text: '#212121' }; // fallback
  }
};

const PostPressRelease = () => {
  const [prList, setPrList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingPR, setEditingPR] = useState(null);

  const fetchPRs = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await getPRHistory({ page, limit: 10 });
      setPrList(response.pressRelease || []);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      handleError("Failed to load press releases");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPRs(currentPage);
  }, [fetchPRs, currentPage]);

  const handleEditClick = (pr) => {
    setEditingPR(pr);
    setEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this PR?")) return;
    try {
      await deletePressRelease(id);
      handleSuccess("PR deleted successfully");
      fetchPRs(currentPage);
    } catch (err) {
      handleError(err.response?.data?.error || "Delete failed");
    }
  };

  const handleModalClose = () => {
    setEditModalOpen(false);
    setEditingPR(null);
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 4 } }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        Your Submitted Press Releases
      </Typography>

      <Paper elevation={3} sx={{ borderRadius: 3 }}>
        <Box p={2}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : prList.length > 0 ? (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5fa' }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>PR No</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Client</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Credits</TableCell>
                      
                      <TableCell sx={{ fontWeight: 'bold' }}>City</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {prList.map((pr, index) => (
                      <TableRow
                        key={pr._id}
                        sx={{
                          backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa',
                          '&:hover': {
                            backgroundColor: '#eef5ff',
                            transition: '0.3s',
                          }
                        }}
                      >
                        <TableCell>{pr.prId}</TableCell>
                        <TableCell>{pr.title}</TableCell>
                         <TableCell>{pr.userId?.clientName || 'N/A'}</TableCell>
                        <TableCell>{pr.selectedPlan?.credits || 'N/A'}</TableCell>
                        
                        <TableCell>{pr.city}</TableCell>
                        <TableCell>{new Date(pr.createdAt).toLocaleString()}</TableCell>
                        <TableCell>
                            <Chip
                                label={pr.status}
                                size="small"
                                sx={{
                                  textTransform: 'capitalize',
                                  backgroundColor: getCustomColor(pr.status).bg,
                                  color: getCustomColor(pr.status).text
                                  }}
                                />
                              </TableCell>
                        <TableCell>
                          {(pr.status === 'draft' || pr.status === 'pending') && (
                            <>
                              <Button
                                variant="outlined"
                                size="small"
                                color="primary"
                                onClick={() => handleEditClick(pr)}
                                sx={{
                                  mr: 1,
                                  borderRadius: 2,
                                  textTransform: 'none',
                                  fontSize: 12
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outlined"
                                size="small"
                                color="error"
                                onClick={() => handleDelete(pr._id)}
                                sx={{
                                  borderRadius: 2,
                                  textTransform: 'none',
                                  fontSize: 12
                                }}
                              >
                                Delete
                              </Button>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(e, val) => setCurrentPage(val)}
                  color="primary"
                />
              </Box>
            </>
          ) : (
            <Typography>No press releases found.</Typography>
          )}
        </Box>
      </Paper>

      {/* Edit Modal */}
      {editModalOpen && (
        <PRSubmissionModal
          isOpen={editModalOpen}
          onClose={handleModalClose}
          onPRSubmittedSuccessfully={() => {
            handleModalClose();
            fetchPRs(currentPage);
          }}
          editPressRelease={editingPR}
        />
      )}
    </Box>
  );
};

export default PostPressRelease;
