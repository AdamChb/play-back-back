function validateUser(user) {
    if (!user) return false;
    return true;
}

function validateAdmin(user) {
    if (!user || user.role !== 0) return false;
    return true;
}

function validateEmployee(user) {
    if (!user || user.role !== 1) return false;
    return true;
}

module.exports = {
    validateUser,
    validateAdmin,
    validateEmployee
};