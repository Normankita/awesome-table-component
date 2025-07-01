import { useState, useRef, useMemo } from 'react';
import './TableComponent.css';

/**
 * A table component with sorting and pagination.
 * 
 * @param {Object[]} ItemData - The data to be displayed in the table.
 * @param {string[]} headers - The header fields of the table.
 * @param {string} title - The title of the table.
 * @param {boolean} isLoading - If the data is loading.
 * @param {string[]} excludeFields - The fields to be excluded from the table.
 * @param {Object} transformFields - An object with functions to transform the data in each field.
 * @param {Object} headerLabels - An object with the labels for each header.
 * @param {Function} customActions - A function that returns the custom action buttons for each row.
 */
const TableComponent = ({
  ItemData = [],
  headers = [],
  title = "",
  isLoading = false,
  excludeFields = [],
  transformFields = {},
  headerLabels = {},
  customActions = () => null,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const norow = useRef();

  const visibleHeaders = useMemo(() => {
    return headers.filter(
      (h) => !excludeFields.includes(h) && h !== 'password' && h !== 'repassword'
    );
  }, [headers, excludeFields]);

  const handleEntriesChange = () => {
    const newEntries = parseInt(norow.current.value, 10);
    if (!isNaN(newEntries) && newEntries > 0) {
      setEntriesPerPage(newEntries);
      setCurrentPage(1);
    } else {
      norow.current.value = entriesPerPage;
    }
  };

  const handleNumber = (operation) => {
    const currentValue = parseInt(norow.current.value, 10) || entriesPerPage;
    if (operation === "minus" && currentValue > 1) {
      norow.current.value = currentValue - 1;
    } else if (operation === "add") {
      norow.current.value = currentValue + 1;
    }
    handleEntriesChange();
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return ItemData;
    const term = searchTerm.toLowerCase();
    return ItemData.filter(item =>
      visibleHeaders.some(
        key => item[key]?.toString().toLowerCase().includes(term)
      )
    );
  }, [ItemData, searchTerm, visibleHeaders]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / entriesPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const handleSort = (key) => {
    if (sortConfig.key === key) {
      setSortConfig(prev => ({
        key,
        direction: prev.direction === 'asc' ? 'desc' : 'asc'
      }));
    } else {
      setSortConfig({ key, direction: 'asc' });
    }
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return "⇅";
    return sortConfig.direction === 'asc' ? "↑" : "↓";
  };

  return (
    <div className="table-container">
      <div className="flex justify-center items-center mb-4">
        <h1 className="table-title">{title} Table</h1>
      </div>

      <div className="flex justify-center mb-4">
        <input
          type="text"
          className="search-input"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <form className="entries-selector">
        <div className="relative flex items-center">
          <button onClick={(e) => { e.preventDefault(); handleNumber("minus"); }} className="entries-button">
            <span>−</span>
          </button>
          <input ref={norow} onChange={handleEntriesChange} type="text" className="entries-input" defaultValue={entriesPerPage} />
          <button onClick={(e) => { e.preventDefault(); handleNumber("add"); }} className="entries-button">
            <span>+</span>
          </button>
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr className="table-header">
              <th className="cursor-pointer select-none">#</th>
              {visibleHeaders.map(heading => (
                <th
                  key={heading}
                  onClick={() => handleSort(heading)}
                  className="cursor-pointer select-none"
                >
                  <span>
                    {headerLabels[heading] || heading} <span>{getSortIcon(heading)}</span>
                  </span>
                </th>
              ))}
              <th className="actions">Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              [...Array(entriesPerPage)].map((_, index) => (
                <tr key={index}>
                  <td className="table-cell">
                    <div className="skeleton"></div>
                  </td>
                  {visibleHeaders.map(header => (
                    <td key={header} className="table-cell">
                      <div className="skeleton"></div>
                    </td>
                  ))}
                  <td className="table-cell">
                    <div className="skeleton skeleton-actions"></div>
                  </td>
                </tr>
              ))
            ) : (
              paginatedData.map((item, key) => (
                <tr key={key}>
                  <td className="table-cell">{key + 1}</td>
                  {visibleHeaders.map(field => (
                    <td key={field} className="table-cell truncate">
                      <h5>
                        {
                          transformFields[field]
                            ? transformFields[field](item[field], item)
                            : item[field]
                        }
                      </h5>
                    </td>
                  ))}
                  <td className="table-cell">
                    <div className="flex flex-row items-center">
                      {customActions(item)}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination-container">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12l4-4m-4 4l4 4" />
          </svg>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          Next
          <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5m14 0-4 4m4-4-4-4" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TableComponent;