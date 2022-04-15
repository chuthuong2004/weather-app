const APP_ID = 'e3f0797cde212d7d5fbc4e8bc7d0d6b4';
const DEFAULT_VALUE = '--';
const searchInput = document.querySelector('#search-input')
const cityName = document.querySelector('.city-name');
const weatherState = document.querySelector('.weather-state');
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const sunrise = document.querySelector('.sunrise');
const sunset = document.querySelector('.sunset');

const humidity = document.querySelector('.humidity');
const windSpeed = document.querySelector('.wind-speed');

searchInput.addEventListener('change', (e) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${e.target.value}&appid=${APP_ID}&units=metric&lang=vi`)
        .then(async res => {
            const data = await res.json();
            cityName.innerHTML = data.name || DEFAULT_VALUE;
            weatherState.innerHTML = data.weather[0].description || DEFAULT_VALUE;
            weatherIcon.setAttribute('src', `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
            temperature.innerHTML = Math.round(data.main.temp) || DEFAULT_VALUE;
            sunrise.innerHTML = moment.unix(data.sys.sunrise).format('H:mm') || DEFAULT_VALUE;
            sunset.innerHTML = moment.unix(data.sys.sunset).format('H:mm') || DEFAULT_VALUE;
            humidity.innerHTML = data.main.humidity || DEFAULT_VALUE;
            windSpeed.innerHTML = (data.wind.speed * 3.6).toFixed(2) || DEFAULT_VALUE;
        });
    // searchInput.value = '';
    // searchInput.focus();

})

// Trợ lý ảo
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
const recognition = new SpeechRecognition()
const synth = window.speechSynthesis;
recognition.lang = 'vi-VI';
recognition.continuous = false;
const microphone = document.querySelector('.microphone')
const speak = (text) => {
    if (synth.speaking) {
        console.error('Busy. Speaking....')
        return
    }
    const utter = new SpeechSynthesisUtterance(text)
    utter.onend = () => {
        console.log('SpeechSynthesisUtterance.onend');
    }
    utter.onerror = () => {
        console.log('SpeechSynthesisUtterance.onerror');
    }
    synth.speak(utter);
}
const handelVoice = (text) => {
    console.log('text', text);
    const handledText = text.toLowerCase()
    const container = document.querySelector('.container');
    if (handledText.includes('thời tiết tại')) {
        const location = handledText.split('tại')[1].trim();
        console.log('location: ' + location);
        searchInput.value = location;
        console.log(searchInput.value);
        const changeEvents = new Event('change');
        searchInput.dispatchEvent(changeEvents);
        setTimeout(() => {
            console.log(cityName.innerHTML);
            console.log(temperature.innerHTML);
            speak(`The weather in ${cityName.innerHTML} is ${temperature.innerHTML} degrees Celsius`)
        }, 1000);
        return;
    }
    // else {
    //     searchInput.value = handledText.toLowerCase();
    //     console.log(searchInput.value);
    //     const changeEvents = new Event('change');
    //     searchInput.dispatchEvent(changeEvents);
    // }
    if (handledText.includes('thay đổi màu nền')) {
        const color = handledText.split('màu nền')[1].trim();
        console.log(color);
        container.style.background = color;
        speak(`background color has been changed to ${color}`);
        return;
    }
    if (handledText.includes('màu nền mặc định')) {
        container.style.background = '';
        speak('have reset the default background color')
    }
    if (handledText.includes('mấy giờ')) {
        const textToSpeech = `${moment().hours()} hours ${moment().minutes()} minutes`;
        speak(textToSpeech);
        return;
    }
    if (handledText.includes('yêu')) {
        speak("Nooooooooooo00000000000000000000")
        return;
    }
    if (handledText.includes('tại sao')) {
        speak("Because you are very handsome")
    }
    speak('Try again')
}
microphone.addEventListener('click', (e) => {
    e.preventDefault();
    recognition.start();
    microphone.classList.add('recording');

})
recognition.onspeechend = () => {
    recognition.stop();
    microphone.classList.remove('recording');
}
recognition.onerror = (err) => {
    console.log(err);
    microphone.classList.remove('recording');
}
recognition.onresult = (e) => {
    console.log('onresult', e);
    const text = e.results[0][0].transcript;
    handelVoice(text)
}