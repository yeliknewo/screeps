var roleBuilder = {
    /** @param {Creep} creep **/
    run: function(creep) {
        var pathColor = '#ff0000';
        if (creep.memory.building && creep.carry.energy == 0 && Memory
            .creepsReady == true) {
            creep.memory.building = false;
            creep.say('Withdraw');
            creep.memory.target = null;
            creep.memory.waiting = false;
        }
        if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('🚧 Build');
            creep.memory.target = null;
            creep.memory.waiting = false;
        }
        if (creep.memory.waiting) {
            creep.memory.waiting = !Memory.creepsReady;
            creep.moveTo(creep.pos.findClosestByPath(FIND_FLAGS));
        } else if (creep.memory.building) {
            var target = Game.getObjectById(creep.memory.target);
            if (target == null) {
                var targets = creep.room.find(
                    FIND_STRUCTURES, {
                        filter: (structure) => {
                            return structure.hits < Math.max(
                                structure.hitsMax -
                                5000, structure.hitsMax /
                                2) && (structure.structureType ==
                                STRUCTURE_CONTAINER ||
                                structure.structureType ==
                                STRUCTURE_ROAD);
                        }
                    }
                );
                targets.sort((a, b) => {
                    return a.hits / a.hitsMax - b.hits /
                        b.hitsMax + (a.pos
                            .getRangeTo(
                                creep) -
                            b.pos.getRangeTo(creep)) / 100.0;
                });
                if (targets.length > 0) {
                    var index = 0;
                    target = targets[index];
                    creep.memory.target = target.id;
                }
            }
            if (target == null) {
                var newTarget = creep.pos.findClosestByPath(
                    FIND_CONSTRUCTION_SITES);
                if (newTarget != null) {
                    creep.memory.target = newTarget.id;
                    target = newTarget;
                }
            }
            if (target == null) {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.hits <
                            10000 && (structure.structureType ==
                                STRUCTURE_RAMPART);
                    }
                });
                targets.sort((a, b) => {
                    return a.hits / a.hitsMax - b.hits /
                        b.hitsMax;
                });
                if (targets.length > 0) {
                    var index = 0;
                    target = targets[index];
                    creep.memory.target = target.id;
                }
            }
            if (target == null) {
                var targets = creep.room.find(
                    FIND_STRUCTURES, {
                        filter: (structure) => {
                            return structure.hits <
                                structure.hitsMax;
                        }
                    }
                );
                targets.sort((a, b) => {
                    return a.hits / a.hitsMax - b.hits /
                        b.hitsMax;
                });
                if (targets.length > 0) {
                    var index = 0;
                    target = targets[index];
                    creep.memory.target = target.id;
                }
            }
            if (target != null) {
                if (target.progress != null) {
                    if (creep.build(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {
                            visualizePathStyle: {
                                stroke: pathColor
                            }
                        });
                    }
                } else if (target.hits == target.hitsMax) {
                    creep.memory.target = null;
                } else {
                    var error = creep.repair(target);
                    if (error == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {
                            visualizePathStyle: {
                                stroke: pathColor
                            }
                        });
                    }
                }
            }
        } else {
            var target = Game.getObjectById(creep.memory.target);
            if (target == null || (target.energy != null && target.energy <=
                    creep.carryCapacity - creep.carry.energy) || (
                    target.store != null && target.store[
                        RESOURCE_ENERGY] <= creep.carryCapacity - creep
                    .carry.energy)) {
                var newTarget = creep.pos.findClosestByPath(
                    FIND_STRUCTURES, {
                        filter: (structure) => {
                            return ((structure.structureType ==
                                    STRUCTURE_CONTAINER ||
                                    structure.structureType ==
                                    STRUCTURE_STORAGE) &&
                                structure.store[
                                    RESOURCE_ENERGY] >
                                creep.carryCapacity - creep
                                .carry.energy) || ((
                                    structure.structureType ==
                                    STRUCTURE_LINK) &&
                                structure.energy > 0); //creep.carryCapacity - creep.carry.energy
                            //    ||
                            //    structure.structureType ==
                            //    STRUCTURE_SPAWN ||
                            //    structure.structureType ==
                            //    STRUCTURE_EXTENSION
                        }
                    });
                if (newTarget != null) {
                    creep.memory.target = newTarget.id;
                    target = newTarget;
                } else {
                    creep.memory.target = null;
                    target = null;
                }
            }
            if (target != null) {
                if (creep.withdraw(target, RESOURCE_ENERGY) ==
                    ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {
                        visualizePathStyle: {
                            stroke: pathColor
                        }
                    });
                }
            }
            if (target == null) {
                if (creep.carry.energy > 0) {
                    creep.memory.building = true;
                    creep.say('🚧 Build');
                    creep.memory.target = null;
                } else {
                    creep.memory.waiting = !Memory.creepsReady;
                }
            }
        }
    }
};

module.exports = roleBuilder;
