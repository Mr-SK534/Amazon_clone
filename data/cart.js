export let cart=JSON.parse(localStorage.getItem('cart'));

function saveToStorage(){
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
            quantity: quantitySelected
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