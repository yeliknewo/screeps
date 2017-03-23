function clear_creep_memory() {
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Wiped dead creep', name, 'from memory');
        }
    }
}

var CreepState = {
    IDLE: 0,
    HAUL: 1,
    GATHER: 2,
    UPGRADE: 3,
    BUILD: 4,
    FIGHT: 5,
};

var act_gather = function act_gather(creep, location) {
    if(creep.harvest(location) == ERR_NOT_IN_RANGE) {
        creep.moveTo(location);
    }
};

var Job = class {
    //location of the job, and the action to take place at that location.
    constructor(location, action, priority, max_creeps) {

        this.location = location;
        this.action = action;

        this.priority = priority;
        this.max_creeps = max_creeps;

        this.creep_ids = [];
    }
    //assigns a creep to this job
    assign_creep(id) {
        console.log(id);
        this.creep_ids.push(id);
        var creep = Game.getObjectById(id);
        if(creep) {
            creep.memory.assigned = true;
        }
        else {
            console.log('fucl');
        }
    }

    work() {
        for(var id in this.creep_ids) {
            console.log('id', id);
            var creep = Game.getObjectById(id);
            this.action(creep, this.location);
        }
    }
}

function get_creep_count() {
    var count = {
        idle: 0,
        haul: 0,
        gather: 0,
        upgrade: 0,
        build: 0,
        fight: 0,
    };
    for (var name in Game.creeps) {
        switch(Game.creeps[name].memory.c_state) {
            case CreepState.IDLE:
                count.idle += 1;
                break;
            case CreepState.HAUL:
                count.haul += 1;
                break;
            case CreepState.GATHER:
                count.gather += 1;
                break;
            case CreepState.UPGRADE:
                count.upgrade += 1;
                break;
            case CreepState.BUILD:
                count.build += 1;
                break;
            case CreepState.FIGHT:
                count.fight += 1;
        }
    }
    return count;
}

var src;
for(var roomIndex in Game.rooms) {
    src = Game.rooms[roomIndex].find(FIND_SOURCES);
}
var jjob = new Job(src[0], act_gather, 3, 3);

function update_creeps () {
    var count = get_creep_count();
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        console.log(creep);
        jjob.assign_creep(creep.id);

        if(creep.memory.c_state == null) {
            creep.memory.c_state = CreepState.IDLE;
        }
        if(creep.memory.assigned == null) {
            creep.memory.assigned = false;
        }
        if(creep.memory.c_state == CreepState.IDLE) {
            if(creep.memory.assigned == false) {
                console.log('fuicl', creep.id);
            }
        }
        jjob.work();
    }
}

function manage() {
    clear_creep_memory();
    update_creeps();
}

module.exports.loop = function () {
    manage();
}
