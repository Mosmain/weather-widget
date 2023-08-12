export function roundToInteger(number: number): number {
  return Math.round(number);
}

export function roundToOneDecimal(number: number): number {
  return Math.round(number * 10) / 10;
}

export function getWeatherIconUrl(iconCode: string): string {
  return `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

export function getWindDescription(speed: number): string {
  const windDescriptions: { [key: number]: string } = {
    1: "Calm",
    3: "Light breeze",
    5: "Gentle breeze",
    8: "Moderate breeze",
    11: "Fresh breeze",
  };

  const maxSpeed: number =
    Object.keys(windDescriptions)
      .map(Number)
      .find((key) => speed < key) || 11;
  return windDescriptions[maxSpeed];
}

export function getWindDirection(deg: number): string {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.floor((deg % 360) / 45);
  return directions[(index + 8) % 8];
}
