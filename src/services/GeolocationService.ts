export async function getGeolocation() {
  return new Promise<{ latitude: number; longitude: number }>(
    (resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position.coords),
        (error) => reject(error)
      );
    }
  );
}
