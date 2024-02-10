import { useEffect, useRef, useState } from "react";

/**
 * 
 * just add callback after setState
 * 
 * @example
 * 
 * const [state, setState] = useSetState('foo');
 * 
 * const doSomething = () => {
 *   setState(
 *     // update state
 *     (prev) => 'bar',
 *     // callback with updated state
 *     (curr) => curr === 'bar'
 *   );
 * }
 */
export function useSetState<T>(initState: T | (() => T)): [T, (update: T | ((prev: T) => T), callback?: (currState: T) => void) => void] {

  const [state, setState] = useState<T>(initState);

  const callbackRef = useRef<Function>();

  const dispatch = (update: T | ((prev: T) => T), callback?: Function) => {

    // cache callback
    if (callback) callbackRef.current = callback;
    setState(update);
  }

  useEffect(() => {
    if (callbackRef.current) {
      // run callback
      callbackRef.current(state);
      callbackRef.current = undefined;
    }

  }, [state])

  return [state, dispatch];

}
