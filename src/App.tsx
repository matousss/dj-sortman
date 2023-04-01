import {useEffect, useState} from 'react'
import './App.css'
import {getFrequencyGenerator} from "./soundPlayer";
import {NotifyArray} from "./notifyArray";

function shuffle(array: Array<any>) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

async function shuffleInteractive(array: NotifyArray): Promise<NotifyArray> {
    let currentIndex = array.length(), randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        await array.swap(currentIndex, randomIndex)
    }
    return array;
}
const Bar = ({color = 'white', height = 100}) =>
    <div className={'grow flex pr-[1px]'}>
        <div className={'w-full mt-auto'} style={{height: `${height}%`, backgroundColor: color}}>

        </div>
    </div>

const Bars = ({values, colors}: { values: number[], colors: Map<number, string> }) =>
    <div className={'grow bg-gray-600 flex'}>
        {
            values.map((v) => <Bar color={colors.get(v)} height={v} key={v}/>)
        }
    </div>

const frequencyRange = [100, 1000]

function App() {
    const l = 256;
    const speed = 12;
    const [values, setValues] = useState<number[]>([...Array(l)].map((v, i) => (i + 1) * (100 / l)))
    const [colors, setColors] = useState<Map<number, string>>(new Map<number, string>())

    useEffect(() => {
        console.log('values', values)
    }, [values])


    const playSound = getFrequencyGenerator()
    const getPlayingArray = (values: number[]) => {
        let array = new NotifyArray(values);
        array.onSwap = async (index1, v1, index2, v2) => {
            setValues(array.getValues())
            setColors(new Map<number, string>([
                [v1, 'red'],
                [v2, 'red'],
            ]))
            await playSound(
                (v1 + v2) / 2 * (frequencyRange[1] - frequencyRange[0]) / 100 + frequencyRange[0],
                speed
            )
            setColors(new Map<number, string>())
        }

        array.onCompare = (index1, v1, index2, v2) => {
            setColors(new Map<number, string>([
                [v1, 'red'],
                [v2, 'red'],
            ]))
        }
        return array;
    }

    const playAll = async () => {
        setColors(new Map<number, string>());
        for (let i = 0; i < values.length; i++) {
            let map = new Map<number, string>(colors.entries())
            for (let j = 0; j <= i; j++) map.set(values[j], 'green')
            await setColors(map)
            await playSound(
                values[i] * (frequencyRange[1] - frequencyRange[0]) / 100 + frequencyRange[0],
                speed
            )
        }
        setColors(new Map<number, string>());
    }

    async function bubbleSort(array: NotifyArray) {
        while (!await array.isSorted()) {
            for (let i = 0; i < array.length() - 1; i++) {
                if (await array.compare(i, i + 1)) {
                    await array.swap(i, i + 1)
                }
            }
        }

        return array;
    }

    async function selectionSort(array: NotifyArray, start = 0, end?: number | undefined): Promise<NotifyArray> {
        if (end === undefined) end = array.length() - 1;
        console.log(array.length())
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

    async function mergeSort(array: NotifyArray) {
        for (let i = 1; i / 2 < array.length(); i *= 2) {
            console.log(i)
            for (let j = 0; j < array.length(); j += i) {
                console.log(j, j + i)
                await selectionSort(array, j, Math.min(j + i, array.length() - 1))
            }
        }
    }


    return (
        <>
            <div className={'h-[20vh] p-2'}>
                <button onClick={() => setValues(shuffle([...values]))}>
                    Shuffle (No Animation)
                </button>
                <button onClick={async () => await shuffleInteractive(getPlayingArray(values))}>
                    Fisher–Yates shuffle
                </button>
                <button className={'button'} onClick={() => playSound(1000, 125)}>Test Sound</button>
                <button className={'button'} onClick={playAll}>
                    Play All
                </button>
                <button onClick={async () => {
                    await bubbleSort(getPlayingArray(values))
                    await playAll()
                }
                }>
                    Bubble Sort
                </button>
                <button onClick={async () => {
                    await selectionSort(getPlayingArray(values))
                    await playAll()
                }}>
                    Selection Sort
                </button>
                <button onClick={async () => {
                    await mergeSort(getPlayingArray(values))
                    await playAll()
                }}>
                    Merge Sort
                </button>
                <button onClick={async () => {
                    let a = getPlayingArray(values);
                    let p = [...[...Array(1000)].map(() => shuffleInteractive(a))];
                    await Promise.all(p);
                }}>
                    Plz no
                </button>
            </div>
            <Bars values={values} colors={colors}/>
        </>
    )
}

export default App
