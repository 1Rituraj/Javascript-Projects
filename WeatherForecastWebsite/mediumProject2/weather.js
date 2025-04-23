console.log("script loaded")
const cityInput=document.querySelector(".city-input")
const searchBtn=document.querySelector(".search-btn")
const notFoundPage=document.querySelector(".not-found")
const searchCityPage=document.querySelector(".search-city")
const weatherInfoPage=document.querySelector(".weather-info")


const countryText=document.querySelector(".country-txt")
const currentDateText=document.querySelector(".current-date-txt")
const tempText=document.querySelector(".temp-txt")
const conditionText=document.querySelector(".condition-txt")
const humidityVal=document.querySelector(".humidity-value-txt")
const windVal=document.querySelector(".wind-value-txt")
const forecastImg=document.querySelector(".weather-summary-img")

const forecastcontainer=document.querySelector(".forecast-items-container")

const apiKey="db0cbe85cd3154980dadc4b980e65da0"

//firstly i have done this 
searchBtn.addEventListener("click",(event)=>{
    const city=cityInput.value.trim()
    if(city!=""){
        updateWeatherInfo(city)
        cityInput.value=""

    }
})
cityInput.addEventListener("keydown",(event)=>{
    const city=cityInput.value.trim()
    if(event.key==="Enter" && city!=""){
        updateWeatherInfo(city)
       cityInput.value=""
    }
    
})
//function generating current date
function generatecurrentDate(){
    const date=new Date()
    const dateoption={
        weekday:"short",
        day:"2-digit",//if we want the date in this format (Tue, 22 Apr) then we can use like this 
        month:"short",
    }
   return date.toLocaleDateString("en-GB",dateoption)
}


function getWeatherIcon(id){
    //in this fun i am getting the images of weather a/c to id 
    //these id's i get from openWeather
    // console.log(id)
    if(id>=200 && id<=232)return `thunderstrom.svg`
    else if(id>=300 && id<=321)return `drizzle.svg`
    else if(id>=500 && id<=531)return `rain.svg`
    else if(id>=600 && id<=622)return `snow.svg`
    else if(id>=701 && id<=781)return `atmosphere.svg`
    else if(id===800)return `clear.svg`
    else return `clouds.svg`
    
}

//secondly i have solved this part
// now i am using api to fetch the weather data
async function getfetchData(endPoint,city){
    const apiUrl=`https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`
    
    try{
       const response=await fetch(apiUrl)
       if(response.ok) return  response.json()
        else{
          console.log("Response is not ok")
          return null
        } 
    }
    catch(error){
        return null
    }
}

//third i have solved this part
//after fetching i am udating the weather according to the data fetched
async function updateWeatherInfo(city){
    const weatherData=await getfetchData("weather",city)//the data we are getting here is promise not the actual data directly  //so get the actual data inside the promise we havve to use await 
    // console.log(weatherData)
    if(weatherData){//if we are successful to get the data form api i am changing the hardtext contennt of my html to received data
        const{
            name:country,
            main:{temp,humidity}, //how this i have form by consoling the weather data in the browser
            weather:[{id,main}],
            wind:{speed},
        }=weatherData //destructuring of objects
        countryText.textContent=country
        tempText.textContent=Math.round(temp)+ " °C"
        humidityVal.textContent=humidity+ "%"
        windVal.textContent=speed+" M/s"
        conditionText.textContent=main
        currentDateText.textContent=generatecurrentDate();
        forecastImg.src=`assets/weather/${getWeatherIcon(id)}`
       
        //this function is for updating the forecast 
        await updateForecastInfo(city)

        showDisplaySection(weatherInfoPage)//if i got the data from api it will redirect to my weather info page          
    }
    else {
        showDisplaySection(notFoundPage)//if i did not get the data it will redirect to my not found page (404)                        
    }
}

//here i am making a async func updateForecastInfo which is called inside the updatetheweatherInfo fun that passes city as argument
//then inside this fun i am calling getfetchData fun and i passed endpoint as forecast so it will go collect the forecastdata in which 
//we receive list or array of forecast data at different time,but we have need of data whose timeTaken is 12:00:00 and the data whose days and date are just from next day of search
//so what we have done in this fun is we have generate new date which gives me today date(search date)
//as the forecastData is array we will go thorugh the array using forEach loop and access that data whose dt_txt is equal to time taken and whose dt_txt is not equal to todaydate(search date)
async function updateForecastInfo(city){
    const forecastData=await getfetchData("forecast",city)
    // console.log(forecastData)
    const timeTaken="12:00:00"
    // const todayDate=new Date().toISOString()//if you console this much part you will get "2025-04-22T23:10:44.404Z"
    const todayDate=new Date().toISOString().split("T")[0]
    
    forecastcontainer.innerHTML=""
    forecastData.list.forEach((forecastevent)=>{
        if(forecastevent.dt_txt.includes(timeTaken) && !forecastevent.dt_txt.includes(todayDate)){
            // console.log(event)here we get the forecast data from the next date of search 
            updateForecastItems(forecastevent)
        }    
    })
        
}

function updateForecastItems(forecastevent){
   console.log(forecastevent)
   const{
    dt_txt:date,
    main:{temp},
    weather:[{id}]
   }=forecastevent
    const forecastdateComing=new Date(date)
    const dateOption={
        month:"short",
        day:"2-digit",
    }
    const resultDate=forecastdateComing.toLocaleDateString("en-GB",dateOption)
    //if you want to handle multiple UI element at one time you can do like this (what ever written is template literal in js)
    //here i am generating dynamic HTML content 
    //this is template literal
    const forecastItems=`
        <div class="forecast-item">
            <h5 class="forecast-item-date regular-txt">${resultDate}</h5>
            <img src="assets/weather/${getWeatherIcon(id)}" class="forecast-item-img">
            <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
        </div>
    `
    
   forecastcontainer.insertAdjacentHTML("beforeend",forecastItems)
}
function showDisplaySection(page){
    [weatherInfoPage,searchCityPage,notFoundPage].forEach((page)=>{
        page.style.display="none"
    })
    page.style.display="flex"
}