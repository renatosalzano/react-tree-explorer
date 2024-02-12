import { useRef, useState } from "react"

type Status = "idle" | "start" | "end" | "start-0" | "end-0";
type Dispatch = (update?: boolean | ((prev: boolean) => boolean), noTransistion?: boolean) => void;


export const useTransistion = (initState = false, ms = 200): [
  boolean,
  Status,
  Dispatch
] => {
  const [state, setState] = useState(!!initState);
  const [status, setStatus] = useState<Status>("idle");

  const dispatch = (update?: boolean | ((prev: boolean) => boolean), noTransistion = false) => {
    const nextState = typeof update === "function" ? update(state) : update;

    if (noTransistion) {

      setState((prev) => {
        prev = nextState || !prev;
        setStatus(() => prev ? "start-0" : "end-0");
        return prev;
      });
      return;
    }

    if (update) {
      setState(() => true);
      setStatus(() => "start");
    } else {
      setStatus("end")
      setTimeout(() => {
        setState(false)
      }, ms);
    }
  }

  return [state, status, dispatch]
}