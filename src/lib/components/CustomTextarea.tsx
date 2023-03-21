/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useRef, useState } from "react";

interface CustomTextareaProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  style?: React.CSSProperties;
  className?: string;
}

export const CustomTextarea: FC<CustomTextareaProps> = ({
  placeholder,
  value,
  onChange,
  style,
  className,
}) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState(value ?? "");

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "0px";
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  }, [ref, text]);

  useEffect(() => {
    onChange?.({ target: { value: text } } as any);
  }, [text]);

  return (
    <textarea
      className={className}
      style={style}
      placeholder={placeholder}
      value={value}
      onChange={(e) => setText(e.target.value)}
      ref={ref}
    />
  );
};
