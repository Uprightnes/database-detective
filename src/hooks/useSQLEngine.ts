import { useEffect, useRef, useState, useCallback } from 'react';
import initSqlJs, { Database } from 'sql.js';
import { CaseData, QueryResult } from '../types';

export const useSQLEngine = (caseData: CaseData | null) => {
  const dbRef = useRef<Database | null>(null);
  const [ready, setReady] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    if (!caseData) return;
    setReady(false);
    setInitError(null);

    initSqlJs({ locateFile: () => '/sql-wasm.wasm' })
      .then((SQL) => {
        if (dbRef.current) {
          dbRef.current.close();
        }
        const db = new SQL.Database();
        db.run(caseData.seedSQL);
        dbRef.current = db;
        setReady(true);
      })
      .catch((err) => {
        setInitError('Failed to initialize SQL engine: ' + err.message);
      });

    return () => {
      if (dbRef.current) {
        dbRef.current.close();
        dbRef.current = null;
      }
    };
  }, [caseData]);

  const runQuery = useCallback((sql: string): { result: QueryResult; error: string | null } => {
    if (!dbRef.current) return { result: null, error: 'Database not ready.' };
    if (!sql.trim()) return { result: null, error: 'Write a query first, Detective.' };

    try {
      const results = dbRef.current.exec(sql);
      if (!results || results.length === 0) {
        return {
          result: { columns: [], rows: [] },
          error: null,
        };
      }
      return {
        result: {
          columns: results[0].columns,
          rows: results[0].values as any[][],
        },
        error: null,
      };
    } catch (err: any) {
      return { result: null, error: err.message };
    }
  }, []);

  const validateResult = useCallback(
    (
      result: QueryResult,
      expectedColumns: string[],
      expectedRowCount: number
    ): boolean => {
      if (!result) return false;
      if (result.rows.length !== expectedRowCount) return false;

      // Normalize column names for comparison (lowercase)
      const resultCols = result.columns.map((c) => c.toLowerCase());
      const expectedCols = expectedColumns.map((c) => c.toLowerCase());

      // Check all expected columns exist in result
      return expectedCols.every((ec) => resultCols.includes(ec));
    },
    []
  );

  return { ready, initError, runQuery, validateResult };
};
