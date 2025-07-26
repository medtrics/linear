import Table from "cli-table3"

export interface TableColumn {
  header: string
  width?: number
}

export function createTable(columns: TableColumn[]) {
  return new Table({
    head: columns.map((col) => col.header),
    colWidths: columns.map((col) => col.width || null),
  })
}

export function logInfo(message: string) {
  console.log(`\n${message}`)
}

export function logSuccess(message: string) {
  console.log(`✓ ${message}`)
}

export function logWarning(message: string) {
  console.warn(`⚠ ${message}`)
}
