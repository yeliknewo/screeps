var roleUpgrader = {
    /** @param {Creep} creep **/
    run: function(creep) {
        var pathColor = '#0000FF';
        if (creep.memory.upgrading == null) {
            creep.memory.upgrading = false;
        }
        if (creep.memory.upgrading && creep.carry.energy == 0 && Memory
            .creepsReady == true) {
            creep.memory.upgrading = false;
            creep.say('Withdraw');
            creep.memory.target = null;
            creep.memory.waiting = false;
        }
        if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('⚡ Upgrade');
            creep.memory.target = null;
            creep.memory.waiting = false;
        }
        if (creep.memory.waiting) {
            creep.memory.waiting = !Memory.creepsReady;
            creep.moveTo(creep.pos.findClosestByPath(FIND_FLAGS));
        } else if (creep.memory.upgrading) {
            var target = Game.getObjectById(creep.memory.target);
            if (target == null) {
                var newTarget = creep.room.controller;
                if (newTarget != null) {
                    creep.memory.target = newTarget.id;
                    target = newTarget;
                }
            }
            if (target != null) {
                if (creep.upgradeController(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {
                        visualizePathStyle: {
                            stroke: pathColor
                        }
                    });
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
                                    RESOURCE_ENERGY] >=
                                creep.carryCapacity - creep
                                .carry.energy) || ((
                                    structure.structureType ==
                                    STRUCTURE_LINK) &&
                                structure.energy >= 0); //creep.carryCapacity - creep.carry.energy

                        }
                    });
                if (newTarget != null) {
                    creep.memory.target = newTarget.id;
                    target = newTarget;
                }
                if (target == null && creep.room.storage == null) {
                    var newTarget = creep.pos.findClosestByPath(
                        FIND_STRUCTURES, {
                            filter: (structure) => {
                                return (
                                        structure.structureType ==
                                        STRUCTURE_SPAWN ||
                                        structure.structureType ==
                                        STRUCTURE_EXTENSION) &&
                                    structure.energy >= 0; //creep.carryCapacity - creep.carry.energy

                            }
                        });
                    if (newTarget != null) {
                        creep.memory.target = newTarget.id;
                        target = newTarget;
                    }
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
                    creep.memory.upgrading = true;
                    creep.say('⚡ Upgrade');
                    creep.memory.target = null;
                } else {
                    creep.memory.waiting = !Memory.creepsReady;
                }
            }
        }
    }
};

module.exports = roleUpgrader;
