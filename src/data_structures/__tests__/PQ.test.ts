import { PQ } from "../PQ";
describe("./data_structures/PQ", () => {
  test("should enqueue and dequeue in correct order", () => {
    let pq = new PQ();

    let elements = [[1, 3], [10, 4], [2, 1], [1], [4, 3], [20, 1]];

    for (var elem of elements) {
      pq.enqueue(elem[0], elem[1]);
    }

    expect(pq.dequeue()).toBe(10);
    expect(pq.dequeue()).toBe(1);
    expect(pq.dequeue()).toBe(4);

    pq.clear();
    expect(pq.size).toBe(0);
    expect(pq.isEmpty).toBe(true);
  });
});
