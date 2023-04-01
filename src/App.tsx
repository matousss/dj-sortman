import React, {useEffect, useState} from 'react'
import './App.css'
import {getFrequencyGenerator} from "./soundPlayer";
import {NotifyArray} from "./notifyArray";
import {bubbleSort, fishYates, fishYatesInteractive, mergeSort, selectionSort} from "./algorithms";
import {Bar, Button, Selector, SwitchInput} from "./Components";
import {Transition} from "@headlessui/react";


const frequencyRange = [100, 1000]

const Algorithm: {
    [key: string]: (array: NotifyArray) => any
} = {
    'Bubble Sort': bubbleSort,
    'Selection Sort': selectionSort,
    'Merge Sort': mergeSort,
}

const AlgorithmNames = Object.keys(Algorithm)
const Speeds = [2, 8, 12, 20, 30, 45, 50, 100, 120, 150, 200, 250, 500, 1000]
const SIZES = ['16', '30', '32', '50', '64', '128', '100', '256', '1024']
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
                    <Selector options={SIZES}
                              selected={'128'}
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
        </>
    )
}

export default App
