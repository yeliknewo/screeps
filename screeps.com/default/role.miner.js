var roleMiner = {
    /** @param {Creep} creep **/
    run: function(creep) {
        var pathColor = '#00ffff';
        if (creep.memory.targetSource != null) {
            var source = Game.getObjectById(Memory.sources[creep.memory
                .targetSource]);
            if (source != null) {
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {
                        reusePath: 0,
                        visualizePathStyle: {
                            stroke: pathColor
                        }
                    });
                }
            }
        }
        if (creep.memory.targetSource == null || Game.time % 100 == 0) {
            creep.memory.targetSource = creep.memory.number %
                Memory.sources.length;
        }
    }
};

module.exports = roleMiner;
