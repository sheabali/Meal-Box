/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { IOrder } from '@/types';
import { MBTable } from '@/components/ui/core/MBTable';
import { toast } from 'sonner';
import { updateOrderStatus } from '@/services/order';

type TCategoriesProps = {
  order: IOrder[];
};

const ManageOrder = ({ order }: TCategoriesProps) => {
  const handleStatusChange = async (
    id: string,
    status: 'PENDING' | 'ACCEPTED' | 'DELIVERED' | 'CANCELLED'
  ) => {
    console.log('status', status);
    try {
      const res = await updateOrderStatus(status, id);
      console.log('res', res);
      if (res.success) {
        toast.success(`Order ${status} successfully`);
      } else {
        toast.error(res.message || 'Failed to update status');
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const columns: ColumnDef<IOrder>[] = [
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
                  className={`px-2 py-1 text-xs font-semibold leading-5 text-green-600 bg-green-100 rounded-full`}
                  title="Accept"
                  onClick={() => handleStatusChange(id, 'ACCEPTED')}
                >
                  Accept
                </button>
                <button
                  className={`px-2 py-1 text-xs font-semibold leading-5 text-red-500 bg-red-100 rounded-full`}
                  title="Cancel"
                  onClick={() => handleStatusChange(id, 'CANCELLED')}
                >
                  Cancel
                </button>
              </>
            )}

            {status === 'ACCEPTED' && (
              <button
                className={`px-2 py-1 text-xs font-semibold leading-5 text-blue-500 bg-blue-100 rounded-full`}
                title="Deliver"
                onClick={() => handleStatusChange(id, 'DELIVERED')}
              >
                Deliver
              </button>
            )}

            {status === 'DELIVERED' && (
              <span
                className={`px-2 py-1 text-xs font-semibold leading-5 text-green-500 bg-green-100 rounded-full`}
              >
                Delivered
              </span>
            )}

            {status === 'CANCELLED' && (
              <span
                className={`px-2 py-1 text-xs font-semibold leading-5 text-red-500 bg-red-100 rounded-full`}
              >
                Cancelled
              </span>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <MBTable data={order || []} columns={columns} />
    </div>
  );
};

export default ManageOrder;
