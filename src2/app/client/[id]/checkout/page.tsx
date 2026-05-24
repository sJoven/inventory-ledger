//use isLoggedIn.ts and canUser.ts' canShowClient
//product checkout summary

// import { prisma } from "@/lib/prisma";
// import { redirect } from "next/navigation";

// export default async function CheckoutPage({
//   searchParams,
// }: {
//   searchParams: Promise<{
//     type?: string;
//     id?: string;
//     productId?: string;
//     qty?: string;
//   }>;
// }) {
//   const params = await searchParams;

//   // We will populate this array regardless of how the user got here
//   let checkoutItems: {
//     productId: string;
//     quantity: number;
//     price: number;
//     name: string;
//   }[] = [];

//   // APPROACH 1: Full Cart Checkout
//   if (params.type === "cart" && params.id) {
//     const cart = await prisma.cart.findUnique({
//       where: { id: params.id },
//       include: { items: { include: { product: true } } }, // Fetch product info/prices
//     });

//     if (!cart) redirect("/cart");

//     checkoutItems = cart.items.map((item) => ({
//       productId: item.product_id,
//       quantity: item.quantity,
//       price: item.product.price,
//       name: item.product.name,
//     }));
//   }

//   // APPROACH 2: Single Item "Buy It Now"
//   else if (params.type === "direct" && params.productId) {
//     const product = await prisma.product.findUnique({
//       where: { id: params.productId },
//     });

//     if (!product) redirect("/");

//     checkoutItems = [
//       {
//         productId: product.id,
//         quantity: Math.max(1, parseInt(params.qty || "1")),
//         price: product.price,
//         name: product.name,
//       },
//     ];
//   } else {
//     redirect("/"); // No valid checkout intent found
//   }

//   // --- Beyond this point, the page behaves EXACTLY the same ---
//   // You calculate the total from `checkoutItems`, render the summary, and show the payment form.
//   const total = checkoutItems.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0,
//   );

//   return (
//     <div>
//       <h1>Secure Checkout</h1>
//       {/* Loop through checkoutItems and display them */}
//       <p>Total: ${(total / 100).toFixed(2)}</p>
//     </div>
//   );
// }
