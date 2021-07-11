import * as Comlink from "comlink";

import React, { useState } from "react";

import type { FzfResultItem } from "../lib/main";
import FzfWorker from "../utils/fzf-worker?worker";

const fzfFindAsync = Comlink.wrap(new FzfWorker());

export function WithWorker() {
  const [input, setInput] = useState("");

  const [result, setResult] = useState<FzfResultItem[]>([]);

  const handleInputChange = async (input: string) => {
    setInput(input);
    if (input === "") {
      setResult([]);
      return;
    }

    // @ts-ignore
    const result = await fzfFindAsync(input);
    setResult(result);
  };

  return (
    <div className="min-h-screen antialiased break-words px-6 py-4">
      <div>
        <input
          autoFocus
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          className="py-2 px-3 w-full border-b-2 border-gray-400 outline-none focus:border-purple-500"
          placeholder="Type to search"
        />
      </div>
      <div className="pt-2">
        {input !== "" ? (
          <ul>
            {result.map((item) => (
              <li key={item.str} className="py-1">
                <HighlightChars
                  str={item.str}
                  highlightIndices={item.pos ?? []}
                />
                <span className="text-sm pl-4 italic text-gray-400">
                  {item.result.score}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-600 py-1">
            List MRU + contextual when query or in frequency (frequent +
            recency) when input is empty
          </div>
        )}
      </div>
    </div>
  );
}

interface HighlightCharsProps {
  str: string;
  highlightIndices: number[];
}

const HighlightChars = (props: HighlightCharsProps) => {
  const strArr = props.str.split("");
  const nodes = strArr.map((v, i) => {
    if (props.highlightIndices.includes(i)) {
      return (
        <span key={i} className="font-semibold">
          {v}
        </span>
      );
    } else {
      return v;
    }
  });

  return <>{nodes}</>;
};
