export interface User {
  _id: string;
  name: string;
  email: string;
  isGoogleUser: boolean;
  ordersCount: number;
  cartProductCount: number;
}
