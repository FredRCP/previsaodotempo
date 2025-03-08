document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '34378586e81741079f3171257250502';  // Substitua pela sua chave da API do OpenWeather
    const weatherInfo = document.getElementById('weather-info');
    const cityInput = document.getElementById('city');
    const suggestionsList = document.getElementById('suggestions-list');
  
    async function getWeather(city) {
      const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=2&lang=pt`; // Alterado para 2 dias
  
        try {
            const response = await fetch(url);
            const data = await response.json();
  
            if (response.status !== 200 || !data.location) {
                alert('Cidade não encontrada!');
                return;
            }
  
            // Obtém a data de hoje no formato dd/mm/aaaa
            const today = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  
            // Exibe a cidade e a data na div principal
            document.getElementById('city-name').innerHTML = `${data.location.name}  Hoje`;
  
            // Exibir as informações no HTML
            document.getElementById('temperature').textContent = `🌡️ Temperatura: ${data.current.temp_c}°C`;
            document.getElementById('description').textContent = `☁️ Condição: ${data.current.condition.text}`;
            document.getElementById('humidity').textContent = `💧 Umidade: ${data.current.humidity}%`;
            document.getElementById('wind').textContent = `🌬️ Vento: ${data.current.wind_kph} km/h`;
  
            // Exibir o ícone do tempo
            const icon = data.current.condition.icon;
            document.getElementById('weather-icon').src = `https:${icon}`;
            document.getElementById('weather-icon').style.display = 'block';
  
            weatherInfo.style.display = 'block';
  
            // Limpar o campo de input
            document.getElementById('city').value = '';
  
            // Exibir a previsão dos próximos 2 dias
            const forecastContainer = document.getElementById('forecast-info');
            forecastContainer.innerHTML = '';  // Limpar previsões anteriores
  
            let forecastDays = data.forecast.forecastday;
  
            forecastDays.forEach(day => {
                const dayElement = document.createElement('div');
                dayElement.classList.add('forecast-day');
                dayElement.innerHTML = `
                    <h5>${new Date(day.date).toLocaleDateString('pt-BR')}</h5>
                    <p>🌡️ Max: ${day.day.maxtemp_c}°C | Min: ${day.day.mintemp_c}°C</p>
                    <p>☁️ Condição: ${day.day.condition.text}</p>
                    <img src="https:${day.day.condition.icon}" alt="Ícone" />
                `;
                forecastContainer.appendChild(dayElement);
            });
  
        } catch (error) {
            alert('Erro ao buscar a previsão do tempo');
        }
    }
    
  
    document.getElementById('useLocation').addEventListener('change', function () {
      if (this.checked) {
          if ("geolocation" in navigator) {
              navigator.geolocation.getCurrentPosition(async (position) => {
                  const latitude = position.coords.latitude;
                  const longitude = position.coords.longitude;
                  const city = `${latitude},${longitude}`;  // Passamos as coordenadas diretamente para a API
  
                  getWeather(city);
              }, (error) => {
                  alert("Erro ao obter localização. Verifique se a permissão de localização está ativada.");
                  console.error(error);
              });
          } else {
              alert("Geolocalização não é suportada pelo seu navegador.");
          }
      }
    });
  
    async function getCitySuggestions(query) {
        if (!query) {
            suggestionsList.innerHTML = '';
            return;
        }
  
        const url = `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${query}`;
        
        try {
            const response = await fetch(url);
            const data = await response.json();
  
            suggestionsList.innerHTML = '';
  
            data.forEach(city => {
                const li = document.createElement('li');
                li.classList.add('list-group-item');
                li.textContent = `${city.name}, ${city.region}, ${city.country}`;
                li.onclick = function () {
                    cityInput.value = city.name;
                    suggestionsList.innerHTML = '';
                    getWeather(city.name);
                };
                suggestionsList.appendChild(li);
            });
        } catch (error) {
            console.error('Erro ao buscar as sugestões:', error);
        }
    }
  
    // Adicionando evento de digitação para buscar sugestões
    cityInput.addEventListener('input', (event) => {
        const query = event.target.value.trim();
        getCitySuggestions(query);
    });
  
    document.getElementById('searchButton').addEventListener('click', () => {
        const city = cityInput.value.trim();
        if (!city) {
            alert('Digite o nome da cidade!');
            return;
        }
        getWeather(city);
    });
  });
  