import { Menu, Transition } from "@headlessui/react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { Fragment } from "react";

import { classNames } from "~utils";

// const statuses = {
//   Complete: "text-green-700 bg-green-50 ring-green-600/20",
//   "In progress": "text-gray-600 bg-gray-50 ring-gray-500/10",
//   Archived: "text-yellow-800 bg-yellow-50 ring-yellow-600/20",
// };
const projects = [
  {
    id: 1,
    name: "My personal account",
    status: "Complete",
    lastUpdatedOn: "Leslie Alexander",
    lastUsedOn: "March 17, 2023",
  },
  {
    id: 2,
    name: "Main Company account",
    status: "In progress",
    lastUpdatedOn: "Leslie Alexander",
    lastUsedOn: "May 5, 2023",
  },
  {
    id: 3,
    name: "Freelance project",
    status: "In progress",
    lastUpdatedOn: "Courtney Henry",
    lastUsedOn: "May 25, 2023",
  },
  {
    id: 4,
    name: "Billings portal",
    status: "Archived",
    lastUpdatedOn: "Leonard Krasner",
    lastUsedOn: "June 7, 2023",
  },
];

export default function List() {
  return (
    <ul role="list" className="divide-y divide-gray-100 w-[400px] h-96">
      {projects.map((project) => (
        <li
          key={project.id}
          className="flex items-center justify-between gap-x-6 py-5"
        >
          <div className="min-w-0">
            <div className="flex items-start gap-x-3">
              <p className="text-sm font-semibold leading-6 text-gray-900">
                {project.name}
              </p>
              {/* <p
                className={classNames(
                  statuses[project.status],
                  "rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset"
                )}>
                {project.status}
              </p> */}
            </div>
            <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
              <p className="whitespace-nowrap">{project.lastUsedOn}</p>
              <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                <circle cx={1} cy={1} r={1} />
              </svg>
              <p className="truncate">{project.lastUpdatedOn}</p>
            </div>
          </div>
          <div className="flex flex-none items-center gap-x-4">
            <button className="flex gap-1 items-center justify-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
              <PlusCircleIcon className="h-5 w-5" aria-hidden="true" />
              {`Autofill`}
              <span className="sr-only">, {project.name}</span>
            </button>
            {/* Smaller substitue for autofill button */}
            {/* <button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
              <span className="sr-only">{`Autofill Account`}</span>
              <PlusCircleIcon className="h-5 w-5" aria-hidden="true" />
            </button> */}
            <Menu as="div" className="relative flex-none">
              <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                <span className="sr-only">Open options</span>
                <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={classNames(
                          active ? "bg-gray-50" : "",
                          "flex gap-1 px-3 py-1 text-sm leading-6 text-gray-900 w-full text-left",
                        )}
                      >
                        <PencilIcon
                          className="mr-2 h-4 w-4 text-gray-400 -mb-1 mt-1"
                          aria-hidden="true"
                        />
                        Edit<span className="sr-only">, {project.name}</span>
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={classNames(
                          active ? "bg-gray-50" : "",
                          "flex gap-1 px-3 py-1 text-sm leading-6 text-gray-900 w-full text-left",
                        )}
                      >
                        <ArrowUpIcon
                          className="mr-2 h-4 w-4 text-gray-400 -mb-1 mt-1"
                          aria-hidden="true"
                        />
                        Move up
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={classNames(
                          active ? "bg-gray-50" : "",
                          "flex gap-1 px-3 py-1 text-sm leading-6 text-gray-900 w-full text-left",
                        )}
                      >
                        <ArrowDownIcon
                          className="mr-2 h-4 w-4 text-gray-400 -mb-1 mt-1"
                          aria-hidden="true"
                        />
                        Move down
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={classNames(
                          active ? "bg-gray-50" : "",
                          "flex gap-1 px-3 py-1 text-sm leading-6 text-gray-900 w-full text-left",
                        )}
                      >
                        <TrashIcon
                          className="mr-2 h-4 w-4 text-gray-400 -mb-1 mt-1"
                          aria-hidden="true"
                        />
                        Delete<span className="sr-only">, {project.name}</span>
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </li>
      ))}
    </ul>
  );
}
