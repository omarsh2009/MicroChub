
import type { Order, OrderWithUserData, CartItem, PaymentMethod, ShippingAddress, ServiceResponse } from '../types';
import { mockRawOrders, mockUsers } from '@/lib/mock-data';
import { getMe } from './auth';

interface OrderPayload {
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

// In-memory store for orders to simulate updates
let mockOrders: OrderWithUserData[] = mockRawOrders.map(order => {
    const user = mockUsers.find(u => u.id === order.userId);
    if (!user) throw new Error(`Mock data inconsistency: user ${order.userId} not found for order ${order.id}`);
    return {
      ...order,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
      }
    };
});

export async function createOrder(payload: OrderPayload): Promise<ServiceResponse<{orderId: string}>> {
  if (payload.legalAgreementFile) {
    console.warn("File upload in createOrder is mocked. File is not actually uploaded.");
  }
  
  await new Promise(resolve => setTimeout(resolve, 500));
  const me = await getMe();
  const currentUser = mockUsers.find(u => u.id === me.data?.uid);
  
  if (!currentUser) {
    return { success: false, data: null, error: { message: "Mock user not found to create order" }};
  }

  const newOrder: OrderWithUserData = {
    id: `ord_${Math.random().toString(36).substring(2, 9)}`,
    userId: currentUser.id,
    items: payload.cart,
    totalPrice: payload.totalPrice,
    status: 'Pending Verification',
    shippingAddress: payload.shippingAddress,
    paymentMethod: {
      id: payload.paymentMethod.id,
      name: payload.paymentMethod.name,
    },
    transactionId: payload.transactionId,
    notes: payload.notes,
    createdAt: {
      seconds: Math.floor(Date.now() / 1000),
      nanoseconds: 0,
    },
    requiresLegalApproval: payload.requiresLegalApproval,
    legalAgreementApproved: false,
    user: {
      id: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      phoneNumber: currentUser.phoneNumber,
    }
  };
  mockOrders.push(newOrder);

  return { success: true, data: { orderId: newOrder.id }, error: null };
}

export async function getUserOrders(): Promise<ServiceResponse<OrderWithUserData[]>> {
  await new Promise(resolve => setTimeout(resolve, 50));
  const me = await getMe();
  const userId = me.data?.uid;
  if (!userId) {
    return { success: false, data: null, error: { message: 'User not authenticated' } };
  }
  const userOrders = mockOrders.filter(o => o.userId === userId);
  return { success: true, data: userOrders, error: null };
}

export async function getAllOrders(): Promise<ServiceResponse<OrderWithUserData[]>> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return { success: true, data: mockOrders, error: null };
}

export async function getOrdersByUserId(userId: string): Promise<ServiceResponse<OrderWithUserData[]>> {
  await new Promise(resolve => setTimeout(resolve, 50));
  const userOrders = mockOrders.filter(o => o.userId === userId);
  return { success: true, data: userOrders, error: null };
}

export async function updateOrderStatus(
    orderId: string,
    status: Order['status']
): Promise<ServiceResponse<void>> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const orderIndex = mockOrders.findIndex(o => o.id === orderId);
    if (orderIndex > -1) {
        mockOrders[orderIndex].status = status;
        return { success: true, data: null, error: null };
    }
    return { success: false, data: null, error: { message: 'Order not found' } };
}

export async function approveLegalAgreement(
    orderId: string
): Promise<ServiceResponse<void>> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const orderIndex = mockOrders.findIndex(o => o.id === orderId);
    if (orderIndex > -1) {
        if (mockOrders[orderIndex].requiresLegalApproval) {
            mockOrders[orderIndex].legalAgreementApproved = true;
            return { success: true, data: null, error: null };
        }
        return { success: false, data: null, error: { message: 'Order does not require legal approval.' } };
    }
    return { success: false, data: null, error: { message: 'Order not found' } };
}

    