import InvoicesTable from '../InvoicesTable';

const mockInvoices = [
  { id: '1', vendor: 'Acme Corp', date: '2024-01-15', invoiceNumber: 'INV-2024-001', amount: 12500, status: 'paid' as const },
  { id: '2', vendor: 'TechSupply Inc', date: '2024-01-18', invoiceNumber: 'INV-2024-002', amount: 8900, status: 'paid' as const },
  { id: '3', vendor: 'Office Solutions', date: '2024-01-20', invoiceNumber: 'INV-2024-003', amount: 3400, status: 'pending' as const },
  { id: '4', vendor: 'Cloud Services Ltd', date: '2024-01-22', invoiceNumber: 'INV-2024-004', amount: 15600, status: 'overdue' as const },
  { id: '5', vendor: 'Marketing Agency', date: '2024-01-25', invoiceNumber: 'INV-2024-005', amount: 22000, status: 'paid' as const },
  { id: '6', vendor: 'Legal Associates', date: '2024-01-28', invoiceNumber: 'INV-2024-006', amount: 9800, status: 'pending' as const },
  { id: '7', vendor: 'Construction Co', date: '2024-02-01', invoiceNumber: 'INV-2024-007', amount: 45000, status: 'paid' as const },
  { id: '8', vendor: 'IT Services', date: '2024-02-05', invoiceNumber: 'INV-2024-008', amount: 6700, status: 'pending' as const },
  { id: '9', vendor: 'Consulting Group', date: '2024-02-08', invoiceNumber: 'INV-2024-009', amount: 18900, status: 'overdue' as const },
  { id: '10', vendor: 'Equipment Rental', date: '2024-02-10', invoiceNumber: 'INV-2024-010', amount: 4200, status: 'paid' as const },
  { id: '11', vendor: 'Software Licenses', date: '2024-02-12', invoiceNumber: 'INV-2024-011', amount: 12300, status: 'pending' as const },
  { id: '12', vendor: 'Shipping & Logistics', date: '2024-02-15', invoiceNumber: 'INV-2024-012', amount: 7500, status: 'paid' as const },
];

export default function InvoicesTableExample() {
  return (
    <div className="p-6">
      <InvoicesTable invoices={mockInvoices} />
    </div>
  );
}
