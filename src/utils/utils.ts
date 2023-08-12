export function roundToInteger(number: number): number {
  return Math.round(number);
}

export function roundToOneDecimal(number: number): number {
  return Math.round(number * 10) / 10;
}

export function getWeatherIconUrl() {
  return (iconCode: string) =>
    `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
}
