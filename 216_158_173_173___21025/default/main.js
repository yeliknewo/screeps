var modRole = require('role');

var roleMiner = require('role.miner');
var roleHauler = require('role.hauler');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function() {
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory: ', name);
        }
    }

    Memory.roles = [
        modRole.createRole([WORK, WORK, MOVE],
            'mine_t1', 0, roleMiner),
        modRole.createRole([WORK,WORK,WORK,WORK,WORK,MOVE], 'mine_t2', 2, roleMiner),
        modRole.createRole([CARRY, CARRY, MOVE, MOVE], 'haul_t1', 2,
            roleHauler),
        modRole.createRole([WORK, CARRY, MOVE], 'up_t1', 5,
            roleUpgrader),
        modRole.createRole([WORK, CARRY, MOVE, MOVE], 'build_t1', 5,
            roleBuilder)
    ];

    Memory.indexerRole = {};

    for (var i = 0; i < Memory.roles.length; i++) {
        var role = Memory.roles[i];
        Memory.indexerRole[role.name] = i;
    }

    for (var indexRole in Memory.roles) {
        var role = Memory.roles[indexRole];
        role.creeps = _.filter(Game.creeps, (creep) => creep.memory.role ==
            role.name);
        if (Memory.roleCounts == null) {
            Memory.roleCounts = {};
        }
        Memory.roleCounts[role.name] = role.creeps.length;
    }

    var tempSources = [];

    for (var indexSpawn in Game.spawns) {
        var spawn = Game.spawns[indexSpawn];

        if (spawn.energy == spawn.energyCapacity) {
            Memory.creepsReady = true;
        } else {
            Memory.creepsReady = false;
        }

        var sources = spawn.room.find(FIND_SOURCES);

        for (var indexSource in sources) {
            var source = sources[indexSource];

            tempSources.push(source.id);
        }

        var indexRoleTarget = -1;

        for (var indexRole in Memory.roles) {
            var role = Memory.roles[indexRole];
            if (role.creeps.length < role.targetCount) {
                indexRoleTarget = indexRole;
                break;
            }
        }

        if (indexRoleTarget != -1) {
            var role = Memory.roles[indexRoleTarget];
            if (spawn.canCreateCreep(role.body) == OK) {
                spawn.createCreep(role.body, undefined, {
                    role: role.name,
                    data: role.data
                });
                console.log('Spawning with role: ' + role.name);
            }
        }
    }

    if (Memory.sources != null && tempSources.length != Memory.sources.length) {
        Memory.sources = tempSources;
    }

    for (var indexRole in Memory.roles) {
        var role = Memory.roles[indexRole];
        for (var indexCreep in role.creeps) {
            var creep = role.creeps[indexCreep];
            role.roleModule.run(creep);
        }
    }
}
