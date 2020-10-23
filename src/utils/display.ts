export const displayMemory = (input: number | string): string => {
  if (typeof input === "string") {
    return input;
  }

  if (input <= 1024) {
    return `${input.toFixed(2)}KB`;
  } else {
    return `${(input / 1024.0).toFixed(2)}MB`;
  }
};

export const displayRelativeTime = (input: number): string => {
  const addZero = (input: number): string => {
    if (input === 0) {
      return "00";
    } else if (input > 0 && input < 10) {
      return "0" + input.toString();
    } else {
      return input.toString();
    }
  };

  const second = input % 60;
  const minute = ((input % 3600) / 60) | 0;
  const hour = (input / 3600) | 0;
  return `${addZero(hour)}:${addZero(minute)}:${addZero(second)}`;
};
