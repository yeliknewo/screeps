var roleSoldier = {
    /** param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.usedRooms == null) {
            creep.memory.usedRooms = {};
        }
        if(creep.memory.attackTarget == null) {
            var target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
            if(target != null) {
                creep.memory.attackTarget = target.id;
                creep.memory.raidTarget = null;
            } else {
                target = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES);
                if(target != null) {
                    creep.memory.attackTarget = target.id;
                    creep.memory.raidTarget = null;
                } else {
                    creep.memory.attackTarget = null;
                }
            }
        }
        if(creep.memory.attackTarget != null) {
            var target = Game.getObjectById(creep.memory.attackTarget);
            if(target == null) {
                creep.memory.attackTarget = null;
            } else {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}});
                creep.attack(target);
                return;
            }
        }
        if(creep.memory.attackTarget == null) {
            if(creep.memory.raidTarget == null) {
                var targetRooms = Game.map.describeExits(creep.room.name);
                var choice = Game.time % 4;
                while(choice >= 0) {
                    for(var targetIndex in targetRooms) {
                        if(choice > 0) {
                            choice--;
                            continue;
                        }
                        var targetRoom = targetRooms[targetIndex];
                        if(targetRoom != null) {
                            if(creep.memory.usedRooms[targetRoom] != null && creep.memory.usedRooms[targetRoom] > Game.time) {
                                continue;
                            }
                            var exitDir = creep.room.findExitTo(targetRoom);
                            var exit = creep.pos.findClosestByPath(exitDir);
                            creep.memory.raidTarget = {roomName: creep.room.name, x: exit.x, y: exit.y};
                            creep.memory.usedRooms[creep.room.name] = Game.time + 100;
                            break;
                        }
                    }
                    if(choice == 0) {
                        choice = -1;
                    }
                }
            }
            if(creep.memory.raidTarget != null) {
                var result = creep.moveTo(creep.room.getPositionAt(creep.memory.raidTarget.x, creep.memory.raidTarget.y), {visualizePathStyle: {stroke: '#ff0000'}});
                if(creep.memory.raidTarget.roomName != creep.room.name) {
                    creep.memory.raidTarget = null;
                }
            }
        }
    }
};

module.exports = roleSoldier;
