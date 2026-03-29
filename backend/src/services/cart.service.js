import Cart from "../models/cart.model.js";

export function mergeCartItems(userCart, guestCart) {
  for (const guestItem of guestCart.items) {
    const existingItem = userCart.items.find(
      (item) => item.productID.toString() === guestItem.productID.toString(),
    );

    if (existingItem) {
      existingItem.quantity += guestItem.quantity;
    } else {
      userCart.items.push(guestItem);
    }
  }
}

export async function handleGuestCart(guestID, userID) {
  if (!guestID) return;

  const guestCart = await Cart.findOne({ guestID });
  if (!guestCart) return;

  const userCart = await Cart.findOne({ customerID: userID });

  if (!userCart) {
    guestCart.customerID = userID;
    guestCart.guestID = undefined;
    await guestCart.save();
    return;
  }

  mergeCartItems(userCart, guestCart);

  await userCart.save();
  await Cart.deleteOne({ guestID });
}
