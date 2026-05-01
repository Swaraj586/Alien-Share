import React, { useRef } from 'react';

export default function CodeInput({ value, onChange }) {
  const inputs = useRef([]);

  const handleInput = (e, index) => {
    const val = e.target.value;
    if (!/^\d*$/.test(val)) return;

    const newCode = value.split('');
    newCode[index] = val.slice(-1);
    onChange(newCode.join(''));

    if (val && index < 3) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  return (
    <div className="flex gap-2">
      {[0, 1, 2, 3].map((i) => (
        <input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          type="text"
          maxLength="1"
          value={value[i] || ""}
          onChange={(e) => handleInput(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          className="w-14 h-16 text-3xl text-center bg-zinc-800 border-2 border-[rgb(24,99,112)] rounded-xl text-[rgb(141,167,175)] focus:border-[rgb(141,167,175)] outline-none transition-all"
        />
      ))}
    </div>
  );
}