import { cart, removeFromCart, updateDeliveryOption } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
import dayjs from "https://unpkg.com/dayjs@1.8.9/esm/index.js";
import { deliveryOptions } from "../data/deliveryOptions.js";

let cartSummaryHTML = "";
cart.forEach((cartItem) => {
  let matchingProduct;

  products.forEach((productItem) => {
    if (cartItem.productId === productItem.id) {
      matchingProduct = productItem;
    }
  });

  const deliveryOptionId = cartItem.deliveryOptionId;

  let deliveryOption;
  deliveryOptions.forEach((option) => {
    if (option.id === deliveryOptionId) {
      deliveryOption = option;
    }
  });
  console.log(deliveryOption);
  const today = dayjs();

  const deliveryDate = today
    .add(deliveryOption.deliveryDays, "days")
    .format("dddd, MMMM D");

  cartSummaryHTML += `  <div class="cart-item-container js-cart-item-container" >
            <div class="delivery-date">Delivery date: ${deliveryDate}</div>

            <div class="cart-item-details-grid">
              <img
                class="product-image"
                src=${matchingProduct.image}
              />

              <div class="cart-item-details">
                <div class="product-name">
                ${matchingProduct.name}
                </div>
                <div class="product-price">$${formatCurrency(
                  matchingProduct.priceCents
                )}</div>
                <div class="product-quantity">
                  <span> Quantity: <span class="quantity-label">${
                    matchingProduct.quantity
                  }</span> </span>
                  <span class="update-quantity-link link-primary">
                    Update
                  </span>
                  <span class="delete-quantity-link js-delete-link link-primary" data-product-id="${
                    matchingProduct.id
                  }">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                ${deliveryOptionsHTML(matchingProduct, cartItem)}
              </div>
            </div>
          </div>`;
});

function deliveryOptionsHTML(matchingProduct, cartItem) {
  let deliveryOptionsHTML = "";

  deliveryOptions.forEach((deliveryOption) => {
    const today = dayjs();

    const deliveryDate = today
      .add(deliveryOption.deliveryDays, "day")
      .format("dddd, MMMM D");

    const priceString =
      deliveryOption.priceCents === 0
        ? "FREE Shipping"
        : `$${formatCurrency(deliveryOption.priceCents)} - Shipping`;

    const isChecked = deliveryOption.id === cartItem.deliveryOptionId;
    deliveryOptionsHTML += `<div class="delivery-option js-delivery-option" data-product-id="${
      matchingProduct.id
    }" data-delivery-option-id="${deliveryOption.id}">
                  <input
                    type="radio"
                    ${isChecked ? "checked" : ""}
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}" 
                    id="delivery-option-${matchingProduct.id}-${
      deliveryOption.id
    }"
                  />
                  <label for="delivery-option-${deliveryOption.id}">
                    <div class="delivery-option-date">
                      ${deliveryDate}
                    </div>
                    <div class="delivery-option-price">
                      ${priceString}
                    </div>
                  </label>
                </div>`;
  });
  return deliveryOptionsHTML;
}
document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;
document.querySelectorAll(".js-delete-link ").forEach((link) => {
  link.addEventListener("click", () => {
    const productId = link.dataset.productId;
    removeFromCart(productId);
    const containerItem = document.querySelector(".js-cart-item-container");
    containerItem.remove();
  });
});
document.querySelectorAll(".js-delivery-option").forEach((element) => {
  element.addEventListener("click", () => {
    const { productId, deliveryOptionId } = element.dataset;
    updateDeliveryOption(productId, deliveryOptionId);
  });
});
