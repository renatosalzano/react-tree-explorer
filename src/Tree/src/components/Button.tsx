import { ButtonHTMLAttributes, DetailedHTMLProps, FC, MouseEventHandler, ReactNode, useMemo, useRef } from "react";

type Props = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  label?: string;
  active?: boolean;
}

export const Button: FC<Props> = ({
  label,
  active,
  className = "tree--btn",
  onClick,
  onDoubleClick,
  ...props
}) => {

  const lastClick = useRef(0);

  const onclick: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const now = new Date().getTime();

    const diff = now - lastClick.current;
    if (diff > 0 && diff <= 500) {
      onDoubleClick && onDoubleClick(event);
    } else {
      onClick && onClick(event)
    }

    lastClick.current = now;

  }

  const btnClass = useMemo(() => {
    let c = className || `tree--btn`;
    if (active) c += " active";
    return c;
  }, [className, active])

  return (
    <button
      type={props.type || 'button'}
      className={btnClass}
      onClick={onclick}
      {...props}
    >
      {props.children
        ? props.children
        : label
      }
    </button>
  )
}