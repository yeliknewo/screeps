var roleHauler = {
    /** @param {Creep} creep **/
    run: function(creep) {
        var pathColor = "#00FF00";
        if(creep.memory.transfering && creep.carry.energy == 0) {
            creep.memory.transfering = false;
            creep.say("Withdraw");
        }
        if(!creep.memory.transfering && creep.carry.energy == creep.carryCapacity) {
            creep.memory.transfering = true;
            creep.say("Transfer");
        }
        if(creep.memory.store == null) {
            var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_STORAGE;
                }
            });
            if(target != null) {
                creep.memory.store = target.id;
            }
        }
        if(creep.memory.transfering) {
            var requester = Game.getObjectById(creep.memory.requester);
            if(creep.memory.requester == null || requester == null || requester.energy == requester.energyCapacity) {
                var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION) && structure.energy < structure.energyCapacity;
                    }
                });
                if(target != null) {
                    creep.memory.requester = target.id;
                } else {
                    target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                        filter: (structure) => {
                            return structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity;
                        }
                    });
                    if(target != null) {
                        creep.memory.requester = target.id;
                    } else {
                        target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return (structure.structureType == STRUCTURE_CONTAINER && _.sum(structure.store) + creep.carry.energy <= structure.storeCapacity) || (structure.structureType == STRUCTURE_LINK && structure.energy + creep.carry.energy <= structure.energyCapacity);
                            }
                        });
                        if(target != null) {
                            creep.memory.requester = target.id;
                        } else {
                            creep.memory.requester = null;
                        }
                    }
                }
            }
            if(creep.memory.requester != null) {
                var target = Game.getObjectById(creep.memory.requester);
                if(target != null) {
                    var result = creep.transfer(target, RESOURCE_ENERGY);
                    if(result == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: pathColor}});
                    }
                } else {
                    creep.memory.requester = null;
                }
            } else {
                if(creep.carry.energy < creep.carryCapacity) {
                    creep.memory.transfering = false;
                }
            }
        } else {
            if(creep.memory.pickup == null) {
                var target = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY, {
                    filter: (resource) => {
                        return resource.resourceType == RESOURCE_ENERGY;
                    }
                });
                if(target != null) {
                    creep.memory.pickup = target.id;
                }
            }
            if(creep.memory.pickup != null) {
                var target = Game.getObjectById(creep.memory.pickup);
                if(target != null) {
                    var result = creep.pickup(target);
                    if(result == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: pathColor}});
                    }
                } else {
                    creep.memory.pickup = null;
                }
            } else {
                if(creep.memory.store != null) {
                    var target = Game.getObjectById(creep.memory.store);
                    if(target != null) {
                        var result = creep.withdraw(target, RESOURCE_ENERGY);
                        if(result == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target, {visualizePathStyle: {stroke: pathColor}});
                        }
                    } else {
                        creep.memory.store = null;
                    }
                } else {
                    console.log("Hauler: Room has no Store");
                }
            }
        }
    }
};

module.exports = roleHauler;
