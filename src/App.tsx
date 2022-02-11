import { useState } from "react";
import { useNavigate } from 'react-router-dom';

const classNames: Function = (...classes: Array<string>): string => classes.filter(Boolean).join(' ');

const App = () => {
  const [query, setQuery] = useState<string>("");
  const [focus, setFocus] = useState<boolean>(false);
  const navigator = useNavigate();

  return (
    <main className='h-full w-screen flex justify-center items-center bg-white px-10'>
      <section className='h-16 max-w-xl w-full rounded-lg bg-white shadow-xl border duration-300 border-slate-300 flex justify-center items-center'>

        <div className='h-full w-5/6 rounded-lg flex justify-start relative items-center'>
          <div className="h-full w-16 flex justify-center items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <label
            htmlFor="username"
            className={classNames(
              "absolute left-16 duration-300 ease-linear bg-white px-1",
              focus ? "-top-[2px] -translate-y-1/2" : ""
            )}
          >Ex. User</label>
          <input
            type="text"
            id="username"
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoComplete="off"
            onFocus={() => setFocus(true)}
            onBlur={() => {
              if (query.length === 0) {
                setFocus(false);
              }
            }}
            className="h-full w-[calc(100%-6rem)] outline-none border-0"
          />
          {query.length > 0 && <div
            className="h-full w-8 hidden sm:flex justify-start items-center cursor-pointer text-gray-600 hover:text-gray-500"
            onClick={() => setQuery("")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>}
        </div>

        <div className='h-3/6 sm:h-4/6 border-r border-gray-300'></div>

        <div className='h-full min-w-[80px] w-1/6 rounded-lg flex justify-center items-center'>
          <button
            onClick={() => {
              if (query.length > 0) {
                navigator(`/${query}`)
              }
            }}
            className="text-base sm:text-lg font-light sm:font-normal"
          >
            Search
          </button>

        </div>
      </section>
    </main>
  );
}

export default App;