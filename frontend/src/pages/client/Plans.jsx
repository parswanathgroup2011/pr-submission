import React, { useEffect, useState } from "react";
import { getAllPlans } from "../../services/planService";
import PageHeader from "../../components/ui/PageHeader";
import SearchInput from "../../components/ui/SearchInput";
import FilterBar from "../../components/ui/FilterBar";
import DataTable from "../../components/ui/DataTable";
import AppPagination from "../../components/ui/AppPagination";
import StatusBadge from "../../components/ui/StatusBadge";
import { Box } from "@mui/material";

const PlanMaster = () => {
  const [plans, setPlans] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getAllPlans();
        setPlans(data);
      } catch (error) {
        console.error("Failed to load plans:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const filteredPlans = plans.filter(
    (plan) =>
      plan.name?.toLowerCase().includes(search.toLowerCase()) ||
      plan.description?.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredPlans.length / itemsPerPage) || 1;
  const paginatedPlans = filteredPlans.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns = [
    {
      id: "sr",
      label: "Plan ID",
      render: (_row, index) => (currentPage - 1) * itemsPerPage + index + 1,
    },
    { id: "name", label: "Name" },
    { id: "description", label: "Description" },
    {
      id: "credits",
      label: "Credits",
      render: (row) => `₹${Number(row.credits || 0).toLocaleString()}`,
    },
    { id: "tat", label: "TAT" },
    { id: "disclaimer", label: "Disclaimer" },
    { id: "backlink", label: "Backlink" },
    {
      id: "language",
      label: "Languages",
      render: (row) => row.language?.join(", ") || "—",
    },
    { id: "websiteCountText", label: "Website count" },
    {
      id: "type",
      label: "Type",
      render: (row) => <StatusBadge status={row.type} />,
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Plans"
        description="Available press release distribution plans."
        showBack
        backTo="/home"
        toolbar={
          <FilterBar>
            <SearchInput
              value={search}
              onChange={(value) => {
                setSearch(value);
                setCurrentPage(1);
              }}
              placeholder="Search plans by name or description"
            />
          </FilterBar>
        }
      />
      <DataTable columns={columns} rows={paginatedPlans} loading={loading} emptyTitle="No plans found" />
      <AppPagination
        page={currentPage}
        totalPages={totalPages}
        totalCount={filteredPlans.length}
        pageSize={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </Box>
  );
};

export default PlanMaster;
