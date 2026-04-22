
import type { Order, OrderWithUserData, CartItem, PaymentMethod, ShippingAddress, ServiceResponse } from '../types';
import { mockOrders as rawMockOrders, mockUsers } from '@/lib/mock-data';

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
let mockOrders: OrderWithUserData[] = rawMockOrders.map(order => {
    const user = mockUsers.find(u => u.id === order.userId);
    if (!user) throw new Error("Mock data inconsistency: user not found");
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
  // This is a placeholder. The actual implementation would handle multipart/form-data
  // for file uploads, which requires a more complex setup than the basic api wrapper provides.
  if (payload.legalAgreementFile) {
    console.warn("File upload in createOrder is not fully implemented in the frontend service layer and requires a multipart/form-data fetch call.");
  }
  
  // This is a mock implementation
  await new Promise(resolve => setTimeout(resolve, 500));
  const newOrderId = `ord_${Math.random().toString(36).substring(2, 9)}`;
  const orderUser = mockUsers.find(u => u.role === 'super_admin'); // Mock as current user
  
  if (!orderUser) {
    return { success: false, data: null, error: { message: "Mock user not found to create order" }};
  }

  const newOrder: OrderWithUserData = {
    id: newOrderId,
    userId: orderUser.id,
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
      id: orderUser.id,
      name: orderUser.name,
      email: orderUser.email,
      phoneNumber: orderUser.phoneNumber,
    }
  };
  mockOrders.push(newOrder);

  return { success: true, data: { orderId: newOrderId }, error: null };
}

export async function getUserOrders(): Promise<ServiceResponse<OrderWithUserData[]>> {
  await new Promise(resolve => setTimeout(resolve, 50));
  // Hardcoding to a specific user for mock purposes, as we don't have real auth context here
  const userId = 'user-regular'; 
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
