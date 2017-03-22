var role = {
    createRole: function(body, name, targetCount, roleModule) {
        var role = {};
        role.body = body;
        role.name = name;
        role.targetCount = targetCount;
        role.roleModule = roleModule;
        return role;
    }
};

module.exports = role;
