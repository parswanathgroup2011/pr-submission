// src/pages/UserMaster.jsx
import React, { useEffect, useState } from "react";
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
  CircularProgress,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { getAllUsers } from "../../services/adminApi"; // adjust service path

const UserMaster = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data?.users || []);
      } catch (error) {
        console.error("Failed to load users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.clientName?.toLowerCase().includes(search.toLowerCase()) ||
      user.companyName?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase()) ||
      user.mobileNumber?.toLowerCase().includes(search.toLowerCase())
  );
  const getImageUrl = (filePath) => {
  if (!filePath) return "";
  const baseUrl = import.meta.env.VITE_API_URL.replace("/api", ""); 
  return `${baseUrl}/${filePath}`;
};


  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
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
        sx={{ fontWeight: 600, color: "#1976d2", fontSize: "1.1rem" }}
      >
        List Of All Users
      </Typography>

 {/* Search */}
<Box className="flex justify-start mb-6 mt-2">
  <div className="flex items-center border border-gray-300 rounded px-3 py-2 bg-white w-80">
    <SearchIcon color="action" className="mr-2" />
    <input
      type="text"
      placeholder="Search users by name, email, company"
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
      }}
      className="flex-1 outline-none"
    />
  </div>
</Box>


      {/* Table */}
      <TableContainer
        component={Paper}
        className="shadow-2xl rounded-xl border border-gray-200 hover:shadow-indigo-300 transition-shadow duration-300 overflow-x-auto"
      >
        <Table stickyHeader>
          <TableHead>
  <TableRow className="bg-indigo-100">
    {[
      "Sr No",
      "Client Name",
      "Client Type",
      "Company",
      "Email",
      "Mobile",
      "State",
      "City",
      "Pincode",
      "Website",
      "Profile Image",
      "Business Logo",
      "GST No",
      "GST Image",
      "PAN No",
      "PAN Image",
      "IFSC",
      "Bank",
      "Branch",
      "MICR",
      "Branch Code",
      "Authorised Name",
      "Account No",
      "Created At",
      "Updated At",
    ].map((header, index) => (
      <TableCell
        key={index}
        sx={{
          fontWeight: 700,
          fontFamily: "Roboto, sans-serif",
          fontSize: 14,
          letterSpacing: "0.5px",
          color: "#1e293b",
          backgroundColor: "#e0e7ff", // light indigo
        }}
      >
        {header}
      </TableCell>
    ))}
  </TableRow>
</TableHead>

          <TableBody>
            {paginatedUsers.map((user, index) => (
              <TableRow
                key={user._id}
                className="hover:bg-indigo-50 cursor-pointer"
              >
                <TableCell>
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </TableCell>
                <TableCell>{user.clientName}</TableCell>
                <TableCell>{user.clientType}</TableCell>
                <TableCell>{user.companyName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.mobileNumber}</TableCell>
                <TableCell>{user.state}</TableCell>
                <TableCell>{user.city}</TableCell>
                <TableCell>{user.pincode}</TableCell>
                <TableCell>
                  {user.website ? (
                    <a
                      href={user.website.startsWith("http") ? user.website : `https://${user.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "blue", textDecoration: "underline" }}
                    >
                      {user.website}
                    </a>
                  ) : (
                    "-"
                  )}
                </TableCell>

                <TableCell>
                  {user.profileImage && (
                   <img
  src={getImageUrl(user.profileImage)}
  alt="Profile"
  style={{ width: 50, height: 50, objectFit: "cover", borderRadius: "8px" }}
/>

                  )}
                </TableCell>
                  <TableCell>
                  {user.businessLogo && (
                   <img
  src={getImageUrl(user.businessLogo)}
  alt="Logo"
  style={{ width: 50, height: 50, objectFit: "contain", borderRadius: "8px" }}
/>

                  )}
                </TableCell>
                <TableCell>{user.gstNumber}</TableCell>
                <TableCell>
                  {user.gstImage && (
                    <img
  src={getImageUrl(user.gstImage)}
  alt="GST"
  style={{ width: 50, height: 50, objectFit: "contain" }}
/>

                  )}
                </TableCell>
                <TableCell>{user.panNumber}</TableCell>
                <TableCell>
                  {user.panImage && (
                    <img
  src={getImageUrl(user.panImage)}
  alt="PAN"
  style={{ width: 50, height: 50, objectFit: "contain" }}
/>

                  )}
                </TableCell>
                <TableCell>{user.ifscCode}</TableCell>
                <TableCell>{user.bankName}</TableCell>
                <TableCell>{user.branchName}</TableCell>
                <TableCell>{user.micrCode}</TableCell>
                <TableCell>{user.branchCode}</TableCell>
                <TableCell>{user.authorisedName}</TableCell>
                <TableCell>{user.accountNumber}</TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(user.updatedAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box className="flex justify-center mt-6 flex-wrap gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <Button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              variant={currentPage === pageNum ? "contained" : "outlined"}
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

export default UserMaster;
