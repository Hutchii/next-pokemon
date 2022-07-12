import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";

export default function Select({
  selected,
  onChange,
  options,
  title,
  firstValue,
}: {
  selected: string;
  onChange: (value: string) => void;
  options: string[];
  title: string;
  firstValue: string;
}) {
  return (
    <div className="w-72 z-20">
      <p className="mb-3 text-xl font-medium">{title}:</p>
      <Listbox value={selected} onChange={onChange}>
        <div className="relative">
          <Listbox.Button className="relative w-full rounded-full bg-white h-10 pl-6 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 text-slate-800 font-bold text-md">
            <span className="block text-black truncate capitalize">
              {selected === "" ? firstValue : selected}
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
            <Listbox.Options className="absolute mt-1 w-full overflow-auto rounded-xl bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-slate-800 text-md">
              {options.map((person) => (
                <Listbox.Option
                  key={person}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-violet-100" : ""
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
                        {person === "" ? firstValue : person}
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
  );
}
