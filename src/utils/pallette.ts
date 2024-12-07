export const PASTEL_COLORS = {
  pancho:   '#EFD5A5',
  mongoose: '#BDA67D',
  gray:     '#A6B4B6',
  hai:      '#8A9BAC',
  sirocco:  '#707E7D',
  locust:   '#ABAE93',
  mist:     '#D7DAC5',
  juniper:  '#729494',
  givry:    '#F7D8BE',
  mojo:     '#BF5C38',
  rainee:   '#B2C99E',
  lynch:    '#628090',
 } as const

interface Pallette {
  getNextColor: () => string
  getColor:     (index: number) => string
}

export function createPallette(index: number = 0): Pallette {
  let counter = index
  const colors = Object.values(PASTEL_COLORS)
  
  return { getNextColor, getColor }
  
  function getNextColor(): string {
    const color = colors[counter]
    counter = ++counter < colors.length ? counter: 0
    
    return color
  }
  
  function getColor(index: number): string {
    return colors[index]
  }
}
