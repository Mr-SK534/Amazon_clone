import { cart, removeFromCart, updateDeliveryOption, updateQuantity, updateCartQuantity } from '../../data/cart.js';
import { products, getProduct } from '../../data/products.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { deliveryOptions, getDeliveryOption } from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';
import { formatCurrency } from '../utils/money.js';

export function renderOrderSummary() {

  function renderCheckoutHeader(){
    const cartQuantity = updateCartQuantity();
    document.querySelector('.js-return-to-home-link').innerHTML = `${cartQuantity} items`;
}
  let cartSummaryHTML = '';

  cart.forEach((cartItems) => {
    const productId = cartItems.productId;

    const matchingProduct = getProduct(productId);

    const deliveryOptionId = cartItems.deliveryOptionId;

    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');

    cartSummaryHTML += `<div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
            <div class="delivery-date">
              Delivery date: ${dateString}
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src="${matchingProduct.image}">

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingProduct.name}
                </div>
                <div class="product-price">
                  $${formatCurrency(matchingProduct.priceCents)}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label">${cartItems.quantity}</span>
                  </span>
                  <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
                    Update
                  </span>
                  <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                ${deliveryOptionHTMl(matchingProduct, cartItems)}
              </div>
            </div>
          </div>`;
  });

  function deliveryOptionHTMl(matchingProduct, cartItems) {

    let html = '';
    deliveryOptions.forEach((deliveryOption) => {


      const today = dayjs();
      const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');

      const dateString = deliveryDate.format('dddd, MMMM D');

      const priceString = deliveryOption.priceCents === 0 ? `FREE` : `${formatCurrency(deliveryOption.priceCents)} - `;

      const isChecked = deliveryOption.id === cartItems.deliveryOptionId;

      html += `<div class="delivery-option js-delivery-option" data-product-id="${matchingProduct.id}" data-delivery-option-id="${deliveryOption.id}">
          <input type="radio"
          ${isChecked ? 'checked' : ''}
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              ${dateString}
            </div>
            <div class="delivery-option-price">
              $${priceString} Shipping
            </div>
          </div>
        </div>`
    });
    
    return html;
  }

  document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

  document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);
      
      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      container.remove();

      renderPaymentSummary();
      renderCheckoutHeader();
    });
  });
document.querySelectorAll('.js-save-link').forEach((link) => {
  link.addEventListener('click', () => {
    const productId = link.dataset.productId;
    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    const quantityInput = container.querySelector('.js-quantity-input');
    const newQuantity = Number(quantityInput.value);

    updateQuantity(productId, newQuantity);
    renderOrderSummary();
    renderCheckoutHeader();   // ✅ add this line
  });
});
  document.querySelectorAll('.js-delivery-option').forEach((element) => {
    element.addEventListener('click', () => {
      const { productId, deliveryOptionId } = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });

  renderCheckoutHeader();
}