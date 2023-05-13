// @ts-nocheck
export const openWeatherMap = {
  getCurrentWeather: async function (latitude: number, longitude: number, apiKey: string, exclude = "minutely,hourly,daily,alerts", units = "metric") {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=${exclude}&appid=${apiKey}&units=${units}`
      );
      // eslint-disable-next-line
      if (res.ok) {
        const data = res.json();
        return { success: true, data };
      }
      console.error("Response was not OK:", res.status)
      return { success: false, status: res.status };
    } catch (error) {
      console.error("Something went wrong:", error);
      return { success: false, error };
    }
  },
};
