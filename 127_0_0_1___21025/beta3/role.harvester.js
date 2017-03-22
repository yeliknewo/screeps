var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.transfering && creep.carry.energy == 0) {
            creep.memory.transfering = false;
            creep.say('🔄 harvest');
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
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                    }
                });
                if(newTarget != null) {
                    creep.memory.target = newTarget.id;
                    target = Game.getObjectById(creep.memory.target);
                }
            }
            if(target != null) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        } else {
            var target = Game.getObjectById(creep.memory.target);
            if(target == null || target.energy == 0) {
                var sources = creep.room.find(FIND_SOURCES, {
                    filter: (source) => {
                        return (source.energy > 0)
                    }
                });
                if(sources.length > 0) {
                    var index = Game.time % sources.length;
                    creep.memory.target = sources[index].id;
                    target = Game.getObjectById(creep.memory.target);
                }
            }
            if(target != null) {
                if(creep.harvest(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
    }
};

module.exports = roleHarvester;
