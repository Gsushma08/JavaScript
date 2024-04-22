const buttonClick = () => {
    const button = document.getElementById('check-button');
    console.log("Button:", button); 
    button.addEventListener('click', getAirQuality);
};

buttonClick();

async function getAirQuality() {
    console.log("getAirQuality called"); 
    const cityInput = document.getElementById('city-input');
    console.log("cityInput:", cityInput); 
    const city = cityInput.value.trim();
    
    console.log("Raw city input:", city);

    // Validates the city name
    if (!isValidCity(city)) {
        alert('Please enter the city name.');
        return;
    }

    const apiUrl = `https://air-quality-by-api-ninjas.p.rapidapi.com/v1/airquality?city=${city}`;
    console.log("API URL:", apiUrl);

    const apiKey = '09da609110msh47ba0239e32fac3p11d60cjsne59e68b5df67';  
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'air-quality-by-api-ninjas.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(apiUrl, options);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", JSON.stringify(data, null, 2));

        displayAirQuality(data, city); 
    } catch (error) {
        console.error('Error:', error.message);
        alert('Failed to fetch air quality data. Please enter valid city name.');
    }
}



function isValidCity(city) {
    // Check if the city name contains only alphabetic characters and spaces
    return /^[a-zA-Z\s]+$/.test(city);
}

function colorForAQI(aqi) {
    if (aqi <= 50) {
        return 'good';
    } else if (aqi <= 150) {
        return 'moderate';
    } else  {
        return 'severe';
    }
}

function displayAirQuality(data, cityName) {
    const resultDiv = document.getElementById('result');

    const overallAQI = data.overall_aqi;

    resultDiv.innerHTML = `
        <h2 class="${colorForAQI(overallAQI)}">${cityName ? cityName : 'Unknown'} (AQI: ${overallAQI})</h2>
        <p id="health-recommendations" class="${colorForAQI(overallAQI)}">${healthRecommendations(overallAQI)}</p>
        <p class="${colorForAQI(data.CO.aqi)}">CO: ${data.CO.concentration} (AQI: ${data.CO.aqi})</p>
        <p class="${colorForAQI(data.NO2.aqi)}">NO2: ${data.NO2.concentration} (AQI: ${data.NO2.aqi})</p>
        <p class="${colorForAQI(data.O3.aqi)}">O3: ${data.O3.concentration} (AQI: ${data.O3.aqi})</p>
        <p class="${colorForAQI(data.SO2.aqi)}">SO2: ${data.SO2.concentration} (AQI: ${data.SO2.aqi})</p>
        <p class="${colorForAQI(data['PM2.5'].aqi)}">PM2.5: ${data['PM2.5'].concentration} (AQI: ${data['PM2.5'].aqi})</p>
        <p class="${colorForAQI(data.PM10.aqi)}">PM10: ${data.PM10.concentration} (AQI: ${data.PM10.aqi})</p>
    `;
}

function healthRecommendations(overallAQI) {
    if (overallAQI <= 50) {
        return 'Health Recommendations: Air quality is good. Enjoy outdoor activities!';
       
    } 
    if (overallAQI <= 100) {
        return 'Health Recommendations: Air quality is moderate. Limit your stay at outdoors.';
    } 
    if (overallAQI <= 150) {
        return 'Health Recommendations: Air quality is unhealthy for sensitive groups.';
    } 
    if (overallAQI <= 200) {
        return 'Health Recommendations: Everyone should reduce outdoor activities.';
    } 
    if (overallAQI <= 300) {
        return 'Health Recommendations: Stay indoors if possible, especially if you have health concerns.';
    } 
    return 'Health Recommendations: Everyone should avoid outdoor activities. People with heart or lung disease, older adults, and children should remain indoors and keep activity levels low.';
}
