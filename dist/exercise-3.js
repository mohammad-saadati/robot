'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.PGroup = void 0;
class PGroup {
  constructor(members) {
    this.members = members;
  }
  has(value) {
    return this.members.includes(value);
  }
  add(value) {
    if (this.has(value)) return this;
    return new PGroup([...this.members, value]);
  }
  delete(value) {
    if (!this.has(value)) return this;
    return new PGroup(this.members.filter((member) => member !== value));
  }
}
exports.PGroup = PGroup;
PGroup.empty = new PGroup([]);
// --- Example usage ---
const a = PGroup.empty.add('a');
const ab = a.add('b');
const b = ab.delete('a');
console.log(b.has('b')); // → true
console.log(a.has('b')); // → false
console.log(b.has('a')); // → false
