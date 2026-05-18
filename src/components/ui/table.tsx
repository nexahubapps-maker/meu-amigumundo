import { Table, TableContent, TableFooter, TableHeader, TableHeaderCell, TableHeaderRow, TableItem, TableRow } from "@/components/ui/table";

export default function TableDemo() {
  return (
    <Table>
      <TableHeader>
        <TableHeaderRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Email</TableHeaderCell>
        </TableHeaderRow>
      </TableHeader>
      <TableContent>
        <TableRow>
          <TableItem>Name</TableItem>
          <TableItem>Email</TableItem>
        </TableRow>
      </TableContent>
      <TableFooter>Footer</TableFooter>
    </Table>
  );
}