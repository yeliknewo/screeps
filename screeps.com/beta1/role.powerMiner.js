var rolePowerMiner = {
    /** @param {Creep} creep **/
    run: function(creep) {
        var pathColor = '#FF00FF';
        if(creep.memory.minePower == null) {
            var count = 0;
            for(var bodyIndex in creep.body) {
                var body = creep.body[bodyIndex];
                if(body.type == WORK) {
                    count++;
                }
            }
            creep.memory.minePower = count * 2;
        }
        if(creep.memory.transfering && creep.carry.energy == 0) {
            creep.memory.transfering = false;
            creep.say('🔄 Mine');
        }
        if(!creep.memory.transfering && creep.carry.energy + creep.memory.minePower > creep.carryCapacity) {
            creep.memory.transfering = true;
            creep.say('Transfer');
        }
        if(creep.memory.source == null) {
            var target = creep.pos.findClosestByPath(FIND_SOURCES);
            if(target != null) {
                creep.memory.source = target.id;
            }
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
            if(creep.memory.store != null) {
                var target = Game.getObjectById(creep.memory.store);
                if(target != null) {
                    var result = creep.transfer(target, RESOURCE_ENERGY);
                    if(result == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: pathColor}});
                    }
                } else {
                    console.log("PowerMiner: Store ID is Invalid");
                }
            } else {
                console.log("PowerMiner: No Store in Room");
            }
        } else {
            if(creep.memory.source != null) {
                var target = Game.getObjectById(creep.memory.source);
                if(target != null) {
                    var result = creep.harvest(target);
                    if(result == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: pathColor}});
                    }
                } else {
                    console.log("PowerMiner: Source ID is Invalid");
                }
            } else {
                console.log("PowerMiner: No Source in Room");
            }
        }
    }
};

module.exports = rolePowerMiner;
