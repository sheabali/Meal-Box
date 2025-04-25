/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Image from 'next/image';
import { toast } from 'sonner';
import { useState } from 'react';
import { IMeal } from '@/types/meal';
import { useRouter } from 'next/navigation';
import { deleteMeal } from '@/services/meal';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Eye, Plus, Trash } from 'lucide-react';
import { MBTable } from '@/components/ui/core/MBTable';

import DeleteConfirmationModal from '@/components/ui/core/MBModal';

const ManageMeals = ({ meals }: { meals: IMeal[] }) => {
  const router = useRouter();

  const handleView = (meal: IMeal) => {
    console.log('Viewing product:', meal);
  };

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const handleDelete = (data: IMeal) => {
    setSelectedId(data?._id as string);
    setSelectedItem(data?.name);
    setModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (selectedId) {
        const res = await deleteMeal(selectedId);

        if (res.success) {
          toast.success(res.message);
          setModalOpen(false);
        } else {
          toast.error(res.message);
        }
      }
    } catch (err: any) {
      console.error(err?.message);
    }
  };

  const columns: ColumnDef<IMeal>[] = [
    {
      accessorKey: 'name',
      header: 'Product Name',
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <Image
            src={row.original?.image?.[0] ?? '/placeholder-image.png'}
            alt={row.original.name}
            width={40}
            height={40}
            className="w-8 h-8 rounded-full"
          />
          <span className="truncate">{row.original?.name}</span>
        </div>
      ),
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
      accessorKey: 'action',
      header: 'Action',
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <button
            className="text-gray-500 hover:text-blue-500"
            title="View"
            onClick={() => handleView(row?.original)}
          >
            <Eye className="w-5 h-5" />
          </button>

          <button
            className="text-gray-500 hover:text-green-500"
            title="Edit"
            onClick={() =>
              router.push(
                `/provider/manage-menu/update-meal/${row.original?._id}`
              )
            }
          >
            <Edit className="w-5 h-5" />
          </button>

          <button className=" text-red-400 hover:text-red-500" title="Delete">
            <Trash
              onClick={() => handleDelete(row.original)}
              className="w-5 h-5"
            />
          </button>
        </div>
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
        </div>
      </div>
      <MBTable columns={columns} data={meals || []} />
      {/* <TablePagination totalPage={meta.totalPage} /> */}

      <DeleteConfirmationModal
        isOpen={isModalOpen}
        name={selectedItem}
        onOpenChange={setModalOpen}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default ManageMeals;
