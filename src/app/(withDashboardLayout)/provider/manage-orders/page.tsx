import ManageOrder from '@/components/modules/order';
import { getAllOrder } from '@/services/order';
import React from 'react';

const AllOrderPage = async () => {
  const { data: order } = await getAllOrder();
  console.log('order', order);

  return (
    <div>
      <ManageOrder order={order} />
    </div>
  );
};

export default AllOrderPage;
