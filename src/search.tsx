import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import Spinner from './components/spinner';
import { Menu, Transition } from "@headlessui/react";
import type { FilterArr, data, FetchFun } from './types/search';
import { sort } from './types/search';

const classNames: Function = (...classes: Array<string>): string => classes.filter(Boolean).join(' ');

const fetchData: Function = async ({ login, page, sorting }: FetchFun): Promise<{ success: boolean; items?: Array<data>; total_count?: number; }> => {
    return new Promise(async (resolve) => {
        try {
            const SORT = sorting ? sort[sorting] : sort[3];
            const response = await axios({
                method: "GET",
                url: `https://api.github.com/search/users?q=${login}&per_page=9&page=${page}&sort=${SORT}`
            })

            const { items, total_count } = response.data;
            if (items) {
                resolve({
                    success: true,
                    items,
                    total_count
                })
            }

            else {
                alert("API limit exceded");
            }

        } catch (err) { }

        resolve({
            success: false
        })
    })
}

const Search = () => {
    const { login } = useParams();
    const navigator = useNavigate();
    const [data, setData] = useState<Array<data>>([]);
    const [page, setPage] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [query, setQuery] = useState<string>("");
    const [focus, setFocus] = useState<boolean>(true);

    const FilterArr: Array<FilterArr> = [
        {
            name: "Followers",
            onClick: async () => await SetData({ sort: sort.followers })
        },
        {
            name: "Joined",
            onClick: async () => await SetData({ sort: sort.joined })
        },
        {
            name: "Repositories",
            onClick: async () => await SetData({ sort: sort.repositories })
        },
        {
            name: "Best Match",
            onClick: async () => await SetData({ sort: sort.bestMatch })
        }
    ]

    if (!login) {
        navigator('')
    }

    const SetData = async ({ sort }: { sort?: sort }) => {
        setIsLoading(true)
        const { success, items, total_count } = await fetchData({ login, page, sorting: sort });

        if (success) {
            setData(items);
            setTotalItems(total_count)
            setQuery(login as string)
        }

        setIsLoading(false);
    }

    useEffect(() => {
        (async () => await SetData({ sort: sort.bestMatch }))();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        (async () => await SetData({ sort: sort.bestMatch }))();
        // eslint-disable-next-line
    }, [page])

    return (
        <main className='h-full w-screen flex justify-between items-center bg-white flex-col'>
            <section className="h-20 sm:h-24 w-full border-b border-gray-200 flex justify-center items-center px-5">
                <section className='h-14 sm:h-16 max-w-4xl w-full rounded-lg bg-white border duration-300 border-slate-300 flex justify-center items-center mr-5'>

                    <div className='h-full w-5/6 rounded-lg flex justify-start items-center relative'>
                        <div className="hidden sm:flex h-full w-16 justify-center items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <label
                            htmlFor="username"
                            className={classNames(
                                "hidden sm:flex absolute left-16 duration-300 ease-linear bg-white px-1",
                                focus ? "-top-[2px] -translate-y-1/2" : ""
                            )}
                        >Ex. User</label>
                        <input
                            type="text"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            autoComplete="off"
                            className="h-full w-full sm:w-[calc(100%-6rem)] outline-none border-0 px-5 sm:px-0"
                            onFocus={() => setFocus(true)}
                            onBlur={() => {
                                if (query.length === 0)
                                    setFocus(false);
                            }}
                        />
                        {
                            query.length > 0 &&
                            <div
                                className="hidden sm:flex h-full w-8 justify-start items-center cursor-pointer text-gray-600 hover:text-gray-500"
                                onClick={() => setQuery("")}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        }
                    </div>

                    <div className='h-3/6 sm:h-4/6 border-r border-gray-300'></div>

                    <div className='h-full min-w-[65px] sm:min-w-[80px] w-1/6 rounded-lg flex justify-center items-center'>
                        <button
                            onClick={() => {
                                if (query.length > 0) {
                                    (async () => {
                                        setIsLoading(true)
                                        const { success, items, total_count } = await fetchData({ login: query, page: 1 });

                                        if (success) {
                                            setData(items);
                                            setTotalItems(total_count);
                                            setPage(1);
                                        }

                                        setIsLoading(false);
                                    })()
                                    navigator(`/${query}`)
                                }
                            }}
                            className="text-sm sm:text-lg font-normal"
                        >
                            Search
                        </button>
                    </div>
                </section>

                <section className="h-14 sm:h-16 w-28 sm:w-32 rounded-lg bg-white border duration-300 border-slate-300 flex justify-center items-center">
                    <Menu as="div" className="relative inline-block text-left">
                        <div>
                            <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm sm:text-md items-center sm:font-medium text-gray-700">
                                Filter
                                <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                            </Menu.Button>
                        </div>

                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-black overflow-hidden">
                                {
                                    FilterArr.map(({ onClick, name }, index) => {
                                        return (
                                            <Menu.Item
                                                key={index}
                                            >
                                                <p
                                                    className='bg-white cursor-pointer hover:bg-gray-100 text-gray-900 block px-4 py-2 text-sm'
                                                    onClick={() => onClick()}
                                                >
                                                    {name}
                                                </p>
                                            </Menu.Item>
                                        )
                                    })
                                }
                            </Menu.Items>
                        </Transition>
                    </Menu>
                </section>
            </section>

            <section className="max-h-[calc(100%-11rem)] w-full flex justify-center items-start overflow-y-auto custom-scrollbar px-5 overflow-x-auto">
                {isLoading ?
                    <Spinner /> :
                    data.length > 0 ?
                        <div className="py-2 align-middle inline-block max-w-4xl w-full sm:px-6 lg:px-8">
                            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Name
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Role
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {data.map(({ avatar_url, id, login, type, html_url }) => (
                                            <tr key={id}>
                                                <td
                                                    className="px-6 py-4 whitespace-nowrap cursor-pointer"
                                                    onClick={() => window.open(html_url, '_blank')}
                                                >
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <img className="h-10 w-10 rounded-full" src={avatar_url} alt="" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{login}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 ${type.toLowerCase() === "user" ? "bg-green-300 text-green-900" : "bg-red-300 text-red-900"}`}>
                                                        {type}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        : <h1>No result found</h1>}
            </section>

            <div className="bg-white h-16 w-full px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                    <p
                        onClick={() => setPage(page => {
                            if (page - 1 < 1)
                                return 1;

                            else
                                return page - 1
                        })}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                        Previous
                    </p>
                    <p
                        onClick={() => setPage(page => page + 1)}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                        Next
                    </p>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-700">
                            Showing <span className="font-medium">{((page - 1) * 10) + 1} </span> to <span className="font-medium">{Math.min((page * 10), totalItems)}</span> of{' '}
                            <span className="font-medium">{totalItems}</span> results
                        </p>
                    </div>
                    <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            <p
                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-pointer"
                                onClick={() => setPage(page => {
                                    if (page - 1 < 1)
                                        return 1;

                                    else
                                        return page - 1
                                })}
                            >
                                <span className="sr-only">Previous</span>
                                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                            </p>
                            {/* <a
                                href="#"
                                aria-current="page"
                                className="z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium cursor-pointer"
                            >
                                1
                            </a> */}
                            <p
                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-pointer"
                                onClick={() => setPage(page => page + 1)}
                            >
                                <span className="sr-only">Next</span>
                                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                            </p>
                        </nav>
                    </div>
                </div>
            </div>

        </main>
    );
}

export default Search;