/// <reference types="react-scripts" />

declare module 'sql.js' {
  interface SqlJsStatic {
    Database: any;
  }
  function initSqlJs(config?: { locateFile?: (file: string) => string }): Promise<SqlJsStatic>;
  export default initSqlJs;
  export class Database {
    run(sql: string): this;
    exec(sql: string): Array<{ columns: string[]; values: any[][] }>;
    close(): void;
  }
}
