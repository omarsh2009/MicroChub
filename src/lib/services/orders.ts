'use client';
import type { Order, OrderWithUserData, CartItem, PaymentMethod, ShippingAddress, ServiceResponse } from '../types';

import {
    createOrder as mockCreateOrder,
    getUserOrders as mockGetUserOrders,
    getAllOrders as mockGetAllOrders,
    getOrdersByUserId as mockGetOrdersByUserId,
    updateOrderStatus as mockUpdateOrderStatus,
    approveLegalAgreement as mockApproveLegalAgreement,
} from '@/lib/mocks/orders';


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

export async function createOrder(payload: OrderPayload): Promise<ServiceResponse<string>> {
  return mockCreateOrder(payload);
}

export async function getUserOrders(userId: string): Promise<ServiceResponse<OrderWithUserData[]>> {
  return mockGetUserOrders(userId);
}

export async function getAllOrders(): Promise<ServiceResponse<OrderWithUserData[]>> {
  return mockGetAllOrders();
}

export async function getOrdersByUserId(userId: string): Promise<ServiceResponse<OrderWithUserData[]>> {
  return mockGetOrdersByUserId(userId);
}

export async function updateOrderStatus(
    orderId: string,
    status: Order['status']
): Promise<ServiceResponse<void>> {
    return mockUpdateOrderStatus(orderId, status);
}

export async function approveLegalAgreement(
    orderId: string
): Promise<ServiceResponse<void>> {
    return mockApproveLegalAgreement(orderId);
}
