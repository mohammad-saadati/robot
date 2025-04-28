export class PGroup<T> {
  private members: T[];

  private constructor(members: T[]) {
    this.members = members;
  }

  static empty = new PGroup<any>([]);

  has(value: T): boolean {
    return this.members.includes(value);
  }

  add(value: T): PGroup<T> {
    if (this.has(value)) return this;
    return new PGroup([...this.members, value]);
  }

  delete(value: T): PGroup<T> {
    if (!this.has(value)) return this;
    return new PGroup(this.members.filter((member) => member !== value));
  }
}

// --- Example usage ---
const a = PGroup.empty.add('a');
const ab = a.add('b');
const b = ab.delete('a');

console.log(b.has('b')); // → true
console.log(a.has('b')); // → false
console.log(b.has('a')); // → false
