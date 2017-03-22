var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
            creep.memory.target = null;
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('🚧 build');
            creep.memory.target = null;
        }

        if(creep.memory.building) {
            var target = Game.getObjectById(creep.memory.target);
            if(target == null) {
                var newTarget = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                if(newTarget != null) {
                    creep.memory.target = newTarget.id;
                    target = newTarget;
                }
            }
            if(target != null) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    // creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
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

module.exports = roleBuilder;
