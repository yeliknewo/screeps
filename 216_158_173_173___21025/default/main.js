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

    var miningTarget = 2;
    var haulingTarget = 4;
    var upgradingTarget = 3;
    var buildingTarget = 3;

    var basicMiningTier = 'mine_t1';
    var basicHaulingTier = 'haul_t1';

    var currentMiningTier = 'mine_t3';
    var currentHaulingTier = 'haul_t3';

    Memory.roles = [
        modRole.createRole([WORK, WORK, MOVE],
            'mine_t1', 0, roleMiner),
        modRole.createRole([CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
            'haul_t1', 0,
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
            'mine_t3', miningTarget, roleMiner),
        modRole.createRole([CARRY, CARRY,
            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
            MOVE, MOVE, MOVE, MOVE, MOVE
        ], 'haul_t3', haulingTarget, roleHauler),
        modRole.createRole([WORK, WORK, WORK,
            WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE
        ], 'up_t3', upgradingTarget, roleUpgrader),
        modRole.createRole([WORK,
            WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE
        ], 'build_t3', buildingTarget, roleBuilder)
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

    if (Memory.roleCounts[currentMiningTier] < 0 || Memory.roleCounts[
            currentHaulingTier] == 0) {
        Memory.roles[Memory.indexerRole[basicMiningTier]].targetCount = 1;
        Memory.roles[Memory.indexerRole[basicHaulingTier]].targetCount = 1;
    }

    if (Memory.sources == null) {
        Memory.sources = [];
    }

    var tempSources = [];

    for (var indexSpawn in Game.spawns) {
        var spawn = Game.spawns[indexSpawn];

        Memory.creepsReady = spawn.room.energyAvailable == spawn.room.energyCapacityAvailable ||
            (spawn.room.storage != null && spawn.room.storage.store[
                RESOURCE_ENERGY] > 0);

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

    for (var index in Game.structures) {
        var structure = Game.structures[index];
        if (structure.structureType == STRUCTURE_TOWER) {
            var closestHostile = structure.pos.findClosestByRange(
                FIND_HOSTILE_CREEPS);
            if (closestHostile) {
                structure.attack(closestHostile);
            } else if (structure.energy >= 600) {
                var closestHurtFriendly = structure.pos.findClosestByRange(
                    FIND_MY_CREEPS, {
                        filter: (creep) => {
                            return creep.hits < creep.hitsMax;
                        }
                    });
                if (closestHurtFriendly) {
                    structure.heal(closestHurtFriendly);
                } else if (structure.energy >= 800) {
                    var damagedStructures = structure.room.find(
                        FIND_STRUCTURES, {
                            filter: (structure) => {
                                return structure.hits <= Math.min(
                                        structure.hitsMax / 4, 2000
                                    ) && structure.hits < structure
                                    .hitsMax;
                            }
                        });
                    damagedStructures.sort(function(a, b) {
                        return a.hits - b.hits;
                    });
                    if (damagedStructures.length > 0) {
                        var index = 0;
                        // var index = Game.time % damagedStructures.length;
                        structure.repair(damagedStructures[index]);
                    }
                }
            }
        }
    }
}
