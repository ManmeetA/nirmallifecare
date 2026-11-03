import type { Metadata } from 'next'
import ProductsTable from '@/components/admin/ProductsTable'

export const metadata: Metadata = { title: 'Products' }

export default function Page() {
  return <ProductsTable />
}
