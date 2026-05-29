//get [id] params
//user isLoggedIn.ts as well as the canShowAdmin function of canUser.ts
//pass parameters: canShowAdmin(id, permission);
//showOrderHistory
//get [id], [page] params

//function pageNum
//count = count all order history in store [id]
//return pageNum = count / 10

//whereClause
//use pageNum = const pageNum
//in store_id = [id]
//select: id (default/auto), createdAt, transactionid,
//ordernum(create a function), customerid, items(a type with: productid, productname, quantity)
//total price (in cents),
//payment (customerPaymentId, payment method, payment status)
//take: 10
//const skip = ([page] - 1) * 10;

//display
//date, customer name, email, total amount, payment status, detailed info
//more info (right side bar): all?

//component
//pagination
