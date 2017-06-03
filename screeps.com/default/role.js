var role = {
    createRole: function(body, name, targetCount, roleModule, data = null) {
        var role = {};
        role.body = body;
        role.name = name;
        role.targetCount = targetCount;
        role.roleModule = roleModule;
        role.data = data;
        return role;
    }
};

module.exports = role;
