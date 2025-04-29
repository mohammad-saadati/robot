import { describe, it, expect, beforeAll } from 'vitest';

import {
  VillageState,
  roadGraph,
  buildGraph,
  randomRobot,
  findRoute,
  goalOrientedRobot,
  routeRobot,
  lazyRobot,
} from '../src/runner-testable';

beforeAll(() => {
  global.window = {
    onload: () => {},
    document: {
      createElement: () => ({
        style: {},
        appendChild: () => {},
      }),
      body: {
        appendChild: () => {},
      },
    },
    // Add any other window properties your code uses
  } as object;
});

describe('Village Robot Tests', () => {
  // Test VillageState class
  describe('VillageState', () => {
    it('should create a new state with the given place and parcels', () => {
      const place = "Alice's House";
      const parcels = [{ place: "Bob's House", address: 'Shop' }];
      const state = new VillageState(place, parcels);

      expect(state.place).toBe(place);
      expect(state.parcels).toEqual(parcels);
    });

    it('should not move to an invalid destination', () => {
      const state = new VillageState("Alice's House", []);
      const newState = state.move('Invalid Location');

      expect(newState).toBe(state); // Should return the same state object
    });

    it('should move to a valid destination', () => {
      const state = new VillageState("Alice's House", []);
      const newState = state.move("Bob's House");

      expect(newState.place).toBe("Bob's House");
      expect(newState).not.toBe(state); // Should be a new state object
    });
  });

  // Test buildGraph function
  describe('buildGraph', () => {
    it('should build a graph from edges', () => {
      const testRoads = ['A-B', 'B-C', 'C-D'];

      const graph = buildGraph(testRoads);

      expect(graph.A).toContain('B');
      expect(graph.B).toContain('A');
      expect(graph.B).toContain('C');
      expect(graph.C).toContain('B');
      expect(graph.C).toContain('D');
      expect(graph.D).toContain('C');
    });
  });

  // Test findRoute function
  describe('findRoute', () => {
    it('should find the shortest route between two places', () => {
      const route = findRoute(roadGraph, "Alice's House", 'Shop');

      // The route should exist
      expect(route.length).toBeGreaterThan(0);

      // The route should be valid (each step should be connected)
      for (let i = 0; i < route.length - 1; i++) {
        const from = i === 0 ? "Alice's House" : route[i - 1];
        const to = route[i];
        expect(roadGraph[from]).toContain(to);
      }
    });

    it('should return empty array for impossible routes', () => {
      // Create a disconnected graph for testing
      const testGraph = {
        A: ['B'],
        B: ['A'],
        C: ['D'],
        D: ['C'],
      };

      const route = findRoute(testGraph, 'A', 'C');

      expect(route).toEqual([]);
    });
  });

  // Test robot functions
  describe('Robot Functions', () => {
    it('randomRobot should return a valid direction', () => {
      const state = new VillageState("Alice's House", []);
      const result = randomRobot(state);

      expect(roadGraph["Alice's House"]).toContain(result.direction);
    });

    it('goalOrientedRobot should find a route to a parcel', () => {
      const state = new VillageState("Alice's House", [{ place: "Bob's House", address: 'Shop' }]);

      const result = goalOrientedRobot(state, []);

      // Should return a direction that's connected to Alice's House
      expect(roadGraph["Alice's House"]).toContain(result.direction);

      // Memory should contain the rest of the route
      expect(Array.isArray(result.memory)).toBe(true);
    });

    it('routeRobot should follow the mail route', () => {
      const state = new VillageState('Post Office', []);
      const result = routeRobot(state, []);

      // First direction should be the first place in the mail route
      expect(result.direction).toBe("Alice's House");

      // Memory should contain the rest of the mail route
      expect(result.memory.length).toBe(12); // mailRoute.length - 1
    });

    it('lazyRobot should choose an efficient route', () => {
      const state = new VillageState("Alice's House", [
        { place: "Alice's House", address: 'Shop' },
        { place: "Bob's House", address: 'Post Office' },
      ]);

      const result = lazyRobot(state, []);

      // Should return a valid direction
      expect(roadGraph["Alice's House"]).toContain(result.direction);

      // Memory should contain the rest of the route
      expect(Array.isArray(result.memory)).toBe(true);
    });
  });
});
