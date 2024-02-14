import { FC, ReactElement, cloneElement, useRef } from 'react'
import { useMounted } from '../utils/lifecycle'

export const ResizableContainer: FC<{
  children: ReactElement
}> = ({
  children
}) => {

    const ref = useRef<HTMLElement>(null)
    useMounted(() => {
      console.log(ref.current)
    })

    return cloneElement(children, { ref })
  }