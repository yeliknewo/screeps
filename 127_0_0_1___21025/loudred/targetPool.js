function toIDs(array) {
    var new_array = [];
    for(let i in array) {
        let object = array[i];
        new_array.push(object.id);
    }
    return new_array;
}

//find resources one tick, creeps another,  etc...
var poolFindStates = ['resources', 'creeps', 'structures'];

var resourceFinder = function(room, pool) {
    //find sources
    var sources = room.find(FIND_SOURCES);
    pool.harvest = toIDs(sources);

    //find dropped stuff (usually energy)
    var droppedResources = room.find(FIND_DROPPED_RESOURCES);
    pool.pickup = toIDs(droppedResources);

    pool.upgradeController = [room.controller.id] || undefined;
}

var creepFinder = function(room, pool) {
    //find my creeps
    var myCreeps = room.find(FIND_MY_CREEPS);
    pool.myCreeps = toIDs(myCreeps);

    //find hostile creeps
    var hostileCreeps = room.find(FIND_HOSTILE_CREEPS);
    pool.attack = toIDs(hostileCreeps);
}

var structureFinder = function(room, pool) {
    var myStructures = room.find(FIND_MY_STRUCTURES);
    pool.myStructures = toIDs(myStructures);


    var transfer = _.filter(myStructures, function(structure) {
        return (
            structure.structureType == STRUCTURE_SPAWN ||
            //structure.structureType == STRUCTURE_EXTENSION ||
            structure.structureType == STRUCTURE_CONTAINER
        )
    });
    var withdraw = _.filter(transfer, function(structure) {
        return (
            structure.structureType == STRUCTURE_CONTAINER ||
            structure.structureType == STRUCTURE_SPAWN
        )
    });
    pool.transfer = toIDs(transfer);
    pool.withdraw = toIDs(withdraw);
    var myConstructionSites = room.find(FIND_MY_CONSTRUCTION_SITES);
    pool.build = toIDs(myConstructionSites);
}

var finders = {
    'resources': resourceFinder,
    'creeps': creepFinder,
    'structures': structureFinder
}

//updates target pools in visible rooms
function updateTargetPools() {
    for(let i in Game.rooms) {
        let room = Game.rooms[i];
        let pool = room.memory.pool || {}; //target pool object
        let statePointer = pool.statePointer || 0; //points to the finder to be run this tick
        let finderKey = poolFindStates[statePointer];
        let finder = finders[finderKey];
        finder(room, pool); //runs the finder for this tick
        pool.statePointer += 1;
        if(pool.statePointer > poolFindStates.length - 1) {
            pool.statePointer = 0;
        }
        room.memory.pool = pool;
    }
}

function distributeTargets(target_counter, target_requester) {
    _.forEach(target_requester, function(actionType, id) {
        let creep = Game.getObjectById(id);
        let pool = creep.room.memory.pool;
        let targets = pool[actionType];

        var least_used = undefined;
        var usage = 1000; //convenience number
        _.forEach(targets, function(id) {
            let count = target_counter[id] || 0;
            if(count < usage) {
                usage = count;
                least_used = id;
                console.log(least_used)
                console.log(usage)
            }
        });
        //console.log(`Got target ${least_used} for creep ${creep.name}.`);
        creep.memory.target = least_used;
    });
}

module.exports = {
    updateTargetPools,
    distributeTargets
}
