import { orders, clearOrders } from '../data/orders.js';
import { getProduct } from '../data/products.js';
import { addToCart, updateCartQuantity } from '../data/cart.js';
import { formatCurrency } from './utils/money.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

function renderOrders() {
  let ordersHTML = '';

  if (orders.length === 0) {
    ordersHTML = `<div>You have no orders yet.</div>`;
  }

  orders.forEach((order) => {
    const orderTimeString = dayjs(order.orderTimeMs).format('MMMM D');

    let productsHTML = '';

    order.products.forEach((orderProduct) => {
      const product = getProduct(orderProduct.productId);
      const deliveryDateString = dayjs(orderProduct.estimatedDeliveryTimeMs).format('MMMM D');

      productsHTML += `
        <div class="product-image-container">
          <img src="${product.image}">
        </div>

        <div class="product-details">
          <div class="product-name">
            ${product.name}
          </div>
          <div class="product-delivery-date">
            Arriving on: ${deliveryDateString}
          </div>
          <div class="product-quantity">
            Quantity: ${orderProduct.quantity}
          </div>
          <button class="buy-again-button button-primary js-buy-again" data-product-id="${product.id}">
            <img class="buy-again-icon" src="images/icons/buy-again.png">
            <span class="buy-again-message">Buy it again</span>
          </button>
        </div>

        <div class="product-actions">
          <a href="tracking.html?orderId=${order.id}&productId=${product.id}">
            <button class="track-package-button button-secondary">
              Track package
            </button>
          </a>
        </div>
      `;
    });

    ordersHTML += `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${orderTimeString}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${formatCurrency(order.totalCostCents)}</div>
            </div>
          </div>

          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.id}</div>
          </div>
        </div>

        <div class="order-details-grid">
          ${productsHTML}
        </div>
      </div>
    `;
  });

  document.querySelector('.js-orders-grid').innerHTML = ordersHTML;

  document.querySelectorAll('.js-buy-again').forEach((button) => {
    button.addEventListener('click', () => {
      addToCart(button.dataset.productId, 1);
      renderCartQuantity();
    });
  });
}

function renderCartQuantity() {
  document.querySelector('.js-cart-quantity').innerHTML = updateCartQuantity();
}

renderOrders();
renderCartQuantity();

document.querySelector('.js-clear-orders-link').addEventListener('click', (event) => {
  event.preventDefault();
  clearOrders();
  renderOrders();
});