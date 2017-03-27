var roleMod = require('role');

var roleMiner = require('role.miner');
var rolePowerMiner = require('role.powerMiner');
var roleHauler = require('role.hauler');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleSoldier = require('role.soldier');

module.exports.loop = function () {
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    Memory.roles = [
        roleMod.createRole([WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE], "t1_power_miner", 1, rolePowerMiner),
        roleMod.createRole([WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE], "t2_power_miner", 0, rolePowerMiner),
        roleMod.createRole([WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE], "t3_power_miner", 0, rolePowerMiner),
        roleMod.createRole([WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE], "t4_power_miner", 0, rolePowerMiner),
        roleMod.createRole([CARRY,CARRY,MOVE], "t1_hauler", 1, roleHauler),
        roleMod.createRole([CARRY,CARRY,CARRY,CARRY,MOVE,MOVE], "t2_hauler", 0, roleHauler),
        roleMod.createRole([CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], "t3_hauler", 0, roleHauler),
        roleMod.createRole([CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], "t4_hauler", 1, roleHauler),
        roleMod.createRole([WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE], "t1_power_upgrader", 1, roleUpgrader),
        roleMod.createRole([WORK,CARRY,MOVE], "t1_miner", 0, roleMiner),
        roleMod.createRole([WORK,CARRY,MOVE,MOVE], "t1_miner_ld", 0, roleMiner, {
            longDistance: true,
            globalIndex: 1
        }),
        roleMod.createRole([WORK,CARRY,MOVE], "t1_upgrader", 0, roleUpgrader),
        roleMod.createRole([WORK,CARRY,MOVE], "t1_builder", 0, roleBuilder),
        roleMod.createRole([TOUGH,TOUGH,ATTACK,MOVE,MOVE,MOVE],"t1_soldier", 0, roleSoldier),
        roleMod.createRole([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE], "t2_miner", 0, roleMiner),
        roleMod.createRole([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE], "t2_upgrader", 0, roleUpgrader),
        roleMod.createRole([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE], "t2_builder", 1, roleBuilder),
        roleMod.createRole([TOUGH,TOUGH,TOUGH,TOUGH,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], "t2_soldier", 0, roleSoldier),
        roleMod.createRole([WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], "t3_miner", 0, roleMiner),
        roleMod.createRole([WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], "t3_upgrader", 0, roleUpgrader),
        roleMod.createRole([WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], "t3_builder", 0, roleBuilder),
        roleMod.createRole([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], "t3_soldier", 0, roleSoldier),
        roleMod.createRole([WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE], "t4_miner", 0, roleMiner),
        roleMod.createRole([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], "t4_upgrader", 0, roleUpgrader),
        roleMod.createRole([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], "t4_builder", 0, roleBuilder),
        roleMod.createRole([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], "t4_soldier", 0, roleSoldier),
        roleMod.createRole([TOUGH,TOUGH,TOUGH,TOUGH,ATTACK,ATTACK,RANGED_ATTACK,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], "t1_ranger", 0, roleSoldier)
    ];

    Memory.globalSources = [new RoomPosition(11, 25, "W5N8"), new RoomPosition(14, 13, "W5N8")];

    Memory.roleIndexer = {};

    for(var i = 0; i < Memory.roles.length; i++) {
        var role = Memory.roles[i];
        Memory.roleIndexer[role.name] = i;
    }

    for(var roleIndex in Memory.roles) {
        var role = Memory.roles[roleIndex];
        role.creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role.name);
        if(Memory.roleCounts == null) {
            Memory.roleCounts = {};
        }
        Memory.roleCounts[role.name] = role.creeps.length;
    }

    for (var i in Game.spawns) {
        var spawn = Game.spawns[i];

        var roleIndex = -1;

        for(var index in Memory.roles) {
            var role = Memory.roles[index];
            if(role.creeps.length < role.targetCount) {
                roleIndex = index;
                break;
            }
        }

        if(roleIndex != -1) {
            var role = Memory.roles[roleIndex];
            if(spawn.canCreateCreep(role.body) == OK) {
                spawn.createCreep(role.body, undefined, {role: role.name, data: role.data});
                console.log("Spawning " + role.name);
            }
        }
    }

    for(var roomIndex in Game.rooms) {
        var room = Game.rooms[roomIndex];
        var storages = room.find(FIND_MY_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY] > 2000;
            }
        });
        if(storages.length > 0) {
            Memory.creepsReady = true;
        } else {
            Memory.creepsReady = false;
        }
    }

    for(var index in Game.structures) {
        var structure = Game.structures[index];
        if(structure.structureType == STRUCTURE_TOWER) {
            var closestHostile = structure.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile) {
                structure.attack(closestHostile);
            } else if(structure.energy >= 600) {
                var closestHurtFriendly = structure.pos.findClosestByRange(FIND_MY_CREEPS, {
                    filter: (creep) => {
                        return creep.hits < creep.hitsMax;
                    }
                });
                if(closestHurtFriendly) {
                    structure.heal(closestHurtFriendly);
                } else if(structure.energy >= 800) {
                    var damagedStructures = structure.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return structure.hits <= Math.min(structure.hitsMax / 4, 2000) && structure.hits < structure.hitsMax;
                        }
                    });
                    damagedStructures.sort(function(a, b) {
                        return a.hits - b.hits;
                    });
                    if(damagedStructures.length > 0) {
                        var index = 0;
                        // var index = Game.time % damagedStructures.length;
                        structure.repair(damagedStructures[index]);
                    }
                }
            }
        } else if(structure.structureType == STRUCTURE_LINK) {
            if(structure.cooldown <= 0) {
                var others = structure.room.find(FIND_MY_STRUCTURES, {
                    filter: (link) => {
                        return link.structureType == STRUCTURE_LINK && link.id != structure.id && link.energy < structure.energy * 0.90;
                    }
                });
                if(others.length > 0) {
                    var index = 0;
                    var target = others[index];
                    var average = (structure.energy + target.energy) / 2;
                    // console.log(average  - target.energy);
                    structure.transferEnergy(target, average - target.energy);
                }
            }
        }
    }

    for(var roleIndex in Memory.roles) {
        var role = Memory.roles[roleIndex];
        for(var creepIndex = 0; creepIndex < role.creeps.length; creepIndex++) {
            var creep = role.creeps[creepIndex];
            role.roleModule.run(creep);
        }
    }
}
