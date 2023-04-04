import React, {useEffect, useState} from 'react'
import './App.css'
import {getFrequencyGenerator} from "./soundPlayer";
import {NotifyArray} from "./notifyArray";
import {bogoSort, bozoSort, bubbleSort, fishYates, fishYatesInteractive, mergeSort, selectionSort} from "./algorithms";
import {Bar, Button, Selector, SwitchInput} from "./Components";
import {Transition} from "@headlessui/react";


const frequencyRange = [100, 1000]

const Algorithm: {
    [key: string]: (array: NotifyArray) => any
} = {
    'Bubble Sort': bubbleSort,
    'Selection Sort': selectionSort,
    'Merge Sort': mergeSort,
    'Bogo Sort': bogoSort,
    'Bozo Sort': bozoSort,
}

const AlgorithmNames = Object.keys(Algorithm)
const Speeds = [2, 8, 12, 20, 30, 45, 50, 100, 120, 150, 200, 250, 500, 1000]
const SIZES = [8, 16, 30, 32, 50, 64, 100, 128, 200, 256, 512, 1024]
function App() {
    const [count, setCount] = useState<number>(256)
    const [values, setValues] = useState<number[]>([])
    const [colors, setColors] = useState<Map<number, string>>(new Map<number, string>())
    const [isWorking, setIsWorking] = useState<boolean>(false)
    const [animateShuffle, setAnimateShuffle] = useState<boolean>(true)
    const [algorithm, setAlgorithm] = useState<string>(AlgorithmNames[0])
    const [speed, setSpeed] = useState<number>(12)

    useEffect(() => {
        setValues(fishYates([...Array(count)].map((v, i) => (i + 1) * (100 / count))))
    }, [count])


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


    return (
        <>
            <div
                className={'bg-gray-700 relative z-40 w-[100vw] h-[18vh] flex  overflow-auto shadow-md border-b border-gray-500 text-gray-200 gap-x-4'}>
                <div className={'absolute w-full h-full z-50 bg-gray-700 flex md:flex-row flex-col grid grid-cols-2 lg:grid-cols-6 gap-y-2 p-2'}>
                   <span className={'mt-2 mr-auto'}>
                            Algorithm:
                        </span>
                    <Selector options={AlgorithmNames}
                              selected={algorithm}
                              onChange={setAlgorithm}
                              disabled={isWorking}
                    />
                    <span className={'mt-2 mr-auto'}>
                            Delay:
                        </span>
                    <Selector options={Speeds.map(v => v.toString() + ' ms')}
                              selected={speed.toString() + ' ms'}
                              onChange={v => setSpeed(parseInt(v.replace(' ms', '')))}
                              disabled={isWorking}
                    />


                    <span className={'mt-2 mr-auto'}>
                            Size:
                            </span>
                    <Selector options={SIZES.map(v => v.toString())}
                              selected={count.toString()}
                              onChange={v => setCount(parseInt(v))}
                              disabled={isWorking}
                    />

                    <span className={'mt-2 mr-auto'}>
                        Animate shuffle:
                    </span>
                    <div className={'mb-4'}>
                        <div className={'w-[12rem] flex justify-center'}>
                            <SwitchInput disabled={isWorking} checked={animateShuffle} onChange={setAnimateShuffle}/>
                        </div>

                    </div>
                </div>


                <Transition
                    enterFrom={'-translate-y-[200%]'}
                    leaveTo={'-translate-y-[200%]'}
                    show={!isWorking}
                    className={'fixed flex top-[18%] duration-500 p-0 w-full h-fit'}>
                    <div
                        className={'flex mx-auto w-full md:w-1/2 bg-gray-700 border border-gray-500 border-t-0 shadow-md rounded-b-[80%]'}>
                        <div className={'m-auto p-4 flex flex-col gap-4 text-white'}>
                            <button
                                className={'opacity-100 bg-gray-600 text-3xl p-5 rounded-md shadow-md hover:bg-gray-500 duration-200'}
                                onClick={async () => {
                                    await setIsWorking(true);
                                    await Algorithm[algorithm](getPlayingArray(values));
                                    await playAll();
                                    await setIsWorking(false);
                                }}>
                                Let's rock!
                            </button>
                            <div className={'flex justify-center'}>
                                <Button onClick={async () => {
                                    setIsWorking(true);
                                    animateShuffle ?
                                        (await fishYatesInteractive(getPlayingArray(values)))
                                        : setValues(fishYates([...values]))
                                    setIsWorking(false);
                                }}
                                        disabled={isWorking}
                                >
                                    Shuffle
                                </Button>
                            </div>
                        </div>
                    </div>
                </Transition>
            </div>

            <div className={'relative grow bg-gray-600 flex'}>
                {
                    values.map((v) => <Bar color={colors.get(v)} height={v} key={v}/>)
                }
            </div>

            <a href={'https://github.com/matousss/dj-sortman/'} className={'opacity-30 hover:opacity-90 duration-500 fixed bottom-0 right-0'}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                     className={'w-12 h-12 md:w-20 md:h-20 m-4 '} viewBox="0 0 16 16">
                    <path
                        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                </svg>
            </a>
        </>
    )
}

export default App
