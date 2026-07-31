import { cart } from './cart.js';
import { getDeliveryOption } from './deliveryOptions.js';
import { getProduct } from './products.js';

export let orders = JSON.parse(localStorage.getItem('orders')) || [];

export function saveOrdersToStorage() {
  localStorage.setItem('orders', JSON.stringify(orders));
}

const kDayInMs = 24 * 60 * 60 * 1000;

export function addOrder() {
  const orderTimeMs = Date.now();
  const orderProducts = [];

  let productCostCents = 0;
  let shippingCostCents = 0;

  cart.forEach((cartItem) => {
    const product = getProduct(cartItem.productId);
    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    const estimatedDeliveryTimeMs = orderTimeMs + (deliveryOption.deliveryDays * kDayInMs);

    productCostCents += product.priceCents * cartItem.quantity;
    shippingCostCents += deliveryOption.priceCents;

    orderProducts.push({
      productId: cartItem.productId,
      quantity: cartItem.quantity,
      estimatedDeliveryTimeMs: estimatedDeliveryTimeMs
    });
  });

  const totalBeforeTaxCents = productCostCents + shippingCostCents;
  const taxCents = totalBeforeTaxCents * 0.1;
  const totalCostCents = totalBeforeTaxCents + taxCents;

  const newOrder = {
    id: crypto.randomUUID(),
    orderTimeMs: orderTimeMs,
    totalCostCents: totalCostCents,
    products: orderProducts
  };

  orders.unshift(newOrder);
  saveOrdersToStorage();

  return newOrder;
}

export function getOrder(orderId) {
  return orders.find((order) => order.id === orderId);
}

export function clearOrders() {
  orders.length = 0;
  saveOrdersToStorage();
}