var roleMod = require('role');

var roleHarvester = require('role.harvester');
// var roleUpgrader = require('role.upgrader');
// var roleBuilder = require('role.builder');
var roleSoldier = require('role.soldier');

var roleSBuilder = require('role.sbuilder');
var roleSUpgrader = require('role.supgrader');

module.exports.loop = function () {
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    Memory.roles = [
        roleMod.createRole([WORK,CARRY,MOVE], "t1_miner", 0, roleHarvester),
        roleMod.createRole([WORK,CARRY,MOVE], "t1_upgrader", 0, roleSUpgrader),
        roleMod.createRole([WORK,CARRY,MOVE], "t1_builder", 0, roleSBuilder),
        roleMod.createRole([TOUGH,TOUGH,ATTACK,MOVE,MOVE,MOVE],"t1_soldier", 0, roleSoldier),
        roleMod.createRole([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE], "t2_miner", 0, roleHarvester),
        roleMod.createRole([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE], "t2_upgrader", 0, roleSUpgrader),
        roleMod.createRole([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE], "t2_builder", 0, roleSBuilder),
        roleMod.createRole([TOUGH,TOUGH,TOUGH,TOUGH,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], "t2_soldier", 0, roleSoldier),
        roleMod.createRole([WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], "t3_miner", 6, roleHarvester),
        roleMod.createRole([WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], "t3_upgrader", 6, roleSUpgrader),
        roleMod.createRole([WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], "t3_builder", 0, roleSBuilder),
        roleMod.createRole([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], "t3_soldier", 0, roleSoldier),
        roleMod.createRole([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], "t4_soldier", 0, roleSoldier)
    ];

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
                spawn.createCreep(role.body, undefined, {role: role.name});
                console.log("Spawning " + role.name);
            }
        }
    }

    Memory.creepsReady = true;
    for(var roleIndex in Memory.roles) {
        var role = Memory.roles[roleIndex];
        if(role.creeps.length < role.targetCount) {
            Memory.creepsReady = false;
        }
        for(var creepIndex in role.creeps) {
            var creep = role.creeps[creepIndex];
            if(creep.ticksToLive < 50) {
                Memory.creepsReady = false;
                break;
            }
        }
    }

    for(var index in Game.structures) {
        var structure = Game.structures[index];
        if(structure.structureType == STRUCTURE_TOWER) {
            var closestHostile = structure.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile) {
                structure.attack(closestHostile);
            } else {
                var closestHurtFriendly = structure.pos.findClosestByRange(FIND_MY_CREEPS, {
                    filter: (creep) => {
                        return creep.hits < creep.hitsMax;
                    }
                });
                if(closestHurtFriendly) {
                    structure.heal(closestHurtFriendly);
                } else {
                    var damagedStructures = structure.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return structure.hits + 20 < structure.hitsMax && structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_RAMPART;
                        }
                    });
                    if(damagedStructures.length > 0) {
                        var index = Game.time % damagedStructures.length;
                        structure.repair(damagedStructures[index]);
                    } else {
                        var damagedStructures = structure.room.find(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return structure.hits + 20 < structure.hitsMax && structure.structureType == STRUCTURE_RAMPART;
                            }
                        });
                        if(damagedStructures.length > 0) {
                            var index = Game.time % damagedStructures.length;
                            structure.repair(damagedStructures[index]);
                        } else {
                            var damagedStructures = structure.pos.findClosestByRange(FIND_STRUCTURES, {
                                filter: (structure) => {
                                    return structure.hits + 20 < structure.hitsMax && structure.hits < 10000;
                                }
                            });
                            if(damagedStructures.length > 0) {
                                var index = Game.time % damagedStructures.length;
                                structure.repair(damagedStructures[index]);
                            } else {
                                var damagedStructures = structure.room.find(FIND_STRUCTURES, {
                                    filter: (structure) => structure.hits < structure.hitsMax
                                });
                                if(damagedStructures.length > 0) {
                                    var index = Game.time % damagedStructures.length;
                                    structure.repair(damagedStructures[index]);
                                }
                            }
                        }
                    }
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
