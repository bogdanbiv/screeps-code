

var roleHarvester = {
  run: function(creep){
    if(creep.memory.dropoff && creep.carry.energy == 0) {
      creep.memory.dropoff = false;
      creep.say('harvesting');
	  }
	  if(!creep.memory.dropoff && creep.carry.energy == creep.carryCapacity) {
	    creep.memory.dropoff = true;
	    creep.say('Drop Off');
	  }

	  if(!creep.memory.dropoff) {
        
        let allSources = Game.spawns['Spawn1'].memory.sources
        let foundSource
        if (!!allSources) {
            // console.log('Spawn1.sources: ' + Game.spawns['Spawn1'] + ': ' + Game.spawns['Spawn1'].memory.sources ); 
            // console.log('Spawn1.sources: ' + Game.spawns['Spawn1'] + ': ' + Game.spawns['Spawn1'].memory.sources['e75ecb36b9a9c7bd0e972b87'].max  ); 
            if(!creep.memory.source || Game.time%7===0){
              foundSource = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE, {
                filter: (s) => (allSources[s.id].actual < allSources[s.id].max)
              }) 
              
              if (!!foundSource) {
                creep.memory.sourceId = foundSource.id
              }    
            } else {
              foundSource = Game.getObjectById(creep.memory.sourceId)
            }
    
            if (!!foundSource && !(foundSource<0)) {
              if(creep.harvest(foundSource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(foundSource);
              }
            }
        } else {
           // console.log('SRC undef::: Spawn1.sources: ' + Game.spawns['Spawn1'] + ': ' + Game.spawns['Spawn1'].memory.sources ); 
        }

      }else{
        let target;
        if (!creep.memory.target || Game.time%2 === 0 ) {
          target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            // the second argument for findClosestByPath is an object which takes
            // a property called filter which can be a function
            // we use the arrow operator to define it
            // filter: (s) => ((s.structureType == STRUCTURE_SPAWN
            // || s.structureType == STRUCTURE_EXTENSION)
            // && s.energy < s.energyCapacity)
            
            filter: (s) => (true)
          });

          if (!!target) {
            creep.memory.targetId = target.id;
          }
        } else {
          target = Game.getObjectById(creep.memory.target)
        }

        if (!!creep.memory.targetId) {
          if(creep.memory.targetId, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.memory.targetId);
          }
        }
      }
	}
};

module.exports = roleHarvester; // function() { undefined.test() } 

