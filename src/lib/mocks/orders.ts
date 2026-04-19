
'use client';
import type { CartItem, Order, OrderWithUserData, PaymentMethod, ShippingAddress, ServiceResponse } from '../types';

interface OrderPayload {
  userId: string;
  cart: CartItem[];
  totalPrice: number;
  notes?: string;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  transactionId: string;
  requiresLegalApproval: boolean;
  legalAgreementFile?: File;
  couponCode?: string;
  discountAmount?: number;
}

export async function createOrder(
  payload: OrderPayload
): Promise<ServiceResponse<string>> {
  throw new Error('API not implemented: mockCreateOrder');
}

export async function getUserOrders(userId: string): Promise<ServiceResponse<OrderWithUserData[]>> {
  throw new Error('API not implemented: mockGetUserOrders');
}

export async function getAllOrders(): Promise<ServiceResponse<OrderWithUserData[]>> {
  throw new Error('API not implemented: mockGetAllOrders');
}

export async function getOrdersByUserId(userId: string): Promise<ServiceResponse<OrderWithUserData[]>> {
  throw new Error('API not implemented: mockGetOrdersByUserId');
}

export async function updateOrderStatus(
    orderId: string,
    status: Order['status']
): Promise<ServiceResponse<void>> {
    throw new Error('API not implemented: mockUpdateOrderStatus');
}

export async function approveLegalAgreement(
    orderId: string
): Promise<ServiceResponse<void>> {
    throw new Error('API not implemented: mockApproveLegalAgreement');
}
