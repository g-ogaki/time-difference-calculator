import { useState, useEffect, useRef } from "react";
import { LocationProp, CitiesProp } from "./utils"
import Awesomplete from "awesomplete";
import "awesomplete/awesomplete.css";
import { useApp } from "./App";
import { useLocation } from "./Location";

export default function AutoCompleteInput({ isHere }: { isHere: boolean }) {
  const URL = process.env.REACT_APP_API_URL || '';

  const [awesomplete, setAwesomplete] = useState<Awesomplete | null>(null);
  const [suggestions, setSuggestions] = useState<CitiesProp>({});
  const suggestionsRef = useRef<CitiesProp>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const { setHereLocation, setThereLocation } = useApp();
  const { setHereOffset, setThereOffset } = useLocation();

  async function onInput(query: string) {
    const response = await fetch(URL + (URL.startsWith("http://localhost") ? `/api/search?query=${query}` : `?path=search&query=${query}`));
    const data = await response.json();
    setSuggestions(data);
    suggestionsRef.current = data;
  }

  async function onComplete(city: string) {
    // location
    const location: LocationProp = suggestionsRef.current[city];
    isHere ? setHereLocation(location) : setThereLocation(location);
    // offset
    const response = await fetch(URL + (URL.startsWith("http://localhost") ? `/api/offset?lat=${location["lat"]}&lng=${location["lng"]}` : `?path=offset&lat=${location["lat"]}&lng=${location["lng"]}`));
    const data = await response.json();
    isHere ? setHereOffset(data) : setThereOffset(data);
  };

  useEffect(() => {
    if (inputRef.current) {
      const newAwesomplete = new Awesomplete(inputRef.current, {
        list: [],
        minChars: 2,
        autoFirst: true,
        filter: Awesomplete.FILTER_STARTSWITH,
      });

      const input: HTMLInputElement = newAwesomplete.input as HTMLInputElement;

      input.addEventListener("input", event => {
        onInput((event.target as HTMLInputElement).value);
      })

      input.addEventListener("awesomplete-selectcomplete", event => {
        onComplete((event.target as HTMLInputElement).value);
      })

      setAwesomplete(newAwesomplete);

      return () => { awesomplete?.destroy(); };
    }
  }, []);

  useEffect(() => {
    if (awesomplete) awesomplete.list = Object.keys(suggestionsRef.current);
  }, [suggestions]);

  return (
    <input type="text" ref={inputRef} className="awesomplete" />
  );
};
