import { useReducer } from "react";

export const CountButton = () => {
  const [count, increase] = useReducer((c) => c + 1, 0);

  return (
    <button
      onClick={() => increase()}
      type="button"
      className="flex flex-row items-center rounded-lg border-none bg-slate-50 px-4 py-2 text-sm
      text-slate-800 shadow-lg
      transition-all hover:bg-slate-100 hover:text-slate-900 hover:shadow-md active:scale-105"
    >
      Count:
      <span className="ml-2 inline-flex h-4 w-8 items-center justify-center rounded-full text-xs font-semibold">
        {count}
      </span>
    </button>
  );
};
