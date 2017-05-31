function toIDs(array) {
    var new_array = [];
    for(let i in array) {
        let object = array[i];
        new_array.push(object.id);
    }
    return new_array;
}

var pool_find_states = ['resources', 'creeps', 'structures'];

var finderResource = function(room, pool) {
    var sources = room.find(FIND_SOURCES);
    pool.harvest = toIDs(sources);
    
    var dropped_resources = room.find(FIND_DROPPED_RESOURCES);
    pool.pickup = toIDs(dropped_resources);
    
    pool.upgrade_controller = [room.controller.id] || undefined;
}

var finderCreep = function(room, pool) {
    var my_creeps = room.find(FIND_MY_CREEPS);
    pool.my_creeps = toIDs(my_creeps);
    
    var hostile_creeps = room.find(FIND_HOSTILE_CREEPS);
    pool.attack = toIDs(hostile_creeps);
}

var finderStructure = function(room, pool) {
    var my_structures = room.find(FIND_MY_STRUCTURES);
    pool.my_structures = toIDs(my_structures);
    
    var transfer = _.filter(my_structures, function(structure) {
        return (
            structure.structureType == STRUCTURE_SPAWN ||
            structure.structureType == STRUCTURE_CONTAINER
        );
    });
    
    var withdraw = _.filter(transfer, function(structure) {
        return (
            structure.structureType == STRUCTURE_CONTAINER ||
            structure.structureType == STRUCTURE_SPAWN
        );
    });
    
    pool.transfer = toIDs(transfer);
    pool.withdraw = toIDs(transfer);
    var my_construction_sites = room.find(FIND_MY_CONSTRUCTION_SITES);
    pool.build = toIDs(my_construction_sites);
}

module.exports = {

};