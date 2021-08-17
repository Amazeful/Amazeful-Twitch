import { Heap } from "../Heap";
describe("./data_structures/Heap", () => {
  test("should push and pop elements in correct order", () => {
    let heap = new Heap<number>((a, b) => a - b);

    let elements = [10, 5, 1, 24, 14, 4, 1, 5];

    for (var elem of elements) {
      heap.push(elem);
    }

    expect(heap.remove()).toBe(1);
    expect(heap.remove()).toBe(1);
    expect(heap.remove()).toBe(4);

    expect(heap.size).toBe(5);
  });
});
