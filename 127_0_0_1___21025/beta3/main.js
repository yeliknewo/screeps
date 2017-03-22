var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleSoldier = require('role.soldier');
var roleMod = require('role');

module.exports.loop = function () {
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    var roles = [
        roleMod.createRole([WORK,CARRY,MOVE], "slave", 0, roleHarvester),
        roleMod.createRole([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE],"harvester", 3, roleHarvester),
        roleMod.createRole([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE],"upgrader", 3, roleUpgrader),
        roleMod.createRole([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE],"builder", 1, roleBuilder),
        roleMod.createRole([TOUGH,TOUGH,ATTACK,MOVE,MOVE,MOVE],"soldier", 0, roleSoldier),
        roleMod.createRole([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], "god", 1, roleSoldier)
    ];

    for(var roleIndex in roles) {
        var role = roles[roleIndex];
        role.creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role.name);
        if(Memory.roleCounts == null) {
            Memory.roleCounts = {};
        }
        Memory.roleCounts[role.name] = role.creeps.length;
        if(Memory.roles == null) {
            Memory.roles = {};
        }
        Memory.roles[role.name] = role.creeps;
    }

    for (var i in Game.spawns) {
        var spawn = Game.spawns[i];

        var roleIndex = -1;

        for(var index in roles) {
            var role = roles[index];
            if(role.creeps.length < role.targetCount) {
                roleIndex = index;
                break;
            }
        }

        if(roleIndex != -1) {
            var role = roles[roleIndex];
            if(spawn.canCreateCreep(role.body) == OK) {
                spawn.createCreep(role.body, undefined, {role: role.name});
                console.log("Spawning " + role.name);
            }
        }
    }

    // var tower = undefined;
    var tower = Game.getObjectById('330bfbb5d1deacb');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }

    for(var roleIndex in roles) {
        var role = roles[roleIndex];
        for(var creepIndex = 0; creepIndex < role.creeps.length; creepIndex++) {
            var creep = role.creeps[creepIndex];
            role.roleModule.run(creep);
        }
    }
}
