/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IOrder {
  [x: string]: any;
  paymentStatus: string;
  isDeleted: boolean;
  _id: string;
  status: string;
  updatedAt: string;
}
