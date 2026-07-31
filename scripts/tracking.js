import { getOrder } from '../data/orders.js';
import { getProduct } from '../data/products.js';
import { updateCartQuantity } from '../data/cart.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

const url = new URL(window.location.href);
const orderId = url.searchParams.get('orderId');
const productId = url.searchParams.get('productId');

const order = getOrder(orderId);
const container = document.querySelector('.js-order-tracking');

if (!order) {
  container.innerHTML = `
    <a class="back-to-orders-link link-primary" href="orders.html">
      View all orders
    </a>
    <div class="delivery-date">Order not found.</div>
  `;
} else {
  const orderProduct = order.products.find((p) => p.productId === productId);
  const product = getProduct(productId);

  const deliveryDateString = dayjs(orderProduct.estimatedDeliveryTimeMs).format('dddd, MMMM D');

  const now = Date.now();
  const orderTimeMs = order.orderTimeMs;
  const deliveryTimeMs = orderProduct.estimatedDeliveryTimeMs;

  let progressPercentage = (now - orderTimeMs) / (deliveryTimeMs - orderTimeMs) * 100;
  progressPercentage = Math.min(100, Math.max(0, progressPercentage));

  let currentStatus;
  if (progressPercentage >= 100) {
    currentStatus = 'Delivered';
  } else if (progressPercentage >= 50) {
    currentStatus = 'Shipped';
  } else {
    currentStatus = 'Preparing';
  }

  function statusClass(label) {
    return label === currentStatus ? 'progress-label current-status' : 'progress-label';
  }

  container.innerHTML = `
    <a class="back-to-orders-link link-primary" href="orders.html">
      View all orders
    </a>

    <div class="delivery-date">
      Arriving on ${deliveryDateString}
    </div>

    <div class="product-info">
      ${product.name}
    </div>

    <div class="product-info">
      Quantity: ${orderProduct.quantity}
    </div>

    <img class="product-image" src="${product.image}">

    <div class="progress-labels-container">
      <div class="${statusClass('Preparing')}">Preparing</div>
      <div class="${statusClass('Shipped')}">Shipped</div>
      <div class="${statusClass('Delivered')}">Delivered</div>
    </div>

    <div class="progress-bar-container">
      <div class="progress-bar" style="width: ${progressPercentage}%"></div>
    </div>
  `;
}

document.querySelector('.js-cart-quantity').innerHTML = updateCartQuantity();