'use client';

// import { IMeta, IProduct } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Eye, Plus, Trash } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
// import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';
import { MBTable } from '@/components/ui/core/MBTable';
import { IMeal } from '@/types/meal';
// import DiscountModal from './DiscountModal';
// import TablePagination from '@/components/ui/core/NMTable/TablePagination';

const ManageMeals = ({ meals }: { meals: IMeal[] }) => {
  console.log('meal from manage page', meals);
  const [selectedIds, setSelectedIds] = useState<string[] | []>([]);
  console.log(selectedIds);
  const router = useRouter();

  const handleView = (meal: IMeal) => {
    console.log('Viewing product:', meal);
  };

  const handleDelete = (productId: string) => {
    console.log('Deleting product with ID:', productId);
  };

  const columns: ColumnDef<IMeal>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <span>{row.original?.name}</span>,
    },

    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }) => <span>${row.original?.price.toFixed(2)}</span>,
    },

    {
      accessorKey: 'availability',
      header: 'Availability',
      cell: ({ row }) => (
        <span
          className={`font-medium ${
            row.original?.availability ? 'text-green-600' : 'text-red-500'
          }`}
        >
          {row.original?.availability ? 'Available' : 'Unavailable'}
        </span>
      ),
    },

    {
      accessorKey: 'totalRatings',
      header: 'Total Ratings',
      cell: ({ row }) => <span>{row.original?.totalRatings ?? 0}</span>,
    },
    {
      accessorKey: 'image',
      header: 'Image',
      cell: ({ row }) =>
        row.original?.image?.length ? (
          <Image
            src={row.original.image[0]}
            alt={row.original.name}
            width={40}
            height={40}
            className="rounded-md object-cover"
          />
        ) : (
          <span>No Image</span>
        ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Manage Products</h1>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => router.push('/provider/manage-menu/add-meal')}
            size="sm"
          >
            Add Meal <Plus />
          </Button>
          {/* <DiscountModal
            setSelectedIds={setSelectedIds}
            selectedIds={selectedIds}
          /> */}
        </div>
      </div>
      <MBTable columns={columns} data={meals || []} />
      {/* <TablePagination totalPage={meta.totalPage} /> */}
    </div>
  );
};

export default ManageMeals;
