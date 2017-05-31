var targetPool = require('targetPool');
var spawnSystem = require('spawner');
require('creep');
var _ = require('lodash');

//cleans up expired creep memory
function cleanup() {
    //deleted creep cleanup
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
}

module.exports.loop = function() {
    cleanup();
    var target_counter = {};
    var target_requester = {};
    var action_counter = {};
    action_counter['total'] = 0;

    for(let c in Game.creeps) {
        let creep = Game.creeps[c];
        if(!creep.memory.action) {
            creep.memory.action = 'harvest';
        }
        creep.run(target_counter, target_requester);

        if(action_counter[creep.memory.action]) {
            action_counter[creep.memory.action] += 1;
            action_counter['total'] += 1;
        }
        else {
            action_counter[creep.memory.action] = 1;
            action_counter['total'] += 1;
        }
    }

    if(action_counter['total'] < 2) {
        _.forEach(Game.creeps, function(creep) {
            if(creep.memory.job != 'gather') {
                creep.memory.job = 'gather';
            }
        });
    }

    spawnSystem(action_counter);

    targetPool.updateTargetPools();
    targetPool.distributeTargets(target_counter, target_requester);
}
