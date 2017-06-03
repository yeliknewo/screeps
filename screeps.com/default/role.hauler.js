var roleHauler = {
    /** @param {Creep} creep **/
    run: function(creep) {
        var pathColor = '#00FF00';
        if (creep.memory.transfering && creep.carry.energy == 0 ||
            creep.memory.transfering == null) {
            creep.memory.transfering = false;
            creep.say('Pickup');
        }
        if (!creep.memory.transfering && creep.carry.energy == creep.carryCapacity) {
            creep.memory.transfering = true;
            creep.say('Transfer');
        }
        if (creep.memory.transfering) {
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
                var result = creep.transfer(targetRequester,
                    RESOURCE_ENERGY);
                if (result == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targetRequester, {
                        visualizePathStyle: {
                            stroke: pathColor
                        }
                    });
                } else if (result != OK) {
                    console.log(result);
                }
            } else {
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
                if (targetRequester == null) {
                    targetRequester = creep.pos.findClosestByPath(
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
                }
                if (targetRequester != null) {
                    var result = creep.transfer(targetRequester,
                        RESOURCE_ENERGY);
                    if (result == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targetRequester, {
                            visualizePathStyle: {
                                stroke: pathColor
                            }
                        });
                    } else if (result != OK) {
                        console.log(result);
                    }
                }
            }
        } else {
            var targetDropped = creep.pos.findClosestByPath(
                FIND_DROPPED_RESOURCES, {
                    filter: (resource) => {
                        return resource.resourceType ==
                            RESOURCE_ENERGY;
                    }
                }
            );
            if (targetDropped != null) {
                if (creep.pickup(targetDropped) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targetDropped, {
                        visualizePathStyle: {
                            stroke: pathColor
                        }
                    });
                }
            }
        }
    }
};

module.exports = roleHauler;
