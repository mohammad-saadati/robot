// Define interfaces for our data structures
interface Parcel {
  place: string;
  address: string;
}

interface RobotResult {
  direction: string;
  memory: string;
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
    memory: null,
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
  memory: string
): void;

// Start the animation when the page loads
window.onload = function (): void {
  runRobotAnimation(createState(), randomRobot, null);
};
