function validateUser(user) {
    if (!user) return false;
}

function ValidateAdmin(user) {
    if (!user || user.role !== 0) return false;
}

function ValidateEmployee(user) {
    if (!user || user.role !== 1) return false;
}

module.exports = {
    validateUser,
    ValidateAdmin,
    ValidateEmployee
};