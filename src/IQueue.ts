export interface IQueue<T> {
    setSize(size: number): void;
    getSize(): number;
    setCount(count: number): void;
    getCount(): number;
    getPrev(): T[];
    getActual(): T[];
    getNext(): T[];
    isEnough(): boolean;
    getAvailability(): number;
    getActualRange(): IRangeObject;
    setPiece(piece: T[]): void;
    setPrevPiece(piece: T[]): void;
    moveForward(): T[];
    moveBack(): T[];
}

export interface IRangeObject {
    from : number,
    to : number,
}

export interface IQueueObject<T> {
    prev : T[],
    actual : T[],
    next : T[]
}