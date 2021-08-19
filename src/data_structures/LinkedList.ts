export class Node<T> {
  public val: T | null;
  public next: Node<T> | null;
  public prev: Node<T> | null;

  constructor(
    val: T,
    next: Node<T> | null = null,
    prev: Node<T> | null = null
  ) {
    this.val = val;
    this.next = next;
    this.prev = prev;
  }
}

export class LinkedList<T> {
  private _head: Node<T> | null;
  private _tail: Node<T> | null;
  private _length: number;

  constructor() {
    this._head = null;
    this._tail = null;
    this._length = 0;
  }

  /**
   * Add a value to the end linked list
   * @param val value to add to the list
   */
  public push(val: T) {
    var node = new Node(val);

    if (this._head === null) {
      this._head = node;
      this._tail = node;
    } else {
      this._tail!.next = node;
      node.prev = this._tail;
      this._tail = node;
    }
    this._length++;
  }

  /**
   * Add a value to the front of the list
   * @param val value to add to the list
   */
  public unshift(val: T) {
    var node = new Node(val);
    if (this._head === null) {
      this._head = node;
      this._tail = node;
    } else {
      this._head.prev = node;
      node.next = this._head;
      this._head = node;
    }
    this._length++;
  }

  /**
   * Remove the last element in the linked list
   * @returns last element in the list
   */
  public pop() {
    if (!this._head) return null;

    let curTail = this._tail;
    if (this._length === 1) {
      this._head = null;
      this._tail = null;
    } else {
      this._tail = curTail!.prev;
      this._tail!.next = null;
      curTail!.prev = null;
    }
    this._length--;
    return curTail;
  }

  /**
   * Remove the first element in the list
   * @returns first element in the list
   */
  public shift() {
    if (!this._head) return null;
    let curHead = this._head;
    if (this._length === 1) {
      this._head = null;
      this._tail = null;
    } else {
      this._head = curHead.next;
      this._head!.prev = null;
      curHead.next = null;
    }
    this._length--;
    return curHead;
  }

  /**
   * Convert linked list to array
   * @returns array
   */
  public toArray() {
    if (!this._head) return [];
    var head: Node<T> | null = this._head;
    var result = [];
    while (head !== null) {
      result.push(head.val);
      head = head.next;
    }
    return result;
  }

  public get head() {
    return this._head;
  }

  public get tail() {
    return this._tail;
  }

  public get length() {
    return this._length;
  }
}
