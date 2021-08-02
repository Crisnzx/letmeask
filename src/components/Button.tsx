import { ButtonHTMLAttributes } from 'react';
import '../styles/button.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;


export function Button(props: ButtonProps) {
  console.log(props.className);

  return (
    <button {...props} >{props.children}</button>
  );
}
