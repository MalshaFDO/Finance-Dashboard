import "./TransactionTable.css";
import { Fragment, useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import type { Transaction } from "../../types/transactions";

type SortOption = "date-desc" | "date-asc" | "amount-desc" | "amount-asc";
type GroupOption = "none" | "date" | "category" | "type";

const TransactionTable = () => {
  const { transactions, role, addTransaction, updateTransaction, deleteTransaction, formatCurrency } =
    useAppContext();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");
  const [groupBy, setGroupBy] = useState<GroupOption>("none");
  const [formState, setFormState] = useState({
    category: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    type: "income" as "income" | "expense",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingState, setEditingState] = useState<Transaction | null>(null);
  const [statusMessage, setStatusMessage] = useState("");

  const hasInvalidDateRange = Boolean(dateFrom && dateTo && dateFrom > dateTo);

  const activeFilterCount = [
    filter !== "all",
    categoryFilter !== "all",
    Boolean(dateFrom),
    Boolean(dateTo),
    sortBy !== "date-desc",
    groupBy !== "none",
  ].filter(Boolean).length;

  const filteredTransactions = [...transactions]
    .filter((transaction) => {
      const searchValue = search.toLowerCase();
      const matchesSearch = [
        transaction.category,
        transaction.type,
        transaction.date,
        String(transaction.amount),
      ]
        .join(" ")
        .toLowerCase()
        .includes(searchValue);
      const matchesFilter = filter === "all" ? true : transaction.type === filter;
      const matchesCategory =
        categoryFilter === "all" ? true : transaction.category === categoryFilter;
      const matchesDateFrom = !dateFrom || transaction.date >= dateFrom;
      const matchesDateTo = !dateTo || transaction.date <= dateTo;

      return (
        !hasInvalidDateRange &&
        matchesSearch &&
        matchesFilter &&
        matchesCategory &&
        matchesDateFrom &&
        matchesDateTo
      );
    })
    .sort((a, b) => {
      if (sortBy === "date-asc") return a.date.localeCompare(b.date);
      if (sortBy === "date-desc") return b.date.localeCompare(a.date);
      if (sortBy === "amount-asc") return a.amount - b.amount;
      return b.amount - a.amount;
    });

  const categories = Array.from(
    new Set(transactions.map((transaction) => transaction.category))
  ).sort();

  const groupedTransactions =
    groupBy === "none"
      ? [{ label: "All transactions", entries: filteredTransactions }]
      : Object.entries(
          filteredTransactions.reduce<Record<string, Transaction[]>>((groups, transaction) => {
            const groupLabel =
              groupBy === "date"
                ? transaction.date
                : groupBy === "category"
                  ? transaction.category
                  : transaction.type;

            groups[groupLabel] = [...(groups[groupLabel] ?? []), transaction];
            return groups;
          }, {})
        ).map(([label, entries]) => ({ label, entries }));

  const visibleIncome = filteredTransactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const visibleExpense = filteredTransactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const parsedAmount = Number(formState.amount);
  const addCategoryError =
    formState.category.trim().length === 0 ? "Category is required." : "";
  const addAmountError =
    formState.amount.length === 0
      ? "Amount is required."
      : parsedAmount <= 0
        ? "Amount must be greater than 0."
        : "";
  const addDateError = formState.date ? "" : "Date is required.";
  const isAddDisabled = Boolean(addCategoryError || addAmountError || addDateError);
  const editAmountError =
    editingState && editingState.amount <= 0 ? "Amount must be greater than 0." : "";
  const editCategoryError =
    editingState && editingState.category.trim().length === 0
      ? "Category is required."
      : "";
  const isSaveDisabled = Boolean(editAmountError || editCategoryError);

  useEffect(() => {
    if (!statusMessage) return;

    const timeoutId = window.setTimeout(() => setStatusMessage(""), 2400);

    return () => window.clearTimeout(timeoutId);
  }, [statusMessage]);

  const resetForm = () => {
    setFormState({
      category: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      type: "income",
    });
  };

  const handleAdd = () => {
    if (isAddDisabled) return;

    addTransaction({
      id: Date.now().toString(),
      date: formState.date,
      category: formState.category.trim(),
      amount: parsedAmount,
      type: formState.type,
    });

    resetForm();
    setStatusMessage("Transaction added successfully.");
  };

  const startEditing = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEditingState(transaction);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingState(null);
  };

  const saveEditing = () => {
    if (!editingState || isSaveDisabled) return;

    updateTransaction({
      ...editingState,
      category: editingState.category.trim(),
    });
    cancelEditing();
    setStatusMessage("Transaction updated successfully.");
  };

  const handleDelete = (transactionId: string) => {
    const transaction = transactions.find((entry) => entry.id === transactionId);

    const shouldDelete = window.confirm(
      `Delete ${transaction?.category ?? "this transaction"}? This change is saved in local browser storage.`
    );

    if (!shouldDelete) return;

    if (editingId === transactionId) {
      cancelEditing();
    }

    deleteTransaction(transactionId);
    setStatusMessage("Transaction deleted successfully.");
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = filename;
    anchor.click();

    window.URL.revokeObjectURL(url);
  };

  const exportTransactions = (format: "csv" | "json") => {
    if (filteredTransactions.length === 0) {
      setStatusMessage("No transactions match the current filters to export.");
      return;
    }

    if (format === "json") {
      downloadFile(
        JSON.stringify(filteredTransactions, null, 2),
        "transactions-export.json",
        "application/json"
      );
      setStatusMessage("Filtered transactions exported as JSON.");
      return;
    }

    const csvRows = [
      ["id", "date", "category", "type", "amount"].join(","),
      ...filteredTransactions.map((transaction) =>
        [
          transaction.id,
          transaction.date,
          `"${transaction.category.replaceAll('"', '""')}"`,
          transaction.type,
          transaction.amount,
        ].join(",")
      ),
    ];

    downloadFile(csvRows.join("\n"), "transactions-export.csv", "text/csv;charset=utf-8");
    setStatusMessage("Filtered transactions exported as CSV.");
  };

  return (
    <section className="table-container scroll-anchor" id="transactions">
      <div className="section-heading">
        <div>
          <h3>Transactions</h3>
          <p>
            Search, filter, group, and export the latest activity. Admins can add,
            edit, and delete rows.
          </p>
        </div>
        <div className={`role-badge ${role}`}>
          {role === "admin" ? "Admin can add, edit, and delete" : "Viewer is read-only"}
        </div>
      </div>

      {role === "admin" && (
        <>
          <div className="add-form">
            <div className="field-group">
              <input
                type="text"
                placeholder="Category"
                list="transaction-categories"
                value={formState.category}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, category: event.target.value }))
                }
              />
              {addCategoryError && <span className="field-error">{addCategoryError}</span>}
            </div>

            <div className="field-group">
              <input
                type="number"
                placeholder="Amount"
                min="0"
                value={formState.amount}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, amount: event.target.value }))
                }
              />
              {addAmountError && <span className="field-error">{addAmountError}</span>}
            </div>

            <div className="field-group">
              <input
                type="date"
                value={formState.date}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, date: event.target.value }))
                }
              />
              {addDateError && <span className="field-error">{addDateError}</span>}
            </div>

            <div className="field-group">
              <select
                value={formState.type}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    type: event.target.value as "income" | "expense",
                  }))
                }
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <button type="button" onClick={handleAdd} disabled={isAddDisabled}>
              Add transaction
            </button>
          </div>

          {(addCategoryError || addAmountError || addDateError) && (
            <p className="validation-hint">Fill in all required fields before adding.</p>
          )}
        </>
      )}

      <datalist id="transaction-categories">
        {categories.map((category) => (
          <option key={category} value={category} />
        ))}
      </datalist>

      <div className="controls">
        <div className="controls-bar">
          <input
            type="text"
            placeholder="Search category, date, type, or amount..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="control control-search"
          />

          <button
            type="button"
            className="ghost-button filters-toggle"
            aria-label={filtersOpen ? "Hide filters" : "Show filters"}
            aria-expanded={filtersOpen}
            aria-controls="transactions-filters"
            onClick={() => setFiltersOpen((current) => !current)}
          >
            <svg
              className="filters-toggle-icon"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M3 5a1 1 0 0 1 1-1h16a1 1 0 1 1 0 2H4A1 1 0 0 1 3 5Zm4 7a1 1 0 0 1 1-1h8a1 1 0 1 1 0 2H8a1 1 0 0 1-1-1Zm3 7a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2h-2a1 1 0 0 1-1-1Z"
              />
            </svg>
            Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
          </button>

          <button
            type="button"
            className="ghost-button"
            onClick={() => {
              setSearch("");
              setFilter("all");
              setCategoryFilter("all");
              setDateFrom("");
              setDateTo("");
              setSortBy("date-desc");
              setGroupBy("none");
            }}
          >
            Reset
          </button>
        </div>

        <div
          id="transactions-filters"
          className={`filters-panel ${filtersOpen ? "is-open" : ""}`}
        >
          <div className="control control-date" aria-label="Filter by date range">
            <div className="control-label">Date range</div>
            <div className="date-range">
              <label className="date-field">
                <span className="date-field-label">From</span>
                <input
                  type="date"
                  value={dateFrom}
                  aria-label="Start date"
                  onChange={(event) => setDateFrom(event.target.value)}
                />
              </label>

              <label className="date-field">
                <span className="date-field-label">To</span>
                <input
                  type="date"
                  value={dateTo}
                  aria-label="End date"
                  onChange={(event) => setDateTo(event.target.value)}
                />
              </label>
            </div>
          </div>

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="control control-type"
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="control control-category"
          >
            <option value="all">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as SortOption)}
            className="control control-sort"
          >
            <option value="date-desc">Newest first</option>
            <option value="date-asc">Oldest first</option>
            <option value="amount-desc">Highest amount</option>
            <option value="amount-asc">Lowest amount</option>
          </select>

          <select
            value={groupBy}
            onChange={(event) => setGroupBy(event.target.value as GroupOption)}
            className="control control-group"
          >
            <option value="none">No grouping</option>
            <option value="date">Group by date</option>
            <option value="category">Group by category</option>
            <option value="type">Group by type</option>
          </select>
        </div>

        <div className="controls-footer">
          <button type="button" className="ghost-button" onClick={() => exportTransactions("csv")}>
            Export CSV
          </button>

          <button type="button" className="ghost-button" onClick={() => exportTransactions("json")}>
            Export JSON
          </button>
        </div>
      </div>

      {hasInvalidDateRange && (
        <p className="validation-hint">Start date must be earlier than (or equal to) end date.</p>
      )}

      <div className="results-summary">
        <span>{filteredTransactions.length} matching transactions</span>
        {(dateFrom || dateTo) && (
          <span>
            Date: {dateFrom || "Any"} → {dateTo || "Any"}
          </span>
        )}
        <span>{formatCurrency(visibleIncome)} income visible</span>
        <span>{formatCurrency(visibleExpense)} expenses visible</span>
      </div>

      {statusMessage && <p className="status-banner">{statusMessage}</p>}

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Type</th>
              <th>Amount</th>
              {role === "admin" && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {filteredTransactions.length > 0 ? (
              groupedTransactions.map((group) => (
                <Fragment key={group.label}>
                  {groupBy !== "none" && (
                    <tr className="group-row">
                      <td colSpan={role === "admin" ? 5 : 4}>
                        {group.label} - {group.entries.length} transaction
                        {group.entries.length === 1 ? "" : "s"}
                      </td>
                    </tr>
                  )}

                  {group.entries.map((transaction) => {
                    const isEditing = editingId === transaction.id && editingState !== null;

                    return (
                      <tr key={transaction.id}>
                        <td data-label="Date">
                          {isEditing ? (
                            <input
                              type="date"
                              value={editingState.date}
                              onChange={(event) =>
                                setEditingState((current) =>
                                  current ? { ...current, date: event.target.value } : current
                                )
                              }
                            />
                          ) : (
                            transaction.date
                          )}
                        </td>

                        <td data-label="Category">
                          {isEditing ? (
                            <div className="cell-editor">
                              <input
                                type="text"
                                value={editingState.category}
                                onChange={(event) =>
                                  setEditingState((current) =>
                                    current ? { ...current, category: event.target.value } : current
                                  )
                                }
                              />
                              {editCategoryError && (
                                <span className="field-error">{editCategoryError}</span>
                              )}
                            </div>
                          ) : (
                            transaction.category
                          )}
                        </td>

                        <td data-label="Type">
                          {isEditing ? (
                            <select
                              value={editingState.type}
                              onChange={(event) =>
                                setEditingState((current) =>
                                  current
                                    ? {
                                        ...current,
                                        type: event.target.value as "income" | "expense",
                                      }
                                    : current
                                )
                              }
                            >
                              <option value="income">Income</option>
                              <option value="expense">Expense</option>
                            </select>
                          ) : (
                            <span className={transaction.type}>{transaction.type}</span>
                          )}
                        </td>

                        <td data-label="Amount">
                          {isEditing ? (
                            <div className="cell-editor">
                              <input
                                type="number"
                                min="0"
                                value={editingState.amount}
                                onChange={(event) =>
                                  setEditingState((current) =>
                                    current
                                      ? { ...current, amount: Number(event.target.value) }
                                      : current
                                  )
                                }
                              />
                              {editAmountError && (
                                <span className="field-error">{editAmountError}</span>
                              )}
                            </div>
                          ) : (
                            formatCurrency(transaction.amount)
                          )}
                        </td>

                        {role === "admin" && (
                          <td data-label="Actions" className="actions-cell">
                            {isEditing ? (
                              <>
                                <button
                                  type="button"
                                  className="inline-button"
                                  onClick={saveEditing}
                                  disabled={isSaveDisabled}
                                >
                                  Save
                                </button>
                                <button
                                  type="button"
                                  className="inline-button ghost-button"
                                  onClick={cancelEditing}
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  className="inline-button"
                                  onClick={() => startEditing(transaction)}
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  className="inline-button danger-button"
                                  onClick={() => handleDelete(transaction.id)}
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={role === "admin" ? 5 : 4} className="empty-row">
                  No transactions match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {transactions.length === 0 && (
        <div className="empty-panel">
          <h4>No transaction data yet</h4>
          <p>
            {role === "admin"
              ? "Add your first transaction above to populate the dashboard."
              : "Switch to admin mode to add sample activity."}
          </p>
        </div>
      )}
    </section>
  );
};

export default TransactionTable;
