var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');

    // var basicBody = [WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
    var basicBody = [WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];

    for (var i in Game.spawns) {
        var spawn = Game.spawns[i];

        var role = "harvester";

        // if((builders.length < 2 || builders.length < (harvesters.length + upgraders.length)) && upgraders.length > 0 && harvesters.length > 0) {
        if(builders.length < 2) {
            role = 'builder';
        }

        // if((upgraders.length < 2 || upgraders.length < (builders.length) || upgraders.length < harvesters.length) && harvesters.length > 0) {
        if(upgraders.length < 2) {
            role = 'upgrader';
        }

        // if(harvesters.length < 8 || harvesters.length < (upgraders.length)) {
        if(harvesters.length < 5) {
            role = 'harvester';
        }

        if(spawn.canCreateCreep(basicBody) == OK) {
            if(role == 'builder') {
                var newName = spawn.createCreep(basicBody, undefined, {role: 'builder'});
                console.log('Spawning new builders: ' + newName);
            } else if (role == 'upgrader') {
                var newName = spawn.createCreep(basicBody, undefined, {role: 'upgrader'});
                console.log('Spawning new upgraders: ' + newName);
            } else if (role == 'harvester') {
                var newName = spawn.createCreep(basicBody, undefined, {role: 'harvester'});
                console.log('Spawning new harvester: ' + newName);
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

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}
