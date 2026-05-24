//use isLoggedIn.ts and canUser.ts' canShowClient
//component: cart(right panel/slidable)
//model Cart {
//id         String     @id @default(auto()) @map("_id") @db.ObjectId
//user_id    String     @db.ObjectId
//store_id   String     @db.ObjectId
//user       User       @relation(fields: [user_id], references: [id], onDelete: Cascade)
//store      Store      @relation(fields: [store_id], references: [id], onDelete: Cascade)
//items      CartItem[] // Array of items in the cart
//updated_at DateTime   @updatedAt
//@@unique([user_id, store_id])
//@@map("carts")

// Embedded type for items
//type CartItem {
//id         String   @id @default(auto()) @map("_id") @db.ObjectId
//cart_id    String   @db.ObjectId
//cart       Cart     @relation(fields: [cart_id], references: [id], onDelete: Cascade)
//product_id String   @db.ObjectId
//quantity   Int      @default(1)
//@@map("cart_items")

//get session.user
//get [id] params (store_id)
//select cart where session.user AND store_id
//get cartitem
//map the cartitems: [product name and product price (from productid)]
//and quantity, total price (quantity * product price)
//cart items could be selected from the left(then checked out)
//instead of delete btn for every items, click Edit
//then select box will appear at the right
//Edit will become Cancel and Delete
