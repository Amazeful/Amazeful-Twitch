import { LinkedList } from "../LinkedList";
describe("./data_structures/LinkedList", () => {
  test("should add and remove in correct order", () => {
    let list = new LinkedList<number>();

    list.push(1);
    list.push(2);
    list.push(3);
    list.unshift(5);
    list.push(4);

    expect(list.pop()?.val).toBe(4);
    expect(list.shift()?.val).toBe(5);
    expect(list.toArray()).toEqual([1, 2, 3]);
    var head = list.head;
    expect(head!.next!.val).toBe(2);
    expect(list.head?.val).toBe(1);
  });
});
