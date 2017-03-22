/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.soldier');
 * mod.thing == 'a thing'; // true
 */

var roleSoldier = {
    /** param {Creep} creep **/
    run: function(creep) {_
        var targets = creep.room.find(FIND_HOSTILE_CREEPS);
        if(targets.length > 0) {
            var username = targets[0].owner.username;
            Game.notify(`User ${username} spotted in room ${creep.room.name}`);
            if(creep.attack(targets[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0]);
            }
        }
        else {
            var flag = Game.flags['Flag1'];
            creep.moveTo(flag);
        }
    }
}

module.exports = roleSoldier;