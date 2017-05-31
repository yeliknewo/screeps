
//unclaimed room
var config0 = {
    //TODO
}


var creepQueue1 = [
    { body: [WORK, CARRY, MOVE, MOVE], job: 'gather', action: 'harvest'},
    { body: [WORK, CARRY, MOVE, MOVE], job: 'gather', action: 'harvest'},
    { body: [WORK, CARRY, MOVE, MOVE], job: 'gather', action: 'harvest'},
    { body: [WORK, CARRY, MOVE, MOVE], job: 'gather', action: 'harvest'},
    { body: [WORK, CARRY, MOVE, MOVE], job: 'upgrade', action: 'withdraw'},
    { body: [WORK, CARRY, MOVE, MOVE], job: 'upgrade', action: 'withdraw'},
    { body: [WORK, CARRY, MOVE, MOVE], job: 'upgrade', action: 'withdraw'},
    { body: [WORK, CARRY, MOVE, MOVE], job: 'construct', action: 'withdraw'},
    { body: [WORK, CARRY, MOVE, MOVE], job: 'construct', action: 'withdraw'}
];

//room with controller level one
var config1 = {
    'harvest': {
        amount: 4, //TODO calculate based on number of sources in room
        body: [WORK, CARRY, MOVE, MOVE] //body to use for this action
    },
    'transfer': {
        amount: 2,
        body: [WORK, CARRY, MOVE, MOVE]
    },
    'upgrade': {
        amount: 3,
        body: [WORK, CARRY, MOVE]
    }
};

var controller_level_to_config = {
    0: config0,
    1: creepQueue1,
    2: creepQueue1, //TODO
}

module.exports = controller_level_to_config;
