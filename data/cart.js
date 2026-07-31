export let cart=JSON.parse(localStorage.getItem('cart')) || [];

export function saveToStorage(){
    localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId, quantitySelected){
    let matchingItem;
    cart.forEach((item)=>{
        if(productId === item.productId){
            matchingItem = item;
        }
    });

    if(matchingItem){
        matchingItem.quantity += quantitySelected;
    } else {
        cart.push({
            productId: productId,
            quantity: quantitySelected,
            deliveryOptionId: '2'
        });
    }
    saveToStorage();
}

export function removeFromCart(productId){
    const newCart=[];

    cart.forEach((cartItem)=>{
        if(cartItem.productId !== productId){
            newCart.push(cartItem);
        }
    });
     cart = newCart;

     saveToStorage();
}

export function updateDeliveryOption(productId,deliveryOptionId){
    let matchingItem;
    cart.forEach((item)=>{
        if(productId === item.productId){
            matchingItem = item;
        }
    });

    matchingItem.deliveryOptionId=deliveryOptionId;

    saveToStorage();
}

export function updateCartQuantity(){
    let cartQuantity = 0;
    cart.forEach((item) => {
        cartQuantity += item.quantity;
    });
    return cartQuantity;   
}
export function updateQuantity(productId, newQuantity){
    let matchingItem;
    cart.forEach((item)=>{
        if(productId === item.productId){
            matchingItem = item;
        }
    });

    matchingItem.quantity = newQuantity;

    saveToStorage();
}