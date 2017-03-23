var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.transfering && creep.carry.energy == 0) {
            creep.memory.transfering = false;
            creep.say('🔄 Mine');
            creep.memory.target = null;
        }
        if(!creep.memory.transfering && creep.carry.energy == creep.carryCapacity) {
            creep.memory.transfering = true;
            creep.say('Transfer');
            creep.memory.target = null;
        }
        if(creep.memory.transfering) {
            var target = Game.getObjectById(creep.memory.target);
            if(target == null || target.energy == target.energyCapacity) {
                var newTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
                    }
                });
                if(newTarget != null) {
                    creep.memory.target = newTarget.id;
                    target = Game.getObjectById(creep.memory.target);
                } else {
                    var newTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity;
                        }
                    });
                    if(newTarget != null) {
                        creep.memory.target = newTarget.id;
                        target = Game.getObjectById(creep.memory.target);
                    }
                }
            }
            if(target != null) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#00ffff'}});
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {

                }
            }
        } else {
            var target = Game.getObjectById(creep.memory.target);
            if(target == null || target.energy == 0) {
                var newTarget = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY);
                if(newTarget != null) {
                    creep.memory.target = newTarget.id;
                    target = newTarget;
                }
            }
            if(target != null && target.resourceType != null) {
                if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#00ffff'}});
                }
            } else {
                if(target == null || target.energy == 0) {
                    var newTarget = creep.pos.findClosestByPath(FIND_SOURCES, {
                        filter: (source) => {
                            return (source.energy > 0)
                        }
                    });
                    if(newTarget != null) {
                        creep.memory.target = newTarget.id;
                        target = newTarget;
                    }
                }
                if(target != null) {
                    if(creep.harvest(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#00ffff'}});
                    }
                }
            }
        }
    }
};

module.exports = roleHarvester;
