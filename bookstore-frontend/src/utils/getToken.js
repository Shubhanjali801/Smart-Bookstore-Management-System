/**
 * Returns the JWT token stored in localStorage, or null if not present.
 */
export const getToken = () => localStorage.getItem("token") || null