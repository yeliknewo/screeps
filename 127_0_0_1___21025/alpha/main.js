var clean_creep_memory = function() {
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearling non-existing creep memory:', name);
        }
    }
};

var CreepState = {
    IDLE: 0,
}