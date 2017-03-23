var roleSUpgrader = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.upgrading && creep.carry.energy == 0 && Memory.creepsReady) {
            creep.memory.upgrading = false;
            creep.say('Withdraw');
            creep.memory.target = null;
        }
        if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('⚡ Upgrade');
            creep.memory.target = null;
        }
        if(creep.memory.upgrading) {
            var target = Game.getObjectById(creep.memory.target);
            if(target == null) {
                var newTarget = creep.room.controller;
                if(newTarget != null) {
                    creep.memory.target = newTarget.id;
                    target = newTarget;
                }
            }
            if(target != null) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#0000ff'}});
                if(creep.upgradeController(target) == ERR_NOT_IN_RANGE) {

                }
            }
        } else {
            var target = Game.getObjectById(creep.memory.target);
            if(target == null || target.energy <= 10) {
                var newTarget = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_TOWER) && structure.energy > 10;
                    }
                });
                if(newTarget != null) {
                    creep.memory.target = newTarget.id;
                    target = newTarget;
                }
            }
            if(target != null) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#0000ff'}});
                if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {

                }
            }
        }
    }
};

module.exports = roleSUpgrader;
