// Define interfaces for our data structures
interface Parcel {
  place: string;
  address: string;
}

interface RobotResult {
  direction: string;
  memory: string | string[];
}

interface RoadGraph {
  [location: string]: string[];
}

// Define a simple world state
class VillageState {
  place: string;
  parcels: Parcel[];

  constructor(place: string, parcels: Parcel[]) {
    this.place = place;
    this.parcels = parcels;
  }

  move(destination: string): VillageState {
    if (!roadGraph[this.place].includes(destination)) {
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

// Define the road connections between places
const roads: string[] = [
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

function buildGraph(edges: string[]): RoadGraph {
  const graph: RoadGraph = Object.create(null);

  function addEdge(from: string, to: string): void {
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

const roadGraph: RoadGraph = buildGraph(roads);

// Create a simple robot function
function randomRobot(state: VillageState): RobotResult {
  const destinations = roadGraph[state.place];
  return {
    direction: destinations[Math.floor(Math.random() * destinations.length)],
    memory: '',
  };
}

// Create initial state with some parcels
function createState(): VillageState {
  const parcels: Parcel[] = [];
  for (let i = 0; i < 5; i++) {
    const address =
      Object.keys(roadGraph)[Math.floor(Math.random() * Object.keys(roadGraph).length)];
    let place: string;
    do {
      place = Object.keys(roadGraph)[Math.floor(Math.random() * Object.keys(roadGraph).length)];
    } while (place == address);
    parcels.push({ place, address });
  }
  return new VillageState('Post Office', parcels);
}

// Declare the runRobotAnimation function that's used but not defined in this file
declare function runRobotAnimation(
  state: VillageState,
  robot: (state: VillageState) => RobotResult,
  memory: string | null
): void;

function countSteps(
  state: VillageState,
  robot: (state: VillageState, memory: any) => RobotResult,
  memory: any
): number {
  for (let steps = 0; ; steps++) {
    if (state.parcels.length == 0) return steps;
    const action = robot(state, memory);
    state = state.move(action.direction);
    memory = action.memory;
  }
}

function compareRobots(
  robot1: (state: VillageState, memory: any) => RobotResult,
  memory1: any,
  robot2: (state: VillageState, memory: any) => RobotResult,
  memory2: any
): void {
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
function findRoute(graph: RoadGraph, from: string, to: string): string[] {
  const work: { at: string; route: string[] }[] = [{ at: from, route: [] }];
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

function goalOrientedRobot({ place, parcels }: VillageState, route: string[]): RobotResult {
  if (route.length == 0) {
    const parcel = parcels[0];
    if (parcel.place != place) {
      route = findRoute(roadGraph, place, parcel.place);
    } else {
      route = findRoute(roadGraph, place, parcel.address);
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

function routeRobot(state: VillageState, memory: string[]): RobotResult {
  if (memory.length == 0) {
    memory = mailRoute;
  }
  return { direction: memory[0], memory: memory.slice(1) };
}

function lazyRobot({ place, parcels }: VillageState, route: string[]): RobotResult {
  if (route.length == 0) {
    // Describe a route for every parcel
    const routes = parcels.map((parcel) => {
      if (parcel.place != place) {
        return {
          route: findRoute(roadGraph, place, parcel.place),
          pickUp: true,
        };
      } else {
        return {
          route: findRoute(roadGraph, place, parcel.address),
          pickUp: false,
        };
      }
    });

    // This determines the precedence a route gets when choosing.
    // Route length counts negatively, routes that pick up a package
    // get a small bonus.
    function score({ route, pickUp }: { route: string[]; pickUp: boolean }): number {
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
  window.onload = function (): void {
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
