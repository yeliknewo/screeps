
var job_to_actions = {
    'gather': ['harvest', 'transfer'],
    'upgrade': ['withdraw', 'upgradeController'],
    'construct': ['withdraw', 'build'],
    'haul': ['pickup', 'transfer'],
}

module.exports = job_to_actions;
