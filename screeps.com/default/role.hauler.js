var roleHauler = {
    /** @param {Creep} creep **/
    run: function(creep) {
        var pathColor = '#00FF00';
        if (creep.memory.transfering && creep.carry.energy == 0 ||
            creep.memory.transfering == null) {
            creep.memory.transfering = false;
            creep.say('Pickup');
            creep.memory.target = null;
        }
        if (!creep.memory.transfering && creep.carry.energy == creep.carryCapacity) {
            creep.memory.transfering = true;
            creep.say('Transfer');
            creep.memory.target = null;
        }
        if (creep.memory.transfering) {
            var target = Game.getObjectById(creep.memory.target);
            if (target != null && ((target.energy != null && target.energy <=
                    creep.carryCapacity - creep.carry.energy) || (
                    target.store != null && target.store[
                        RESOURCE_ENERGY] <= creep.carryCapacity -
                    creep
                    .carry.energy))) {
                target = null;
            }
            if (target == null) {
                var targetRequester = creep.pos.findClosestByPath(
                    FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType ==
                                    STRUCTURE_SPAWN ||
                                    structure.structureType ==
                                    STRUCTURE_EXTENSION) &&
                                structure.energy < structure.energyCapacity;
                        }
                    }
                );
                if (targetRequester != null) {
                    target = targetRequester;
                    creep.memory.target = targetRequester.id;
                }
            }
            if (target == null) {
                var targetRequester = creep.pos.findClosestByPath(
                    FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType ==
                                    STRUCTURE_TOWER &&
                                    structure.energy <
                                    structure.energyCapacity
                                ) ||
                                ((structure.structureType ==
                                        STRUCTURE_CONTAINER) &&
                                    _.sum(structure.store) <
                                    structure.storeCapacity);
                        }
                    }
                );
                if (targetRequester != null) {
                    target = targetRequester;
                    creep.memory.target = targetRequester.id;
                }
            }
            if (target == null) {
                var targetRequester = creep.pos.findClosestByPath(
                    FIND_STRUCTURES, {
                        filter: (structure) => {
                            return
                            structure.structureType ==
                                STRUCTURE_STORAGE &&
                                _.sum(structure.store) <
                                structure.storeCapacity;
                        }
                    }
                );
                if (targetRequester != null) {
                    target = targetRequester;
                    creep.memory.target = targetRequester.id;
                }
            }
            if (target != null) {
                var result = creep.transfer(targetRequester,
                    RESOURCE_ENERGY);
                if (result == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targetRequester, {
                        visualizePathStyle: {
                            stroke: pathColor
                        }
                    });
                } else if (result == ERR_INVALID_TARGET) {
                    creep.memory.target = null;
                } else if (result != OK) {
                    console.log(result);
                }
            }
        } else {
            var target = Game.getObjectById(creep.memory.target);
            if (target == null) {
                var targetDropped = creep.pos.findClosestByPath(
                    FIND_DROPPED_RESOURCES, {
                        filter: (resource) => {
                            return resource.resourceType ==
                                RESOURCE_ENERGY;
                        }
                    }
                );
                if (targetDropped != null) {
                    target = targetDropped;
                    creep.memory.target = targetDropped.id;
                }
            }
            if (target != null) {
                var result = creep.pickup(target);
                if (result == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {
                        visualizePathStyle: {
                            stroke: pathColor
                        }
                    });
                } else if (result == ERR_INVALID_TARGET) {
                    creep.memory.target = null;
                } else if (result != OK && result != ERR_BUSY) {
                    console.log(result);
                }
            }
        }
    }
};

module.exports = roleHauler;
