import React, {Fragment} from "react";
import {Listbox, Switch, Transition} from "@headlessui/react";
import {CheckIcon, ChevronUpDownIcon} from "@heroicons/react/24/solid";


export const Bar = ({color = 'white', height = 100}) =>
    <div className={'grow flex md:pr-[1px]'}>
        <div className={'w-full mt-auto'} style={{height: `${height}%`, backgroundColor: color}}>

        </div>
    </div>


export const SwitchInput = ({checked, onChange, disabled}: { checked: boolean, onChange: (checked: boolean) => void, disabled?: boolean}) =>
    <Switch
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={`${checked ? 'bg-slate-500' : 'bg-gray-600'} ${disabled ? 'pointer-events-none' : ''} 
          relative inline-flex h-8 p-1 w-[3.5rem] border border-transparent group-hover:border-gray-400 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
    >
        <span
            aria-hidden="true"
            className={`${checked ? 'translate-x-[100%]' : 'translate-x-0'} ${disabled ? 'bg-gray-400' : 'duration-200  bg-white'} 
            pointer-events-none inline-block transform rounded-full shadow-lg ring-0 transition  
            ease-in-out h-[100%] w-[50%]
            `}
        />
    </Switch>

export const Selector = ({
                             options, selected, onChange, disabled
                         }: { options: string[], selected: string, onChange: (selected: string) => void, disabled: boolean }) =>
    <Listbox value={selected} onChange={onChange} disabled={disabled}>
        <div className="relative ml-1">
            <Listbox.Button
                as={'button'}

                className={
                `${disabled ? 'pointer-events-none text-gray-400' : ''} relative w-[90%] text-right cursor-default rounded-lg bg-gray-600 py-2 pl-3 pr-10 text-left shadow-sm text-sm md:text-lg`
            }>
                <span className="block truncate">{selected}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400"/>
                </span>
            </Listbox.Button>

            <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className={'relative w-full'}>
                    <Listbox.Options
                        className="fixed mt-1 z-50 max-h-60 w-auto overflow-auto rounded-md bg-gray-600 py-1 shadow-lg sm:text-sm">
                        {options.map((v, i) => (
                            <Listbox.Option
                                key={i}
                                className={({active}) =>
                                    `text-sm md:text-base relative cursor-default select-none py-2 pl-10 pr-4 mx-1 hover:bg-gray-500
                                ${active ? 'bg-gray-600 text-gray-300' : 'text-gray-200'}`}
                                value={v}
                            >
                                {({selected}) => (
                                    <>
                                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                        {v}
                                    </span>

                                        {selected && (
                                            <span
                                                className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <CheckIcon className="h-5 w-5" aria-hidden="true"/>
                                    </span>
                                        )}
                                    </>
                                )}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </div>
            </Transition>
        </div>
    </Listbox>

export const Button = ({
                           onClick,
                           children,
                           disabled
                       }: { onClick: () => void, children: React.ReactNode, disabled?: boolean }) =>
    <button
        className={'opacity-80 shadow-sm bg-gray-600 hover:bg-gray-500 disabled:hover:bg-gray-600 disabled:opacity-9 disabled:cursor-not-allowed duration-200 rounded-lg text-sm p-1 md:text-lg md:p-1'}
        onClick={onClick} disabled={disabled}>
        {children}
    </button>