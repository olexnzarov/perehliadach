export const zoomOptions = [
  {
    label: '50%',
    value: '0.5'
  },
  {
    label: '75%',
    value: '0.75'
  },
  {
    label: '100%',
    value: '1'
  },
  {
    label: '125%',
    value: '1.25'
  },
  {
    label: '150%',
    value: '1.5'
  },
  {
    label: '200%',
    value: '2'
  }
];

export const findIncreaseZoom = (currentValue: string) => {
  const index = zoomOptions.findIndex(v => v.value == currentValue)
  
  if (zoomOptions.length - 1 > index) {
    return zoomOptions[index + 1].value
  }

  return currentValue
};

export const findDecreaseZoom = (currentValue: string) => {
  const index = zoomOptions.findIndex(v => v.value == currentValue)
  
  if (index > 0) {
    return zoomOptions[index - 1].value
  }

  return currentValue
};
