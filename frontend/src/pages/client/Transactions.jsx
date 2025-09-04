// src/pages/Transactions.jsx
import React, { useEffect, useState } from "react";
import { getWalletTransactions } from "../../services/walletApi"

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 20;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await getWalletTransactions();
        if (res.success) {
          setTransactions(res.transactions);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) return <p className="px-4">Loading...</p>;

  // Pagination calculations
  const totalPages = Math.ceil(transactions.length / transactionsPerPage);
  const startIndex = (currentPage - 1) * transactionsPerPage;
  const currentTransactions = transactions.slice(
    startIndex,
    startIndex + transactionsPerPage
  );

  return (
    <div className="px-4 py-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Transaction History</h2>

      {transactions.length === 0 ? (
        <p className="text-gray-500">No transactions found.</p>
      ) : (
        <>
          {/* Transactions List */}
          <div className="space-y-4">
            {currentTransactions.map((tx) => (
              <div
                key={tx._id}
                className="bg-white shadow-md rounded-xl p-4 flex justify-between items-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                {/* Left: Description + Date */}
                <div>
                  <p className="font-medium text-gray-900">{tx.description}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(tx.createdAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>

                {/* Right: Amount */}
                <div className="text-right">
                  <p
                    className={`text-lg font-bold ${
                      tx.type === "credit" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {tx.type === "credit" ? "+" : "-"}₹
                    {tx.amount.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{tx.type}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-6 gap-3">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Transactions;
