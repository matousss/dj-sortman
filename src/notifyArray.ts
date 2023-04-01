export class NotifyArray {
    array: number[];
    onGet: (index: number, value: number) => void;
    onSet: (index: number, value: number) => void;
    onSwap: (index1: number, v1: number, index2: number, v2: number) => void;
    onCompare: (index1: number, v1: number, index2: number, v2: number) => void;

    constructor(values: number[]) {
        this.array = values;
        this.onGet = this.onSet = this.onSwap = this.onCompare = () => {
        };
    }

    async get(index: number) {
        await this.onGet(index, this.array[index]);
        return this.array[index];
    }

    async set(index: number, value: number) {
        this.array[index] = value;
        await this.onSet(index, value);
    }

    async swap(index1: number, index2: number) {
        let a = this.array[index1];
        this.array[index1] = this.array[index2];
        this.array[index2] = a;
        await this.onSwap(index1, this.array[index1], index2, this.array[index2]);
    }

    async compare(index1: number, index2: number) {
        await this.onCompare(index1, this.array[index1], index2, this.array[index2]);
        if (this.array[index2] === undefined) return true;
        if (this.array[index1] === undefined) return false;
        return this.array[index1] > this.array[index2];
    }

    getValues = () => [...this.array];

    async isSorted() {
        for (let i = 0; i < this.array.length - 1; i++) if (await this.compare(i, i+1)) return false
        return true;

    }

    length = () => this.array.length;


    slice = (start: number, end: number) => {
        let a = new NotifyArray(this.array.slice(start, end));
        a.onGet = this.onGet;
        a.onSet = this.onSet;
        a.onSwap = this.onSwap;
        a.onCompare = this.onCompare;
        return a;
    };
}