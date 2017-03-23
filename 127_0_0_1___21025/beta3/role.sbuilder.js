var roleSBuilder = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.building && creep.carry.energy == 0 && Memory.creepsReady) {
            creep.memory.building = false;
            creep.say('Withdraw');
            creep.memory.target = null;
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('🚧 Build');
            creep.memory.target = null;
        }
        if(creep.memory.building) {
            var target = Game.getObjectById(creep.memory.target);
            if(target == null || target.hits == target.hitsMax) {
                var newTarget = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                if(newTarget != null) {
                    creep.memory.target = newTarget.id;
                    target = newTarget;
                }
            }
            if(target != null && target.progress != null) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffff00'}});
                if(creep.build(target) == ERR_NOT_IN_RANGE) {

                }
            } else {
                var target = Game.getObjectById(creep.memory.target);
                if(target == null) {
                    var newTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return structure.hits < 10000 && structure.hits + 20 < structure.hitsMax;
                        }
                    });
                    if(newTarget != null) {
                        creep.memory.target = newTarget.id;
                        target = newTarget;
                    } else {
                        var newTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return structure.hits < structure.hitsMax;
                            }
                        });
                        if(newTarget != null) {
                            creep.memory.target = newTarget.id;
                            target = newTarget;
                        }
                    }
                }
                if(target != null) {
                    if(target.hits == target.hitsMax) {
                        creep.memory.target = null;
                    } else {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffff00'}});
                        var error = creep.repair(target);
                        if(error != OK) {
                            // console.log(error);
                        }
                    }
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
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffff00'}});
                if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {

                }
            }
        }
    }
};

module.exports = roleSBuilder;
