import React, { useState } from 'react';
import { SchemaTable } from '../types';

interface SchemaBrowserProps {
  schema: SchemaTable[];
}

const SchemaBrowser: React.FC<SchemaBrowserProps> = ({ schema }) => {
  const [openTables, setOpenTables] = useState<Record<string, boolean>>({});

  const toggle = (name: string) =>
    setOpenTables((prev) => ({ ...prev, [name]: !prev[name] }));

  return (
    <div className="h-full overflow-y-auto bg-[#161410] p-3 space-y-1">
      <p className="text-muted font-mono text-xs uppercase tracking-widest mb-3 px-1">
        Tables
      </p>
      {schema.map((table) => (
        <div key={table.name} className="rounded overflow-hidden">
          <button
            onClick={() => toggle(table.name)}
            className="w-full flex items-center justify-between px-3 py-2 bg-[#1e1c18] hover:bg-[#252118] transition-colors text-left"
          >
            <span className="text-badge font-mono text-sm">{table.name}</span>
            <span className="text-muted font-mono text-xs">
              {openTables[table.name] ? '▲' : '▼'}
            </span>
          </button>
          {openTables[table.name] && (
            <div className="bg-[#161410] border border-[#2a2520] border-t-0 rounded-b">
              {table.columns.map((col) => (
                <div
                  key={col.name}
                  className="px-3 py-1.5 border-b border-[#1e1c18] last:border-0 flex items-start gap-2"
                >
                  <span className="text-paper font-mono text-xs min-w-[110px]">
                    {col.name}
                  </span>
                  <span className="text-wire font-mono text-xs">{col.type}</span>
                  {col.note && (
                    <span className="text-muted font-mono text-xs ml-auto text-right">
                      {col.note}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SchemaBrowser;
