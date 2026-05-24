//using google prisma adapter
//map: id, name, email, profile picture from google

//additional signin callback:
//if user.image or user.emailVerified is null,
//use google picture or newDate() as necessary
//add a trigger = update && session to update is_client and is_admin
//the source of is_client, is_admin update is still from the db

//session strategy: jwt,
//JWT: userid, is_client array, is_admin array
//is_client array is from user.is_client (an array from db)
//is_admin array is from user.store_permissions[].store_id and user.store_permissions[].role
//map every store_id and role inside store_permissions array to be is_admin array
//example array: [{store_id: "id-123", role: "super"}, {store_id: "id-456", role: "clerk"}, ...]
