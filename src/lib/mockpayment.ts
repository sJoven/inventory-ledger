//createCustomer
//1 parameter: userEmail
//returns: userEmail and created ID ??`cus_fake_${Math.random().toString(36).substr(2, 9)}`,

//processPayment
//3 parameter: amount, currency/type (from store), customerId from createUser
//return: transactionsid, status, amount, currency/type, customerId

//payment
//2 parameter: req(email, amountinCents, items), res
//find user via email, if not then create new via createCustomer
//call process payment
//createneworder = id (default/auto), createdAt, transactionid,
//ordernum(create a function), customerid, items(productid, productname, quantity)
//total price (peso, in cents then just convert it),
//payment (customerPaymentId, payment method, payment status)
//return res.status(200) = success:true, orderId(from create new order),
//chargeId (from process pament, transactionid)
