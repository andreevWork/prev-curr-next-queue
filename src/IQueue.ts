export interface IQueue {
    setSize(size: number): void;
    setCount(count: number): void;
    getSize(): number;
    getCount(): number;
}