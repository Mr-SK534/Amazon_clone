import { addToCart, cart, saveToStorage } from "../../data/cart.js";

describe('test suite: add to cart', () => {

    beforeEach(() => {
        // Reset cart before each test so tests don't interfere with each other
        cart.length = 0;
    });

    it('adds an existing product to the cart', () => {
        spyOn(localStorage, 'setItem');

        // Add the product for the first time
        addToCart('15b6fc6f-327a-4ec4-896f-486349e85a3d', 1);

        // Add the same product again with a different quantity
        addToCart('15b6fc6f-327a-4ec4-896f-486349e85a3d', 2);

        expect(cart.length).toEqual(1);
        expect(cart[0].productId).toEqual('15b6fc6f-327a-4ec4-896f-486349e85a3d');
        expect(cart[0].quantity).toEqual(3);
    });

    it('adds a new product to the cart', () => {

        spyOn(localStorage, 'setItem');

        addToCart('15b6fc6f-327a-4ec4-896f-486349e85a3d', 1);

        expect(cart.length).toEqual(1);
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(cart[0].productId).toEqual('15b6fc6f-327a-4ec4-896f-486349e85a3d');
        expect(cart[0].quantity).toEqual(1);
    });
});