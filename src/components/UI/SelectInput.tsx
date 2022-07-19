import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";

export default function Select({
  selected,
  onChange,
  options,
  title,
  defaultName,
  children,
}: {
  selected: string;
  onChange: (value: string) => void;
  options: string[];
  title: string;
  defaultName: string;
  children?: JSX.Element;
}) {
  return (
    <div className="flex items-end">
      <div className="w-full sm:w-80">
        <p className="text-lg mb-1 sm:mb-1.5 lg:mb-2 lg:text-xl">{title}:</p>
        <Listbox value={selected} onChange={(value) => onChange(value)}>
          <div className="relative">
            <Listbox.Button className="relative w-full rounded-full bg-violet-100 h-10 pl-6 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 text-slate-800 font-bold text-md">
              <span className="block text-slate-800 truncate capitalize">
                {selected === "" ? defaultName : selected}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 stroke-slate-800">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                  />
                </svg>
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute mt-1 w-full overflow-auto rounded-xl bg-violet-100 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-slate-800 text-md z-50">
                {options.map((person) => (
                  <Listbox.Option
                    key={person}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? "bg-violet-200" : ""
                      }`
                    }
                    value={person}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate capitalize ${
                            selected ? "font-bold" : "font-semibold"
                          }`}
                        >
                          {person === "" ? defaultName : person}
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 stroke-violet-800">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>
      {children}
    </div>
  );
}
