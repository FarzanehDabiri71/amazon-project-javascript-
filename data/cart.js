export const cart = [
  { productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6", quantity: 3 },
];
export function addToCart(productId) {
  let matchingItem;
  cart.forEach((cartItem) => {
    if (cartItem.productId === productId) {
      matchingItem = cartItem;
    }
  });
  if (matchingItem) {
    matchingItem.quantity += 1;
  } else {
    cart.push({ productId, quantity: 1 });
  }
}
