import {IQueue, IQueueObject, IRangeObject} from './IQueue';

export default class Queue<T> implements IQueue<T> {

    setSize(size: number): void {
        this.size = size;
    };

    getSize(): number {
        return this.size;
    }


    setCount(count: number): void {
        this.count = count;
    }

    getCount(): number {
        return this.count;
    }

    getActual(): T[] {
        return this.queue.actual;
    }

    getPrev(): T[] {
        return this.queue.prev;
    }

    getNext(): T[] {
        return this.queue.next;
    }

    getAvailability(): number{
        return this.isEnd() ? 0 : (this.count - (this.range.to + this.getNext().length));
    }

    isEnd(): boolean {
        return (this.range.to + this.getNext().length) >= this.count ? true : false;
    }

    isStart(): boolean {
        return (this.range.from - this.getPrev().length) === 1  ? true : false;
    }

    moveForward(): T[] {
        if(!this.queue.next) return null;

        let prev = this.queue.prev;

        this.shiftQueue();

        return prev;
    }

    moveBack(): T[] {
        if(!this.queue.prev) return null;

        let next = this.queue.next;

        this.shiftQueue([], true);

        return next;
    }

    setPrevPiece(piece: T[]): void {
        this.pieceIsValid(piece);

        if(this.isStart()){
            throw Error('queue already in position start');
        }
        
        if(this.isEmpty(this.queue.prev)){
            this.queue.prev = piece;
        }
    }

    setPiece(piece: T[]): void {
        this.pieceIsValid(piece);

        if(this.isEmpty(this.queue.actual)){
            this.queue.actual = piece;

            this.setRange(piece.length);
        } else if(this.isEmpty(this.queue.next)) {
            this.queue.next = piece;
        } else {
            this.shiftQueue(piece);
        }
    }

    getActualRange(): IRangeObject {
        return this.range;
    }

    setActualRange(range: IRangeObject): void {
        this.range = range;
    }

    private pieceIsValid(piece: T[]): void {
        if(!this.size || this.size <= 0){
            throw Error('don`t exist size. Please set size for your queue.');
        }

        if(this.isEmpty(piece)){
            throw Error('empty piece. Please get not empty data piece.')
        }

        if(piece.length > this.size){
            throw Error('length your piece more than size queue.')
        }
    }

    private shiftQueue(new_item: T[] = [], back: boolean = false) {
        if(!back) {
            let new_actual = this.queue.next,
                new_prev = this.queue.actual;

            this.queue.prev = new_prev;
            this.queue.actual = new_actual;
            this.queue.next = new_item;

            this.setRange(new_actual.length);
        } else {
            let new_actual = this.queue.prev,
                new_next = this.queue.actual;

            this.queue.prev = new_item;
            this.queue.actual = new_actual;
            this.queue.next = new_next;

            this.setRange(new_next.length, true, new_actual.length);
        }
    }

    private setRange(len: number, back: boolean = false, prev_len?: number): void {
        if(!this.range.to) {
            this.range.to = len;
        } else {
            if(back){
                this.range.to -= len;
                this.range.from -= prev_len;
            } else {
                this.range.from = this.range.to + 1;
                this.range.to += len;
            }
        }
    }

    private isEmpty(arr: T[]): boolean {
        return arr ? !arr.length : true;
    }

    private size: number;
    private count: number;
    private range: IRangeObject = {
        from : 1,
        to: null
    };
    private queue: IQueueObject<T> = {
        prev : [],
        actual : [],
        next : []
    };
}