import { ChangeEventHandler, FC, MouseEventHandler, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faMinus } from "@fortawesome/free-solid-svg-icons";
import "./Checkbox.scss";

export const Checkbox: FC<{
  label?: string,
  name?: string,
  checked: boolean | 'indeterminate';
  className?: string;
  readonly?: boolean;
  disabled?: boolean;
  onChange(checked: boolean, name?: string): void;
}> = ({ label, name, checked = false, className, readonly, disabled, onChange }) => {

  const onMouseDown: MouseEventHandler<HTMLInputElement> = (event) => {
    event.stopPropagation();
    if (readonly || disabled) event.preventDefault();
    if (checked === 'indeterminate') {
      onChange(false, name);
    } else {
      onChange(!checked, name);
    }
  }

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (readonly || disabled) event.preventDefault();
    if (checked === 'indeterminate') {
      onChange(false, name);
    } else {
      onChange(!checked, name);
    }
  }

  const Icon = useMemo(() => {
    if (checked === true) {
      return <FontAwesomeIcon className="checkbox-icon" icon={faCheck} />
    }
    if (checked === 'indeterminate') {
      return <FontAwesomeIcon className="checkbox-icon" icon={faMinus} />
    }
    return null;
  }, [checked]);

  const checkedClassName = useMemo(() => {
    let base = "checkbox-container";
    if (className) base += ` ${className}`;
    if (checked) base += ' is-checked';
    if (readonly) base += ' readonly';
    if (disabled) base += ' disabled';
    return base;
  }, [className, checked, readonly, disabled]);

  return (
    <div className={checkedClassName}>
      <div className="checkbox">
        <input
          type='checkbox'
          className="checkbox-input"
          checked={checked === 'indeterminate' ? false : checked}
          onChange={handleChange} />
        {Icon}
      </div>
      {label &&
        <label className="checkbox-label">
          {label}
        </label>
      }
    </div>
  )
}