var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
            creep.memory.target = null;
        }
        if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
            creep.memory.target = null;
        }

        if(creep.memory.upgrading) {
            creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                // creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
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

module.exports = roleUpgrader;
