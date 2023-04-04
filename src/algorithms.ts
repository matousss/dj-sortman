import {NotifyArray} from "./notifyArray";

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function bubbleSort(array: NotifyArray) {
    while (!await array.isSorted()) {
        for (let i = 0; i < array.length() - 1; i++) {
            if (await array.compare(i, i + 1)) {
                await array.swap(i, i + 1)
            }
        }
    }

    return array;
}

export async function selectionSort(array: NotifyArray, start = 0, end?: number | undefined): Promise<NotifyArray> {
    if (end === undefined) end = array.length() - 1;

    for (let i = start; i < end; i++) {
        let min = i;
        for (let j = i + 1; j < end + 1; j++) {
            if (!await array.compare(j, min)) {
                min = j;
            }
        }
        await array.swap(i, min)
    }

    return array;
}

async function findLowest(array: NotifyArray, start = 0) {
    let min = start
    for (let i = start + 1; i < array.length(); i++) {
        if (await array.compare(min, i)) min = i;
    }
    return min;
}

export async function mergeSort(array: NotifyArray) {
    for (let i = 1; i / 2 < array.length(); i *= 2) {
        for (let j = 0; j < array.length(); j += i) {
            await selectionSort(array, j, Math.min(j + i, array.length() - 1))
        }
    }
}

export async function bogoSort(array: NotifyArray) {
    const randPos = () => getRandomInt(0, array.length() - 1)

    while (!await array.isSorted()) {
        for (let i = 0; i < array.length(); i++) await array.swap(i, randPos());
    }
}

export async function bozoSort(array: NotifyArray) {
    const randPos = () => getRandomInt(0, array.length() - 1)

    while (!await array.isSorted()) {
        await array.swap(randPos(), randPos());
    }
}


export function fishYates(array: Array<any>) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

export async function fishYatesInteractive(array: NotifyArray): Promise<NotifyArray> {
    let currentIndex = array.length(), randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        await array.swap(currentIndex, randomIndex)
    }
    return array;
}