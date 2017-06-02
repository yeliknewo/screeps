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
            'mine_t1', 1, roleMiner),
        modRole.createRole([CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
            'haul_t1', 1,
            roleHauler),
        modRole.createRole([WORK, WORK, CARRY, MOVE], 'up_t1', 0,
            roleUpgrader),
        modRole.createRole([WORK, CARRY, MOVE, MOVE], 'build_t1', 0,
            roleBuilder),
        modRole.createRole([WORK, WORK, WORK, WORK, WORK, MOVE],
            'mine_t2', 0, roleMiner),
        modRole.createRole([WORK, WORK, WORK, WORK, CARRY, MOVE,
                MOVE
            ],
            'up_t2', 0,
            roleUpgrader),
        modRole.createRole([WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE,
                MOVE
            ], 'build_t2',
            0, roleBuilder),
        modRole.createRole([WORK, WORK, WORK, WORK, WORK, WORK, MOVE],
            'mine_t3', 2, roleMiner),
        modRole.createRole([MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY,
            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY
    ], 'haul_t3', 4, roleHauler),
        modRole.createRole([MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK,
            WORK, WORK, CARRY, CARRY
        ], 'up_t3', 3, roleUpgrader),
        modRole.createRole([MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK,
            WORK, WORK, CARRY, CARRY, CARRY
        ], 'build_t3', 3, roleBuilder)
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
        for (var indexCreep in role.creeps) {
            role.creeps[indexCreep].memory.number = indexCreep;
        }
        if (Memory.roleCounts == null) {
            Memory.roleCounts = {};
        }
        Memory.roleCounts[role.name] = role.creeps.length;
    }

    if (Memory.sources == null) {
        Memory.sources = [];
    }

    var tempSources = [];

    for (var indexSpawn in Game.spawns) {
        var spawn = Game.spawns[indexSpawn];

        Memory.creepsReady = spawn.room.energyAvailable == spawn.room.energyCapacityAvailable;

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
