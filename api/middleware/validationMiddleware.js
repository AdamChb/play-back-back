function validateUser(user) {
    if (!user) return false;
}

function validateAdmin(user) {
    if (!user || user.role !== 0) return false;
}

function validateEmployee(user) {
    if (!user || user.role !== 1) return false;
}

module.exports = {
    validateUser,
    validateAdmin,
    validateEmployee
};