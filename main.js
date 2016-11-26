var test = require('role.harvester')

var targetRooms = {
    sim: {
        hold: true,
        tool: true,
        tools: 1
    }
}

var interHaulers = [
    {
        from: 'W18N68',
        to: 'W17N68'
    }
]

var roles = {
    // builder: require('role.builder'),
    // claimer: require('role.claimer'),
    // harvester: require('role.harvester'),
    // upgrader: require('role.upgrader'),
    // healer: require('role.healer'),
    // hauler: require('role.hauler'),
    // multiTool: require('role.multiTool'),
    // ranger: require('role.ranger'),
    // interHauler: require('role.interHauler')
}

var structure = {
    tower: require('structure.tower')
}

var ai = {
    numbers: require('ai.numbers'),
    targetedRooms: require('ai.targetedRooms')
}

if (Game.time%3 === 0) {
    let allSrc = gatherSources(Game.spawns['Spawn1'].room)
    console.log('allSrc: ' + allSrc)
  Game.spawns['Spawn1'].memory.sources = allSrc
  console.log('Spawn1.memory.sources: ' + Game.spawns['Spawn1'].memory.sources)
}

function gatherSources(room) {
  console.log('gatherSources(' + room + '): ' );
  let sources = room.find(FIND_SOURCES, {
    filter: (s) => s.energy > 0
  });

  let sourcesAlloc = _.reduce(sources, function (coll, src) {
    coll[src.id] = {actual: 0, max: neighCount(src.pos)}

    return coll;
  }, {})
  
  return sourcesAlloc;
}

// console.log('_______________' + neighCount(Game.spawns.Spawn1.room.find(FIND_SOURCES)[0].pos))
function neighCount(pos) {
  let cnt = 0, i, j;
  for(i=-1;i<2;i++) {
    for(j=-1;j<2;j++) {
      console.log(i + "," + j + ": " + Game.map.getTerrainAt(pos.x+i, pos.y+j, pos.roomName));
      cnt += (Game.map.getTerrainAt(pos.x+i, pos.y+j, pos.roomName) !== 'wall');
    }
  }

  return cnt;
}

module.exports.loop = function () {
    let creep
    for(let name in Memory.creeps) {
        if(!!Game.creeps[name]) {
          creep = Game.creeps[name];
          roles[creep.memory.role].run(creep);
        } else {
          delete Memory.creeps[name];
          console.log('Clearing non-existing creep memory:', name);
        }
    }


    //ai.numbers.harvesters();
    //ai.numbers.upgraders();
    //ai.numbers.builders();
    // ai.numbers.healers();
    //ai.numbers.haulers();
    // ai.numbers.interHaulers(interHaulers);

    ai.targetedRooms.process(targetRooms);


    // for(var name in Game.creeps){
    //     var creep = Game.creeps[name];

    //     roles[creep.memory.role].run(creep);
    // }

    for(var id in Game.structures){
        if(Game.structures[id].structureType == STRUCTURE_TOWER){
            structure.tower.run(Game.structures[id])
        }
    }
}
