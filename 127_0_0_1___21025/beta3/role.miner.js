var roleMiner = {
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
                        return (structure.structureType == STRUCTURE_TOWER || structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
                    }
                });
                if(newTarget != null) {
                    creep.memory.target = newTarget.id;
                    target = Game.getObjectById(creep.memory.target);
                } else {
                    var newTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return ((structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_LINK) && structure.energy < structure.energyCapacity) || (structure.structureType == STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY] < structure.storeCapacity);
                        }
                    });
                    if(newTarget != null) {
                        creep.memory.target = newTarget.id;
                        target = Game.getObjectById(creep.memory.target);
                    }
                }
            }
            if(target != null) {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {reusePath: 0, visualizePathStyle: {stroke: '#00ffff'}});
                }
            }
        } else {
            if(creep.memory.data != null && creep.memory.data.longDistance) {
                // console.log(1);
                if(creep.memory.target == null || creep.memory.target.roomName == null) {
                    // console.log(2);
                    creep.memory.target = Memory.globalSources[creep.memory.data.globalIndex];
                }
                if(creep.memory.target != null && creep.memory.target.roomName != null) {
                    // console.log(3);
                    var room = Game.rooms[creep.memory.target.roomName];
                    if(room != null) {
                        // console.log(4);
                        var source = room.lookForAt(LOOK_SOURCES, creep.memory.target.x, creep.memory.target.y);
                        if(source != null) {
                            // console.log(5);
                            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                                // console.log(6);
                                creep.moveTo(source, {reusePath: 0, visualizePathStyle: {stroke: '#00ffff'}});
                            }
                        }
                    } else {
                        // console.log(7);
                        creep.moveTo(creep.memory.target, {reusePath: 0, visualizePathStyle: {stroke: '#00ffff'}});
                    }
                }
            } else {
                var target = Game.getObjectById(creep.memory.target);
                if(target == null || target.energy == 0 || (target.store != null && target.store[RESOURCE_ENERGY] > 0)) {
                    if(creep.memory.target == null) {
                        var newTarget = creep.pos.findClosestByPath(FIND_SOURCES, {
                            filter: (source) => {
                                return (source.energy > 0)
                            }
                        });
                        if(newTarget != null) {
                            target = newTarget;
                            creep.memory.target = target.id;
                        } else {
                            creep.memory.target = null;
                            target = null;
                        }
                    }
                }
                if(target != null && target.energy != null && target.energy > 0) {
                    if(creep.harvest(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {reusePath: 0, visualizePathStyle: {stroke: '#00ffff'}});
                    }
                } else {
                    var newTarget = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                        filter: (structure) => {
                            return structure.structureType == STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY] > 10;
                        }
                    });
                    if(newTarget != null) {
                        target = newTarget;
                        creep.memory.target = target.id;
                    } else {
                        creep.memory.target = null;
                        target = null;
                        if(creep.carry.energy > 0) {
                            creep.memory.transfering = true;
                            creep.say('Transfer');
                        }
                    }
                    if(target != null) {
                        if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target, {reusePath: 0, visualizePathStyle: {stroke: '#00ffff'}});
                        }
                    }
                }
            }
        }
    }
};

module.exports = roleMiner;
