import { renderOrderSummary } from "./checkout/orderSummary.js";
import {renderPaymentSummary} from "./checkout/paymentSummary.js";
import { cart, updateCartQuantity } from '../data/cart.js';
renderOrderSummary();
renderPaymentSummary();

function renderCheckoutHeader(){
    const cartQuantity = updateCartQuantity();
    document.querySelector('.js-return-to-home-link').innerHTML =
        `${cartQuantity} items`;
}

renderCheckoutHeader();
