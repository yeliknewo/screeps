var roleUpgrader = {
    /** @param {Creep} creep **/
    run: function(creep) {
        var pathColor = '#0000FF';
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
                if(creep.upgradeController(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: pathColor}});
                }
            }
        } else {
            var target = Game.getObjectById(creep.memory.target);
            if(target == null || (target.energy != null && target.energy <= creep.carryCapacity - creep.carry.energy) || (target.store != null && target.store[RESOURCE_ENERGY] <= creep.carryCapacity - creep.carry.energy)) {
                var newTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ((structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && structure.store[RESOURCE_ENERGY] >= creep.carryCapacity - creep.carry.energy) || ((structure.structureType == STRUCTURE_LINK) && structure.energy >= creep.carryCapacity - creep.carry.energy);
                    }
                });
                if(newTarget != null) {
                    creep.memory.target = newTarget.id;
                    target = newTarget;
                } else {
                    creep.memory.target = null;
                    target = null;
                }
            }
            if(target != null) {
                if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: pathColor}});
                }
            }
            if(target == null && creep.carry.energy > 0) {
                creep.memory.upgrading = true;
                creep.say('⚡ Upgrade');
                creep.memory.target = null;
            }
        }
    }
};

module.exports = roleUpgrader;
