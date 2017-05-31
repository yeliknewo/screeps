var job_to_actions = require('job');
//creeps are grouped by action

//runs the creep using an action and target
//gets new target based on action if necessary
Creep.prototype.run = function(target_counter, target_requester) {

    this.registerTarget(target_counter);

    let target = Game.getObjectById(this.memory.target);

    let result = this[this.memory.action](target);
    if(result == ERR_INVALID_ARGS) {
        result = this[this.memory.action](target, RESOURCE_ENERGY); //case: transfer()
    }
    if(result == ERR_NOT_IN_RANGE) {
        this.moveTo(target);
    }
    else if(this.memory.job == 'gather' && this.carry.energy == this.carryCapacity) {
        this.nextAction();
        this.needTarget(target_requester);
    }
    else if(result == ERR_FULL) {
        this.nextAction();
        this.needTarget(target_requester);
    }
    else if(result == ERR_NOT_ENOUGH_RESOURCES) {
        this.nextAction();
        this.needTarget(target_requester);
    }
    else if(result == ERR_INVALID_TARGET) {
        console.log(`Creep ${this.name} had invalid target ${this.memory.target}.`);
        this.needTarget(target_requester);
    }
}

//associates actions to other actions
Creep.prototype.nextAction = function() {
    let current = this.memory.action;
    let job = this.memory.job; //a job is just a sequence of actions
    if(job) {
        let actions = job_to_actions[job];
        let current_index = actions.indexOf(current);
        let next_action = job_to_actions[job][current_index + 1] || job_to_actions[job][0];
        //console.log(`Got next job->action ${next_action} for ${this.name}`);
        this.memory.action = next_action;
    }
}

//tracks how many creeps are targeting something this tick
//this info will be used to select the targets with the smallest number of creeps working on it
Creep.prototype.registerTarget = function(target_counter) {
    if(target_counter[this.memory.target]) {
        target_counter[this.memory.target] += 1;
    }
    else {
        target_counter[this.memory.target] = 1;
    }
}

//gets a target based on the current action type of the creep
Creep.prototype.needTarget = function(target_requester) {
    target_requester[this.id] = this.memory.action;
}
