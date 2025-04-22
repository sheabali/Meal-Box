export interface IAddress {
  customerId?: string;
  zipCode: string;
  pickupStreet: string;
  houseNo: string;
  city: string;
  isDeleted?: boolean;
  _id?: string;
}
