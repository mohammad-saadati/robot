(function (factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    var v = factory(require, exports);
    if (v !== undefined) module.exports = v;
  } else if (typeof define === 'function' && define.amd) {
    define(['require', 'exports'], factory);
  }
})(function (require, exports) {
  'use strict';
  Object.defineProperty(exports, '__esModule', { value: true });
  exports.roadGraph = exports.VillageState = void 0;
  exports.buildGraph = buildGraph;
  exports.randomRobot = randomRobot;
  exports.createState = createState;
  exports.countSteps = countSteps;
  exports.compareRobots = compareRobots;
  exports.findRoute = findRoute;
  exports.goalOrientedRobot = goalOrientedRobot;
  exports.routeRobot = routeRobot;
  exports.lazyRobot = lazyRobot;
  // Define a simple world state
  class VillageState {
    constructor(place, parcels) {
      this.place = place;
      this.parcels = parcels;
    }
    move(destination) {
      if (!exports.roadGraph[this.place].includes(destination)) {
        return this;
      } else {
        const parcels = this.parcels
          .map((p) => {
            if (p.place != this.place) return p;
            return { place: destination, address: p.address };
          })
          .filter((p) => p.place != p.address);
        return new VillageState(destination, parcels);
      }
    }
  }
  exports.VillageState = VillageState;
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
    const graph = Object.create(null);
    function addEdge(from, to) {
      if (graph[from] == null) {
        graph[from] = [to];
      } else {
        graph[from].push(to);
      }
    }
    for (const [from, to] of edges.map((r) => r.split('-'))) {
      addEdge(from, to);
      addEdge(to, from);
    }
    return graph;
  }
  exports.roadGraph = buildGraph(roads);
  // Create a simple robot function
  function randomRobot(state) {
    const destinations = exports.roadGraph[state.place];
    return {
      direction: destinations[Math.floor(Math.random() * destinations.length)],
      memory: '',
    };
  }
  // Create initial state with some parcels
  function createState() {
    const parcels = [];
    for (let i = 0; i < 5; i++) {
      const address = Object.keys(exports.roadGraph)[
        Math.floor(Math.random() * Object.keys(exports.roadGraph).length)
      ];
      let place;
      do {
        place = Object.keys(exports.roadGraph)[
          Math.floor(Math.random() * Object.keys(exports.roadGraph).length)
        ];
      } while (place == address);
      parcels.push({ place, address });
    }
    return new VillageState('Post Office', parcels);
  }
  function countSteps(state, robot, memory) {
    for (let steps = 0; ; steps++) {
      if (state.parcels.length == 0) return steps;
      const action = robot(state, memory);
      state = state.move(action.direction);
      memory = action.memory;
    }
  }
  function compareRobots(robot1, memory1, robot2, memory2) {
    let total1 = 0,
      total2 = 0;
    for (let i = 0; i < 100; i++) {
      const state = createState();
      total1 += countSteps(state, robot1, memory1);
      total2 += countSteps(state, robot2, memory2);
    }
    console.log(`Robot 1 needed ${total1 / 100} steps per task`);
    console.log(`Robot 2 needed ${total2 / 100} steps per task`);
  }
  function findRoute(graph, from, to) {
    const work = [{ at: from, route: [] }];
    for (let i = 0; i < work.length; i++) {
      const { at, route } = work[i];
      for (const place of graph[at]) {
        if (place == to) return route.concat(place);
        if (!work.some((w) => w.at == place)) {
          work.push({ at: place, route: route.concat(place) });
        }
      }
    }
    return []; // Return empty array if no route is found
  }
  function goalOrientedRobot({ place, parcels }, route) {
    if (route.length == 0) {
      const parcel = parcels[0];
      if (parcel.place != place) {
        route = findRoute(exports.roadGraph, place, parcel.place);
      } else {
        route = findRoute(exports.roadGraph, place, parcel.address);
      }
    }
    return { direction: route[0], memory: route.slice(1) };
  }
  const mailRoute = [
    "Alice's House",
    'Cabin',
    "Alice's House",
    "Bob's House",
    'Town Hall',
    "Daria's House",
    "Ernie's House",
    "Grete's House",
    'Shop',
    "Grete's House",
    'Farm',
    'Marketplace',
    'Post Office',
  ];
  function routeRobot(state, memory) {
    if (memory.length == 0) {
      memory = mailRoute;
    }
    return { direction: memory[0], memory: memory.slice(1) };
  }
  function lazyRobot({ place, parcels }, route) {
    if (route.length == 0) {
      // Describe a route for every parcel
      const routes = parcels.map((parcel) => {
        if (parcel.place != place) {
          return {
            route: findRoute(exports.roadGraph, place, parcel.place),
            pickUp: true,
          };
        } else {
          return {
            route: findRoute(exports.roadGraph, place, parcel.address),
            pickUp: false,
          };
        }
      });
      // This determines the precedence a route gets when choosing.
      // Route length counts negatively, routes that pick up a package
      // get a small bonus.
      function score({ route, pickUp }) {
        return (pickUp ? 0.5 : 0) - route.length;
      }
      route = routes.reduce((a, b) => (score(a) > score(b) ? a : b)).route;
    }
    return { direction: route[0], memory: route.slice(1) };
  }
  compareRobots(routeRobot, [], goalOrientedRobot, []);
  compareRobots(goalOrientedRobot, [], lazyRobot, []);
  compareRobots(routeRobot, [], lazyRobot, []);
  // Start the animation when the page loads
  if (typeof window !== 'undefined') {
    window.onload = function () {
      runRobotAnimation(createState(), randomRobot, null);
      const button = document.createElement('button');
      button.textContent = 'Run Lazy Robot Animation';
      button.style.margin = '20px 0';
      button.style.backgroundColor = 'blue';
      button.style.color = 'white';
      button.onclick = () => {
        runRobotAnimation(createState(), (state) => lazyRobot(state, []), '');
        button.disabled = true;
      };
      document.body.appendChild(button);
    };
  }
});
