import { describe, it, expect } from 'vitest';
import { PGroup } from '../src/exercise-3';

// Note: We need to export the PGroup class in the original file
// If it's not exported, add "export" before "class PGroup<T>"

describe('PGroup', () => {
  describe('empty', () => {
    it('should create an empty group', () => {
      const empty = PGroup.empty;
      expect(empty.has('anything')).toBe(false);
    });
  });

  describe('has', () => {
    it('should return true for values in the group', () => {
      const group = PGroup.empty.add('a').add('b');
      expect(group.has('a')).toBe(true);
      expect(group.has('b')).toBe(true);
    });

    it('should return false for values not in the group', () => {
      const group = PGroup.empty.add('a');
      expect(group.has('b')).toBe(false);
      expect(group.has('c')).toBe(false);
    });
  });

  describe('add', () => {
    it('should add a value to the group', () => {
      const a = PGroup.empty.add('a');
      expect(a.has('a')).toBe(true);
    });

    it('should not modify the original group', () => {
      const empty = PGroup.empty;
      const a = empty.add('a');
      expect(empty.has('a')).toBe(false);
      expect(a.has('a')).toBe(true);
    });

    it('should not add duplicate values', () => {
      const a = PGroup.empty.add('a');
      const aa = a.add('a');
      expect(a).toBe(aa); // Should return the same instance
    });

    it('should work with different types', () => {
      const numbers = PGroup.empty.add(1).add(2);
      expect(numbers.has(1)).toBe(true);
      expect(numbers.has(2)).toBe(true);
      expect(numbers.has(3)).toBe(false);
    });
  });

  describe('delete', () => {
    it('should remove a value from the group', () => {
      const ab = PGroup.empty.add('a').add('b');
      const a = ab.delete('b');
      expect(a.has('a')).toBe(true);
      expect(a.has('b')).toBe(false);
    });

    it('should not modify the original group', () => {
      const ab = PGroup.empty.add('a').add('b');
      const a = ab.delete('b');
      expect(ab.has('b')).toBe(true);
      expect(a.has('b')).toBe(false);
    });

    it('should return the same instance if value is not in group', () => {
      const a = PGroup.empty.add('a');
      const stillA = a.delete('b');
      expect(a).toBe(stillA);
    });
  });

  describe('chaining operations', () => {
    it('should support chaining multiple operations', () => {
      const group = PGroup.empty.add('a').add('b').add('c').delete('a').add('d');

      expect(group.has('a')).toBe(false);
      expect(group.has('b')).toBe(true);
      expect(group.has('c')).toBe(true);
      expect(group.has('d')).toBe(true);
    });
  });

  describe('example from code', () => {
    it('should match the example in the code', () => {
      const a = PGroup.empty.add('a');
      const ab = a.add('b');
      const b = ab.delete('a');

      expect(b.has('b')).toBe(true);
      expect(a.has('b')).toBe(false);
      expect(b.has('a')).toBe(false);
    });
  });
});
