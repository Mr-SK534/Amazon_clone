import {cart, addToCart, updateCartQuantity} from '../data/cart.js';
import {products} from '../data/products.js';
import { formatCurrency } from './utils/money.js';

function renderProducts(productsList){
    let productsHTML=``;

    productsList.forEach((product)=>{
        productsHTML+=`<div class="product-container">
                    <div class="product-image-container">
                        <img class="product-image" src="${product.image}">
                    </div>

                    <div class="product-name limit-text-to-2-lines">
                       ${product.name}
                    </div>
                    <div class="product-rating-container">
                        <img class="product-rating-stars" src="images/ratings/rating-${product.rating.stars*10}.png">
                        <div class="product-rating-count link-primary">
                            ${product.rating.count}
                        </div>
                    </div>

                    <div class="product-price">
                        $${formatCurrency(product.priceCents)}
                    </div>

                    <div class="product-quantity-container">
                        <select>
                            <option selected value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                        </select>
                    </div>
                    
                    ${product.extraInfoHTML()}

                    <div class="product-spacer"></div>

                    <div class="added-to-cart">
                        <img src="images/icons/checkmark.png">
                        Added
                    </div>

                    <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
                        Add to Cart
                    </button>
                </div>`
    });

    if(productsList.length === 0){
        productsHTML = `<div class="no-search-results">No products match your search.</div>`;
    }

    document.querySelector('.js-products-grid').innerHTML=productsHTML;

    document.querySelectorAll('.js-add-to-cart').forEach((button)=>{
        button.addEventListener('click', () => {
            const productContainer = button.closest('.product-container');
            const selectElement = productContainer.querySelector('select');
            const quantitySelected = Number(selectElement.value);

            const productId = button.dataset.productId;
            addToCart(productId, quantitySelected);

            renderCartQuantity();   // ✅ recalculates from the real cart data
        });
    });
}

renderProducts(products);

function renderCartQuantity(){
    document.querySelector('.js-cart-quantity').innerHTML = updateCartQuantity();
}

renderCartQuantity();  // ✅ runs once when amazon.js loads, only on this page

function searchProducts(){
    const searchTerm = document.querySelector('.search-input').value.trim().toLowerCase();

    if(searchTerm === ''){
        renderProducts(products);
        return;
    }

    const matchingProducts = products.filter((product) => {
        const nameMatches = product.name.toLowerCase().includes(searchTerm);
        const keywordMatches = product.keywords.some((keyword) =>
            keyword.toLowerCase().includes(searchTerm)
        );
        return nameMatches || keywordMatches;
    });

    renderProducts(matchingProducts);
}

document.querySelector('.search-button').addEventListener('click', () => {
    searchProducts();
});

document.querySelector('.search-input').addEventListener('keydown', (event) => {
    if(event.key === 'Enter'){
        searchProducts();
    }
});
document.querySelector('.search-input').addEventListener('input', (event) => {
    if(event.target.value.trim() === ''){
        renderProducts(products);
    }
});