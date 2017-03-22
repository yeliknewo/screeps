var roleMiner = require('role.miner');
var roleBuilder = require('role.builder');
var roleUpgrader = require('role.upgrader');
var roleSoldier = require('role.soldier');

module.exports.loop = function () {
    
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    var tower = Game.getObjectById('07fe75f974697791c82701f4');
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
    
    
    var miners = 0; //store in global memory?
    var builders = 0;
    var upgraders = 0;
    var soldiers = 0;
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'miner') {
            miners += 1;
            roleMiner.run(creep);
        }
        if(creep.memory.role == 'builder') {
            builders += 1;
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            upgraders += 1;
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'soldier') {
            soldiers += 1;
            roleSoldier.run(creep);
        }
    }
    if(miners < 2) {
        Game.spawns['Spawn1'].createCreep([WORK, CARRY, MOVE], null, {role: 'miner', sourceIndex: 0});
    }
    else if(miners < 10) {
        Game.spawns['Spawn1'].createCreep([WORK, CARRY, MOVE], null, {role: 'miner', sourceIndex: 1});
    }
    else if(builders < 2) {
        Game.spawns['Spawn1'].createCreep([WORK, CARRY, MOVE], null, {role: 'builder'});
    }
    else if(upgraders < 3) {
        Game.spawns['Spawn1'].createCreep([WORK, CARRY, MOVE], null, {role: 'upgrader'});
    }
    else if(soldiers < 6) {
        Game.spawns['Spawn1'].createCreep([MOVE, ATTACK], null, {role: 'soldier'});
    }
    
}
