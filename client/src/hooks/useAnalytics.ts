import { useQuery } from "@tanstack/react-query";

interface Stats {
  totalSpendYTD: number;
  totalInvoices: number;
  documentsUploaded: number;
  averageInvoiceValue: number;
}

interface InvoiceTrend {
  month: string;
  volume: number;
  value: number;
}

interface VendorSpend {
  vendor: string;
  spend: number;
}

interface CategorySpend {
  name: string;
  value: number;
}

interface CashOutflow {
  month: string;
  forecast: number;
  actual: number | null;
}

export function useStats() {
  return useQuery<Stats>({
    queryKey: ['/api/stats'],
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useInvoiceTrends() {
  return useQuery<InvoiceTrend[]>({
    queryKey: ['/api/invoice-trends'],
    refetchInterval: 60000, // Refetch every minute
  });
}

export function useTopVendors() {
  return useQuery<VendorSpend[]>({
    queryKey: ['/api/vendors/top10'],
    refetchInterval: 60000,
  });
}

export function useCategorySpend() {
  return useQuery<CategorySpend[]>({
    queryKey: ['/api/category-spend'],
    refetchInterval: 60000,
  });
}

export function useCashOutflow() {
  return useQuery<CashOutflow[]>({
    queryKey: ['/api/cash-outflow'],
    refetchInterval: 60000,
  });
}

export function useInvoices(filters?: { search?: string; status?: string }) {
  const searchParams = new URLSearchParams();
  if (filters?.search) searchParams.set('search', filters.search);
  if (filters?.status) searchParams.set('status', filters.status);
  
  const queryString = searchParams.toString();
  const url = `/api/invoices${queryString ? `?${queryString}` : ''}`;
  
  return useQuery({
    queryKey: ['/api/invoices', filters],
    queryFn: async () => {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch invoices');
      return response.json();
    },
  });
}
