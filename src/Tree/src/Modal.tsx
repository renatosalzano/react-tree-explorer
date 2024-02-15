import { Dispatch, FC, ReactNode, SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

class Modal {
  id = "react-root-modal";
  root: HTMLDivElement;
  dispatch: any;
  portal: HTMLElement | null = null;
  callback?(): void;

  constructor(id?: string) {
    this.id = id || this.id;
    this.root = document.createElement("div");
    this.root.id = this.id;
    document.body.appendChild(this.root);
  }

  open(content: any, options?: {
    target?: HTMLElement,
    position?: ("top" | "bottom" | "left" | "right")[],
    closeCallback?(): void;
  }) {

    if (options?.target) {
      const { top, bottom, x, right } = options.target.getBoundingClientRect();
      this.root.style.setProperty('--target-top', `${top}px`)
      this.root.style.setProperty('--target-bottom', `${bottom}px`)
      this.root.style.setProperty('--target-left', `${x}px`)
      this.root.style.setProperty('--target-right', `${right}px`)
    }

    if (options?.closeCallback) this.callback = options.closeCallback;

    this.dispatch(() => ({ show: true, content, position: options?.position }))
  }

  close() {
    this.root.style.removeProperty('--target-top')
    this.root.style.removeProperty('--target-bottom')
    this.root.style.removeProperty('--target-left')
    this.root.style.removeProperty('--target-right')
    this.dispatch(() => ({ show: false, content: null, position: undefined }))

    if (this.callback) {
      this.callback();
      this.callback = undefined;
    }
  }

  destroy() {
    this.root.remove();
  }

  init(dispatch) {
    this.dispatch = dispatch;
  }
}

const Portal: FC<Modal> = ({ root, init, close }) => {

  const ref = useRef<HTMLDivElement>(null)

  const [state, setState] = useState<{
    show: boolean;
    position?: ("top" | "bottom" | "left" | "right")[];
    content: ReactNode | null;
  }>({
    show: false,
    position: undefined,
    content: null,
  });

  useEffect(() => {
    init(setState);
  }, []);

  const clickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      console.log("click outside")
      close();
    }
  }

  useEffect(() => {
    if (state.show) {
      window.addEventListener("click", clickOutside, true)
    } else {
      window.removeEventListener("click", clickOutside, true)
    }

  }, [state.show]);

  const portalClass = useMemo(() => {
    let c = "portal-container"
    if (state.position) {
      state.position.forEach((pos) => c += ` ${pos}`)
    }
    return c;
  }, [state.position]);

  return state.show
    ? createPortal(<div ref={ref} className={portalClass}>{state.content}</div>, root)
    : null;
}


export const useModal = (id?: string) => {
  const modal = useRef(new Modal(id)).current;

  const methods = {
    open: modal.open.bind(modal),
    close: modal.close.bind(modal),
    destroy: modal.destroy.bind(modal),
    init: modal.init.bind(modal)
  }

  const props = {
    ...modal,
    ...methods
  }

  return { open: methods.open, destroy: methods.destroy, close: methods.close, modal: props, Portal }
}