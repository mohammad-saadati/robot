'use strict';
// Define a simple world state
class VillageState {
  constructor(place, parcels) {
    this.place = place;
    this.parcels = parcels;
  }
  move(destination) {
    if (!roadGraph[this.place].includes(destination)) {
      return this;
    } else {
      let parcels = this.parcels
        .map((p) => {
          if (p.place != this.place) return p;
          return { place: destination, address: p.address };
        })
        .filter((p) => p.place != p.address);
      return new VillageState(destination, parcels);
    }
  }
}
// Define the road connections between places
const roads = [
  "Alice's House-Bob's House",
  "Alice's House-Cabin",
  "Alice's House-Post Office",
  "Bob's House-Town Hall",
  "Daria's House-Ernie's House",
  "Daria's House-Town Hall",
  "Ernie's House-Grete's House",
  "Grete's House-Farm",
  "Grete's House-Shop",
  'Marketplace-Farm',
  'Marketplace-Post Office',
  'Marketplace-Shop',
  'Marketplace-Town Hall',
  'Shop-Town Hall',
];
function buildGraph(edges) {
  let graph = Object.create(null);
  function addEdge(from, to) {
    if (graph[from] == null) {
      graph[from] = [to];
    } else {
      graph[from].push(to);
    }
  }
  for (let [from, to] of edges.map((r) => r.split('-'))) {
    addEdge(from, to);
    addEdge(to, from);
  }
  return graph;
}
const roadGraph = buildGraph(roads);
// Create a simple robot function
function randomRobot(state) {
  let destinations = roadGraph[state.place];
  return {
    direction: destinations[Math.floor(Math.random() * destinations.length)],
    memory: null,
  };
}
// Create initial state with some parcels
function createState() {
  let parcels = [];
  for (let i = 0; i < 5; i++) {
    let address = Object.keys(roadGraph)[Math.floor(Math.random() * Object.keys(roadGraph).length)];
    let place;
    do {
      place = Object.keys(roadGraph)[Math.floor(Math.random() * Object.keys(roadGraph).length)];
    } while (place == address);
    parcels.push({ place, address });
  }
  return new VillageState('Post Office', parcels);
}
// Start the animation when the page loads
window.onload = function () {
  runRobotAnimation(createState(), randomRobot, null);
};
