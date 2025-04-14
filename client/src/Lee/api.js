const handleResponse = async (res) => {
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP 오류! ${res.status} - ${errorText}`);
    }
    return res.json();
};
  
export const fetchDust = () =>
fetch("https://test-render1-u47s.onrender.com/api/air").then(handleResponse);

export const fetchWeather = (time) =>
fetch(`https://test-render1-u47s.onrender.com/api/weather?time=${time}`).then(handleResponse);
  