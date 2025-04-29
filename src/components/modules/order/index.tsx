/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { IOrder } from '@/types';
import { MBTable } from '@/components/ui/core/MBTable';
import { toast } from 'sonner';
import { updateOrderStatus } from '@/services/order';
import Image from 'next/image';
import { currencyFormatter } from '@/lib/currencyFormatter';
import { useUser } from '@/context/UserContext';

type TCategoriesProps = {
  order: IOrder[];
};

const ManageOrder = ({ order }: TCategoriesProps) => {
  const user = useUser();

  const handleStatusChange = async (
    id: string,
    status: 'PENDING' | 'ACCEPTED' | 'DELIVERED' | 'CANCELLED'
  ) => {
    try {
      const res = await updateOrderStatus(status, id);
      if (res.success) {
        toast.success(`Order ${status} successfully`);
      } else {
        toast.error(res.message || 'Failed to update status');
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const getStatusBadge = (status: string, map: Record<string, string>) => {
    const badgeColor = map[status] || 'bg-gray-100 text-gray-600';
    return (
      <span
        className={`px-2 py-1 text-xs font-semibold leading-5 rounded-full ${badgeColor}`}
      >
        {status}
      </span>
    );
  };

  const baseColumns: ColumnDef<IOrder>[] = [
    {
      accessorKey: 'name',
      header: 'Meal Name',
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <Image
            src={row.original?.meals.image[0] ?? '/placeholder-image.png'}
            alt={row.original?.meals.image[0]}
            width={40}
            height={40}
            className="w-8 h-8 rounded-full"
          />
          <span className="truncate">{row.original?.meals?.name}</span>
        </div>
      ),
    },
  ];

  const customerColumns: ColumnDef<IOrder>[] = [
    ...baseColumns,
    {
      accessorKey: 'price',
      header: () => <div>Price</div>,
      cell: ({ row }) => (
        <span className="px-2 py-1 text-xs font-semibold leading-5 text-green-600 bg-green-100 rounded-full">
          {currencyFormatter(row.original.amount)}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: () => <div>Status</div>,
      cell: ({ row }) =>
        getStatusBadge(row.original.status, {
          PENDING: 'bg-yellow-100 text-yellow-600',
          ACCEPTED: 'bg-blue-100 text-blue-600',
          DELIVERED: 'bg-green-100 text-green-600',
          CANCELLED: 'bg-red-100 text-red-600',
        }),
    },
    {
      accessorKey: 'paymentStatus',
      header: () => <div>Payment Status</div>,
      cell: ({ row }) =>
        getStatusBadge(row.original.paymentStatus, {
          PENDING: 'bg-yellow-100 text-yellow-600',
          PAID: 'bg-green-100 text-green-600',
          FAILED: 'bg-red-100 text-red-600',
        }),
    },
  ];

  const providerColumns: ColumnDef<IOrder>[] = [
    ...baseColumns,
    {
      accessorKey: 'status',
      header: () => <div>Status</div>,
      cell: ({ row }) =>
        getStatusBadge(row.original.status, {
          PENDING: 'bg-yellow-100 text-yellow-600',
          ACCEPTED: 'bg-blue-100 text-blue-600',
          DELIVERED: 'bg-green-100 text-green-600',
          CANCELLED: 'bg-red-100 text-red-600',
        }),
    },
    {
      accessorKey: 'paymentStatus',
      header: () => <div>Payment Status</div>,
      cell: ({ row }) =>
        getStatusBadge(row.original.paymentStatus, {
          PENDING: 'bg-yellow-100 text-yellow-600',
          PAID: 'bg-green-100 text-green-600',
          FAILED: 'bg-red-100 text-red-600',
        }),
    },
    {
      accessorKey: 'action',
      header: () => <div>Action</div>,
      cell: ({ row }) => {
        const status = row.original.status;
        const id = row.original._id;

        return (
          <div className="flex gap-2">
            {status === 'PENDING' && (
              <>
                <button
                  className="px-2 py-1 text-xs font-semibold leading-5 text-green-600 bg-green-100 rounded-full"
                  title="Accept"
                  onClick={() => handleStatusChange(id, 'ACCEPTED')}
                >
                  Accept
                </button>
                <button
                  className="px-2 py-1 text-xs font-semibold leading-5 text-red-500 bg-red-100 rounded-full"
                  title="Cancel"
                  onClick={() => handleStatusChange(id, 'CANCELLED')}
                >
                  Cancel
                </button>
              </>
            )}

            {status === 'ACCEPTED' && (
              <button
                className="px-2 py-1 text-xs font-semibold leading-5 text-blue-500 bg-blue-100 rounded-full"
                title="Deliver"
                onClick={() => handleStatusChange(id, 'DELIVERED')}
              >
                Deliver
              </button>
            )}

            {status === 'DELIVERED' && (
              <span className="px-2 py-1 text-xs font-semibold leading-5 text-green-500 bg-green-100 rounded-full">
                Delivered
              </span>
            )}

            {status === 'CANCELLED' && (
              <span className="px-2 py-1 text-xs font-semibold leading-5 text-red-500 bg-red-100 rounded-full">
                Cancelled
              </span>
            )}
          </div>
        );
      },
    },
  ];

  const columns =
    user?.user?.role === ('provider' as string)
      ? providerColumns
      : customerColumns;

  return <MBTable data={order || []} columns={columns} />;
};

export default ManageOrder;
