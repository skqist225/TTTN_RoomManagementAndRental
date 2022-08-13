export function setUserToLocalStorage(user) {
    if (user) {
        localStorage.removeItem("admin-user");
        localStorage.setItem("admin-user", JSON.stringify(user));
        localStorage.removeItem("admin-authtoken");
        localStorage.setItem("admin-authtoken", user.token);
    }
}

export function removeUserFromLocalStorage() {
    localStorage.removeItem("admin-user");
    localStorage.removeItem("admin-authtoken");
}
