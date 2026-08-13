import React from 'react';
import { QueryResult } from '../types';

interface ResultsTableProps {
  result: QueryResult;
  error: string | null;
  loading?: boolean;
}

const ResultsTable: React.FC<ResultsTableProps> = ({ result, error, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-aged font-mono text-sm">
        Running query...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-danger/10 border border-danger/30 rounded px-4 py-3">
          <span className="text-danger font-mono text-xs uppercase tracking-widest block mb-1">
            Query Error
          </span>
          <span className="text-red-300 font-mono text-sm">{error}</span>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex items-center justify-center h-full text-muted font-mono text-sm italic">
        No query run yet.
      </div>
    );
  }

  if (result.columns.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted font-mono text-sm italic">
        Query executed. No rows returned.
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <div className="flex items-center justify-between px-3 py-1 bg-[#1a1710] border-b border-[#2a2520]">
        <span className="text-muted font-mono text-xs">
          {result.rows.length} row{result.rows.length !== 1 ? 's' : ''} returned
        </span>
        <span className="text-muted font-mono text-xs">
          {result.columns.length} column{result.columns.length !== 1 ? 's' : ''}
        </span>
      </div>
      <table className="result-table">
        <thead>
          <tr>
            {result.columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {result.rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci}>
                  {cell === null ? (
                    <span className="text-muted italic">NULL</span>
                  ) : (
                    String(cell)
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsTable;
