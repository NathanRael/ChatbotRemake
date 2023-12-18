import fetchJSON from "./fetchJSON";

export default class Message{
    input;
    verifiedInput;
    probSolverData = this.loadData('mainMessage') || [];
    weatherData = this.loadData('weatherMessage') || [];

    constructor(input){
        this.input = input;
        (this.probSolverData.length > 0) && this.loadMainMessage();
        (this.weatherData.length > 0) && this.loadWeatherMessage();
    }
    
    sendMessage(messageName, isBot, isWeather){
        this.verifiedInput = this.securedInput();
        const USER_MESSAGE = this.verifiedInput;
        if ($(this.input).val() != ""){
            this.clearInput();
            if (!isWeather){
                this.saveData(messageName, USER_MESSAGE, `${isBot ? 'bot' : 'user'}-reply`, false);
                this.generateBotMessage(messageName,USER_MESSAGE);
     
                this.loadMainMessage();
                
            }else{
                this.saveData(messageName, USER_MESSAGE,`${isBot ? 'bot' : 'user'}-reply`, true);
                this.getWeather(USER_MESSAGE);
                this.loadWeatherMessage();
            }

        }else{
            alert('Please, type something before sending the message');
        }
    }

    securedInput(){
        return DOMPurify.sanitize($(this.input).val().trim().toLowerCase());
    }

    clearInput(){
        $(this.input).val('');
    }

    async generateBotMessage(messageName, userMessage){
        const apiUrl = 'https://api-fakell.x10.mx/v1/chat/completions/';

        let waitMessage = $('.waitMessageText');
        let waitMessageText = 'Thinking';
        waitMessage.text(waitMessageText);
        let waitInterval;
        let botMessage;

        const data = {
            model: "gpt-3.5-turbo",
            messages: [{"role": "user", "content": userMessage}],
            stream: false
        }

        const requestOptions = {
            method : 'POST',
            headers : {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify(data)
        }

        try{
            $('.waitMessage').fadeIn(500);
            waitInterval = setInterval( () => {
                waitMessageText += '.';
                
                if (waitMessageText === 'Thinking....'){
                    waitMessageText = 'Thinking'
                }
                waitMessage.text(waitMessageText);
            }, 500)

            const response = await fetch(apiUrl, requestOptions);
            if (!response.ok){
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const responseData = await response.json();
            clearInterval(waitInterval);
            $('.waitMessage').fadeOut(500);

            botMessage = responseData.choices[0].message.content;
            this.saveData(messageName, botMessage, 'bot-reply',false);
        }catch (error){
            console.log('Error:', error.message);
            console.error('Full error object:', error);
            alert('Error:' + (error.message.length > 50) ? error.message.slice(0, 50) : error.message );
            clearInterval(waitInterval);
            $('.waitMessage').fadeOut(500);
        }finally{
            if (window.location.pathname.includes('maininterface') ||window.location.pathname.includes('mainInterface')){
                window.location.href = '/problemSolverInterface.html';
            }
            this.loadMainMessage();
        }

    }
    
    async getWeather(userInput){
        const units = 'metric';
        const lang = 'en';
        const apiKey = 'b275b33dffe936abc144bfe7c2ba6678';
        const cityName = userInput || 'Madagascar';
        try{
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${units}&lang=${lang}`);
            if(!response.ok) {
                throw datas;
            }
            const datas = await response.json();
            
            const iconurl = "https://openweathermap.org/img/wn/" + datas.weather[0].icon + "@2x.png" || [];
            let data = [
                datas.name, iconurl, datas.weather[0].main, datas.main.temp, datas.main.humidity
            ] 
            this.saveData('weatherMessage',data,'bot-reply',true);
        }catch(err){
            alert('Err : ' + err.message);
            console.log('Err : ' + err.message);
        }finally{
            this.loadWeatherMessage();
        }

    }

    loadMainMessage(){
        const datas = this.probSolverData;
        const container = $('.probReplyContainer');
        // console.log(datas);
        let message;
        container.empty();
        if (datas){
            for ( let data of datas){
                message = data?.message;
                if (data.class === 'user-reply'){
                    container.append(`
                        <li class="user-reply">
                            <p class="user-reply-abbreviation">R</p>
                            <div class="user-text">
                                ${message}
                            </div>
                        </li>
                    `)
                }else if (data.class === 'bot-reply'){
                    
                    let splitedMess = message.split(/```/);
    
                    container.append(`
                        <li class="bot-reply">
                            <img src="./src/image/logo.png" alt="" width="125px">
                            <div class="bot-text">
${splitedMess.map(mess => `
<code class="">
    ${mess}
</code>
`).join(' ')}  
                            </div>
                        </li>
                    `);
                }
            }
            this.scrollContent('problemSolverInterface', container);

        }
           
    }

    loadWeatherMessage(firstSent = false){
        const datas = this.weatherData || [];
        const container =  $('.weatherReplyContainer');
        let message;
        if (datas){
            container.empty();
            if (firstSent){
                
            }
            for ( let data of datas){   
                if (data.class === 'user-reply'){
                    message = data.message;
                    container.append(`
                        <li class="user-reply">
                            <p class="user-reply-abbreviation">R</p>
                            <div class="user-text">
                                ${message}
                            </div>
                        </li>
                    `)
                }else if (data.class === 'bot-reply'){
                    container.append(`
                        <li class="bot-reply">
                            <img src="./src/image/logo.png" alt="" width="125px">
                            <div class="bot-text">
                                Well, here is the weather today :
                            </div>
                            <div class="weather-card">
                                <p class="country-name">${data.message[0]}</p>
                                <div class="climat">
                                    <img src="${data.message[1]}" alt="">
                                    <p>${data.message[2]}</p>

                                </div>
                                <p class="temperature">Temp ${data.message[3]}°C</p>
                                <p class="humidity">Hudidity ${data.message[4]}%</p>
                            </div>
                            <div class="bot-text">
                                If you want to find another country's weather, you can type it
                            </div>
                        </li>

                    `)
                }
            }
            this.scrollContent('weatherAPI', container);
        }
    }

    saveData(dataName, data, className, isWeather){
        let jsonData;
        if (!isWeather){

            this.probSolverData.push(
                {class : className, message : data}
            )
            jsonData = JSON.stringify(this.probSolverData)
            localStorage.setItem(dataName, jsonData );
        }else{
            this.weatherData.push(
                {class : className, message : data}
            );
            jsonData = JSON.stringify(this.weatherData)
            localStorage.setItem(dataName, jsonData);
        }

    }

    loadData(dataName){
        return JSON.parse(localStorage.getItem(dataName));
    }
    getInputValue(){
        return $(this.input).val().trim();
    }

    scrollContent(location, container){
        if (container.html() != '' && window.location.href.toLowerCase().includes(location.toLowerCase())){
            container.animate({
                scrollTop: container[0].scrollHeight
            }, 'slow');   
        } 
    }


}