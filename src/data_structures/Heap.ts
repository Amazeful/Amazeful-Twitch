import { ComperatorFunc } from "../types/Misc";

//Heap defines a heap data structure
export class Heap<T> {
  protected items: T[];
  protected comperator: ComperatorFunc<T>;

  constructor(comperator: ComperatorFunc<T>) {
    this.comperator = comperator;
    this.items = [];
  }

  /**
   * Adds an element to the heap
   * @param elem element to insert
   */
  public push(elem: T) {
    this.items.push(elem);
    this.bubbleUp();
  }

  /**
   * Removes the first elem from heap
   */
  public remove() {
    if (this.isEmpty) return null;

    [this.items[0], this.items[this.size - 1]] = [
      this.items[this.size - 1],
      this.items[0],
    ];

    var value = this.items.pop();
    this.bubbleDown();
    return value;
  }

  /**
   * Returns true if the heap is empty, false otherwise
   */
  public get isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * Returns size of the heap
   */
  public get size(): number {
    return this.items.length;
  }

  private bubbleUp() {
    var cur = this.items.length - 1;
    var parent = this.parent(cur);
    while (
      parent >= 0 &&
      this.comperator(this.items[parent], this.items[cur]) > 0
    ) {
      [this.items[parent], this.items[cur]] = [
        this.items[cur],
        this.items[parent],
      ];
      cur = parent;
      parent = this.parent(cur);
    }
  }

  private bubbleDown() {
    var cur = 0;
    var topChild = this.topChild(cur);
    while (
      this.leftChild(cur) < this.size &&
      this.comperator(this.items[cur], this.items[topChild]) > 0
    ) {
      [this.items[cur], this.items[topChild]] = [
        this.items[topChild],
        this.items[cur],
      ];

      cur = topChild;
      topChild = this.topChild(cur);
    }
  }

  private parent(index: number): number {
    return Math.floor((index - 1) / 2);
  }

  private leftChild(index: number): number {
    return 2 * index + 1;
  }

  private rightChild(index: number): number {
    return 2 * index + 2;
  }

  private topChild(index: number): number {
    var left = this.leftChild(index);
    var right = this.rightChild(index);
    if (
      right < this.size &&
      this.comperator(this.items[left], this.items[right]) > 0
    ) {
      return right;
    }

    return left;
  }
}
