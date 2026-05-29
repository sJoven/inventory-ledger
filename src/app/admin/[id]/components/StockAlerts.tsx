//relate db model: Products, Store
//get [id] params
//get store (where store_id = [id]), store.settings.low_stock_threshold (int)
//get all products (where store_id = [id]) AND stocks is =< store.settings.low_stock_threshold
//also get the product.quantity of these products
//save to a var 'lowStockItems': e.g. [{name: "productName1", qty: 12}, {name: "productName2", qty: 2}, ...]
//depending on the size of the card, make it full
//when clicked to [Show More], open StockModal

//componenets: comp-StockModal (prop: lowStockItems)
