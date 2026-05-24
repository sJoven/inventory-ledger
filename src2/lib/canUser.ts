//3 functions

//1st function canAdmin
//2 parameters, store_id and permission
//3 array for each role (super, manager, clerk)
//each array have their set of permissions
//use access. {adminAccess()}
//call adminAccess() function and store it in const "userRoles"
//userRoles have an array of objects (store_id, store_name and role) || null
//if userRoles = null, return status = 403
//check if store_id (parameter) is in the userRoles
//if not, return status = 403
//if found, check the role of the very object
//if role = "super", return status = 200
//after finding the role check if the permission (parameter) is inside the role array (const) of the user's role (from the found store's object)
//if found, return status = 200
//if not, return status = 403

//2nd function canClient
//1 parameter, store_id
//using the session.userid, look for the .is_client field
//this is an array of store_id
//check if the parameter store_id is inside the array of store_id
//if found, return status = 200
//if not, return status = 403

//3rd function canShowAdmin
//2 parameter, store_id and permission
//3 array for each role (super, manager, clerk)
//each array have their set of permissions
//check if the session.is_admin contains the store_id from the parameter
//if not, return status = 403
//get that object and store it in a const
//check the .role of the const and check the array similar to that role
//check the array for the same permission
//if its not found, return status = 403

//4th function canShowClient
//1 parameter, store_id
//check if the session.is_client contains the store_id from the parameter
//if not, return status = 403
