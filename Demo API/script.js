const form = document.getElementById('search-form');
const imagesDiv = document.getElementById('images');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const keyword = document.getElementById('keyword').value.trim();

    if (keyword === "") {
        alert("Vui lòng nhập từ khóa!");
        return;
    }

    imagesDiv.innerHTML = "<p>Đang tải hình ảnh...</p>";

    try {
        const response = await fetch(`https://api.unsplash.com/search/photos?query=${keyword}&per_page=12&client_id=rMbe8iwM_ArQhAsEQqEJ15cvTPtxiuRmyGU4nEuD824`);

        if (!response.ok) {
            throw new Error(`Lỗi HTTP! Trạng thái: ${response.status}`);
        }

        const data = await response.json();

        if (!data.results || !Array.isArray(data.results) || data.results.length === 0) {
            imagesDiv.innerHTML = `<p style="color: red;">Không tìm thấy hình ảnh nào!</p>`;
            return;
        }

        displayImages(data.results);

    } catch (error) {
        console.error('Lỗi khi lấy hình ảnh:', error);
        imagesDiv.innerHTML = `<p style="color: red;">Không thể tải hình ảnh. Vui lòng thử lại sau!</p>`;
    }
});

function displayImages(images) {
    imagesDiv.innerHTML = '';

    images.forEach(image => {
        const imgDiv = document.createElement('div');
        imgDiv.classList.add('image');
        imgDiv.innerHTML = `<img src="${image.urls.small}" alt="${image.alt_description || 'Hình ảnh'}">`;
        imagesDiv.appendChild(imgDiv);
    });
}

const getWeatherBtn = document.getElementById('get-weather-btn');
const weatherResult = document.getElementById('weather-result');

getWeatherBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getWeather, showError);
    } else {
        weatherResult.innerHTML = `<p style="color: red;">Trình duyệt không hỗ trợ Geolocation.</p>`;
    }
});

async function getWeather(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const apiKey = '2e8c7590358a2452d96e614a78dd61b0';

    weatherResult.innerHTML = "<p>Đang lấy dữ liệu thời tiết...</p>";

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=vi&appid=${apiKey}`);


        if (!response.ok) {
            throw new Error(`Lỗi HTTP! Trạng thái: ${response.status}`);
        }

        const data = await response.json();
        displayWeather(data);

    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu thời tiết:', error);
        weatherResult.innerHTML = `<p style="color: red;">Không thể lấy dữ liệu thời tiết. Vui lòng thử lại!</p>`;
    }
}

function displayWeather(data) {
    weatherResult.innerHTML = `
        <h3 style="text-align: center;">Thời tiết tại ${data.name}, ${data.sys.country}</h3>
        <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" alt="${data.weather[0].description}" style="display: block; margin: 0 auto;">
        <div style="display: flex; justify-content: space-between; gap: 20px;">
            <div style="text-align: justify; flex: 1; margin-left: 10px; color: white;">
                <p style="white-space: nowrap; font-size: 16px;">🌡️ <strong>Nhiệt độ:</strong> ${data.main.temp}°C</p>
                <p style="white-space: nowrap; font-size: 16px;">💧 <strong>Độ ẩm:</strong> ${data.main.humidity}%</p>
                <p style="white-space: nowrap; font-size: 16px;">🌪️ <strong>Áp suất:</strong> ${data.main.pressure} mbar</p>
            </div>
            <div style="text-align: justify; flex: 1; color: white;" >
                <p style="white-space: nowrap; font-size: 16px;">💨<strong>Tốc độ gió:</strong> ${data.wind.speed} km/h</p>
                <p style="white-space: nowrap; font-size: 16px;">🧭<strong>Hướng gió:</strong>${getWindDirection(data.wind.deg)} (${data.wind.deg}°)</p>
                <p style="white-space: nowrap; font-size: 16px;">⛅<strong>Thời tiết:</strong> ${data.weather[0].description}</p>
            </div>
        </div>
    `;
}

function getWindDirection(deg) {
    if (deg >= 337.5 || deg < 22.5) return "⬆️ Bắc";
    if (deg >= 22.5 && deg < 67.5) return "↗️ Đông Bắc";
    if (deg >= 67.5 && deg < 112.5) return "➡️ Đông";
    if (deg >= 112.5 && deg < 157.5) return "↘️ Đông Nam";
    if (deg >= 157.5 && deg < 202.5) return "⬇️ Nam";
    if (deg >= 202.5 && deg < 247.5) return "↙️ Tây Nam";
    if (deg >= 247.5 && deg < 292.5) return "⬅️ Tây";
    if (deg >= 292.5 && deg < 337.5) return "↖️ Tây Bắc";
    return "❓ Không xác định";
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            weatherResult.innerHTML = `<p style="color: red;">Bạn đã từ chối quyền truy cập vị trí.</p>`;
            break;
        case error.POSITION_UNAVAILABLE:
            weatherResult.innerHTML = `<p style="color: red;">Không thể xác định vị trí.</p>`;
            break;
        case error.TIMEOUT:
            weatherResult.innerHTML = `<p style="color: red;">Hết thời gian lấy vị trí.</p>`;
            break;
        case error.UNKNOWN_ERROR:
            weatherResult.innerHTML = `<p style="color: red;">Lỗi không xác định.</p>`;
            break;
    }
}