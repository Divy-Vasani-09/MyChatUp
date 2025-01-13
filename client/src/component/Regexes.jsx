export const fullNameRegex = new RegExp("^[a-zA-Z]+\\s[a-zA-Z]+\\s[a-zA-Z]+$"); 
export const userNameRegex = new RegExp("^[a-zA-Z0-9._@]{2,15}$"); 
export const phoneNoRegex = new RegExp("^[6-9][0-9]{9}$"); 
export const emailIdRegex = new RegExp("^[a-zA-Z0-9]+@[a-zA-Z0-9.-]+.[a-z]{2,3}$");
export const passwordRegex = new RegExp("^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^&*-]).{8,}$"); 