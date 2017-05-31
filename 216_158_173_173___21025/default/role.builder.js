var roleBuilder = {
    /** @param {Creep} creep **/
    run: function(creep) {
        var pathColor = '#00FFFF';
        if (creep.memory.building && creep.carry.energy == 0 && Memory.creepsReady ==
            true) {
            creep.memory.building = false;
            creep.say('Withdraw');
            creep.memory.target = null;
        }
        if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('🚧 Build');
            creep.memory.target = null;
        }
        if (creep.memory.building) {
            var target = Game.getObjectById(creep.memory.target);
            if (target == null || target.hits == target.hitsMax) {
                var newTarget = creep.pos.findClosestByPath(
                    FIND_MY_CONSTRUCTION_SITES);
                if (newTarget != null) {
                    creep.memory.target = newTarget.id;
                    target = newTarget;
                } else {
                    creep.memory.target = null;
                    target = null;
                }
            }
            if (target != null && target.progress != null) {
                if (creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {
                        visualizePathStyle: {
                            stroke: pathColor
                        }
                    });
                }
            } else {
                var target = Game.getObjectById(creep.memory.target);
                if (target == null) {
                    var newTarget = creep.pos.findClosestByPath(
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
                        });
                    if (newTarget != null) {
                        target = newTarget;
                        creep.memory.target = target.id;
                    } else {
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
                        } else {
                            var mult = 1 << 8;
                            while (target == null && mult > 0) {
                                var newTarget = creep.pos.findClosestByPath(
                                    FIND_STRUCTURES, {
                                        filter: (structure) => {
                                            return structure.hits <
                                                structure.hitsMax /
                                                mult &&
                                                structure.structureType !=
                                                STRUCTURE_ROAD;
                                        }
                                    });
                                if (newTarget != null) {
                                    target = newTarget;
                                    creep.memory.target = target.id;
                                    mult = 0;
                                } else {
                                    Math.floor(mult / 2);
                                }
                            }
                        }
                    }
                }
                if (target != null) {
                    if (target.hits == target.hitsMax) {
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
                                    STRUCTURE_LINK ||
                                    structure.structureType ==
                                    STRUCTURE_SPAWN) &&
                                structure.energy > creep.carryCapacity -
                                creep.carry.energy);
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
            if (target == null && creep.carry.energy > 0) {
                creep.memory.building = true;
                creep.say('🚧 Build');
                creep.memory.target = null;
            }
        }
    }
};

module.exports = roleBuilder;
