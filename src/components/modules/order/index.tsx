'use client';

import { ColumnDef } from '@tanstack/react-table';

import Image from 'next/image';
// import { Trash } from 'lucide-react';
import { useState } from 'react';

import { IOrder } from '@/types';
import { MBTable } from '@/components/ui/core/MBTable';

type TCategoriesProps = {
  order: IOrder[];
};

const ManageOrder = ({ order }: TCategoriesProps) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // const handleDelete = (data: IOrder) => {
  //   console.log(data);
  //   setSelectedId(data?._id);
  //   setSelectedItem(data?.name);
  //   setModalOpen(true);
  // };

  // const handleDeleteConfirm = async () => {
  //   try {
  //     if (selectedId) {
  //       const res = await deleteCategory(selectedId);

  //       if (res.success) {
  //         toast.success(res.message);
  //         setModalOpen(false);
  //       } else {
  //         toast.error(res.message);
  //       }
  //     }
  //   } catch (err: any) {
  //     console.error(err?.message);
  //   }
  // };

  const columns: ColumnDef<IOrder>[] = [
    // {
    //   accessorKey: 'paymentStatus',
    //   header: () => <div>Category Name</div>,
    //   cell: ({ row }) => (
    //     <div className="flex items-center space-x-3">
    //       <Image
    //         src={row.original.icon}
    //         alt={row.original.name}
    //         width={40}
    //         height={40}
    //         className="w-8 h-8 rounded-full"
    //       />
    //       <span className="truncate">{row.original.name}</span>
    //     </div>
    //   ),
    // },
    {
      accessorKey: 'status',
      header: () => <div>Status</div>,
      cell: ({ row }) => (
        <div>
          <span
            className={`px-2 py-1 text-xs font-semibold leading-5 text-green-600 bg-green-100 rounded-full`}
          >
            {row.original.status}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'paymentStatus',
      header: () => <div>Payment Status</div>,
      cell: ({ row }) => {
        const status = row.original.paymentStatus;

        let badgeColor = 'bg-gray-100 text-gray-600';
        if (status === 'PENDING') {
          badgeColor = 'bg-yellow-100 text-yellow-600';
        } else if (status === 'PAID') {
          badgeColor = 'bg-green-100 text-green-600';
        } else if (status === 'FAILED') {
          badgeColor = 'bg-red-100 text-red-600';
        }

        return (
          <div>
            <span
              className={`px-2 py-1 text-xs font-semibold leading-5 rounded-full ${badgeColor}`}
            >
              {status}
            </span>
          </div>
        );
      },
    },

    // {
    //   accessorKey: 'action',
    //   header: () => <div>Action</div>,
    //   cell: ({ row }) => (
    //     <button className="text-red-500" title="Delete">
    //       <Trash
    //         onClick={() => handleDelete(row.original)}
    //         className="w-5 h-5"
    //       />
    //     </button>
    //   ),
    // },
  ];

  return (
    <div>
      <MBTable data={order || []} columns={columns} />
      {/* <DeleteConfirmationModal
        isOpen={isModalOpen}
        name={selectedItem}
        onOpenChange={setModalOpen}
        onConfirm={handleDeleteConfirm}
      /> */}
    </div>
  );
};

export default ManageOrder;
