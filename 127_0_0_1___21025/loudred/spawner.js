
var controller_level_to_queue = require('config');

//REVIEW
//creeps should have states.  states wrap around actions and handle the transitions between those actions.
//each creep state correponds to a function defined on the prototype of the creep.
//creeps can only transition to certain states (because of their body), and this doesnt happen very often.
//action is simply what a creep is doing right now, whereas state is a longer term thing (maybe occupation, vocation, or job OR BEHAVIOR is a better word for it)

//takes creep bodies from a queue and spawns them if current_pop < max_pop
Spawn.prototype.run = function(action_counter) {
    let level = this.room.controller.level || 0;
    let max_pop = controller_level_to_queue[level].length;
    if(!this.memory.current && !this.spawning && action_counter['total'] < max_pop) {
        let queue = this.room.memory.queue;
        this.memory.current = queue.shift();
        this.room.memory.queue = queue;
    }
    if(!this.spawning && action_counter['total'] < max_pop) {
        let current = this.memory.current;
        if(current) {
            let result = this.createCreep(current.body, null, {job: current.job, action: current.action});
            if(result == OK) {
                console.log('spawn loaded next current')
                this.memory.current = undefined;
            }
        }
    }
    else {
        this.memory.current = undefined;
    }
}

//takes a base body representing the ratios of each part you want
//returns a body that costs max energy to spawn
Spawn.prototype.maximizeBody = function(body) {

    var counter = {};
    _.forEach(body, function(part) {
        if(counter[part]) {
            counter[part] += 1;
        }
        else {
            counter[part] = 1;
        }
    });

    var base_cost = 0;
    for(let body in counter) {
        let count = counter[body];
        while(count > 0) {
            base_cost += BODYPART_COST[body];
            counter -= 1;
        }
    }
}

//refreshes the creep queue as needed and runs all the spawns
var spawnSystem = function(action_counter) {
    for(let r in Game.rooms) {
        let room = Game.rooms[r];
        let level = room.controller.level || 0;
        if(!room.memory.queue || room.memory.queue.length == 0) {
            room.memory.queue = controller_level_to_queue[level];
        }
    }
    for(let s in Game.spawns) {
        let spawn = Game.spawns[s];
        spawn.run(action_counter);
    }
}

module.exports = spawnSystem;
