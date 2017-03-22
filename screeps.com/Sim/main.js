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

    var basicBody = [WORK,CARRY,MOVE,MOVE];

    for (var i in Game.spawns) {
        var spawn = Game.spawns[i];
        
        // || builders.length < (harvesters.length + upgraders.length))
        if((builders.length < 10 || true) && upgraders.length > 0 && harvesters.length > 0) {
            if(spawn.canCreateCreep(basicBody) == OK) {
                var newName = spawn.createCreep(basicBody, undefined, {role: 'builder'});
                console.log('Spawning new builders: ' + newName);
            }
        }
        
        // || upgraders.length < (builders.length)
        if((upgraders.length < 2) && harvesters.length > 0) {
            if(spawn.canCreateCreep(basicBody) == OK) {
                var newName = spawn.createCreep(basicBody, undefined, {role: 'upgrader'});
                console.log('Spawning new upgraders: ' + newName);
            }
        }

        // || harvesters.length < (upgraders.length)
        if(harvesters.length < 10 || harvesters.length < builders.length) {
            if(spawn.canCreateCreep(basicBody) == OK) {
                var newName = spawn.createCreep(basicBody, undefined, {role: 'harvester'});
                console.log('Spawning new harvester: ' + newName);
            }
        }
    }




    var tower = Game.getObjectById('TOWER_ID');
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
