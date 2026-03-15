'use client';

import { createContext, useContext, useState, useEffect } from 'react';
export interface CartItem {

  id: string | number;
  name: string;
  price: number;
  quantity: number;
  cartItemId: number;
  [key: string]: any;
}

export interface Order {

  id: string;
  date: string;
  status: string;
  items: CartItem[];
  total: number;
  [key: string]: any;
}

export interface Enrollment {

  id: string;
  enrollDate: string;
  status: string;
  courseId: string;
  [key: string]: any;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (cartItemId: number) => void;
  updateCartQuantity: (cartItemId: number, quantity: number) => void;
  clearCart: () => void;
  orders: Order[];
  addOrder: (order: any) => Order;
  enrollments: Enrollment[];
  addEnrollment: (enrollment: any) => Enrollment;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('kidus_cart');
    const savedOrders = localStorage.getItem('kidus_orders');
    const savedEnrollments = localStorage.getItem('kidus_enrollments');
    
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    if (savedEnrollments) setEnrollments(JSON.parse(savedEnrollments));
  }, []);

  useEffect(() => {
    localStorage.setItem('kidus_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('kidus_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('kidus_enrollments', JSON.stringify(enrollments));
  }, [enrollments]);

  const addToCart = (product: any) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: product.quantity || 1, cartItemId: Date.now() }];
    });
  };

  const removeFromCart = (cartItemId: number) => {
    setCart(prevCart => prevCart.filter(item => item.cartItemId !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.cartItemId === cartItemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const addOrder = (order: any) => {
    const newOrder: Order = {
      ...order,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      status: 'confirmed'
    };
    setOrders(prevOrders => [newOrder, ...prevOrders]);
    return newOrder;
  };

  const addEnrollment = (enrollment: any) => {
    const newEnrollment: Enrollment = {
      ...enrollment,
      id: Date.now().toString(),
      enrollDate: new Date().toISOString(),
      status: 'enrolled'
    };
    setEnrollments(prevEnrollments => [newEnrollment, ...prevEnrollments]);
    return newEnrollment;
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      orders,
      addOrder,
      enrollments,
      addEnrollment
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
