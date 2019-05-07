$(document).ready(function () {


    //current time
    //update every 10 seconds;
    setCurrentTime();
    setInterval(function () {
        setCurrentTime();
    }, 10 * 1000);

    setBackground();
    setInterval(function () {
        setBackground();
    }, 3600 * 1000);




    function timeGreeting() {
        var now = new Date();
        var greetingTime;
        //Morning 0:00:01-12:00:00
        //Afternoon 12:00:01 - 18:00:00 (Can't do sec, so we use min)
        //Evening 18:00:01 - 24:00:00

        if (now.getHours() < 12) {
            greetingTime = "Good morning";

        }
        else if (now.getHours() < 18) {
            greetingTime = "Good afternoon";
        }
        else if (now.getHours() < 24) {
            greetingTime = "Good evening";
        }
        console.log(greetingTime);
        return greetingTime;
    };



    //Random quotation
    function randomQuote() {
        $.ajax({
            url: "https://api.forismatic.com/api/1.0/?",
            dataType: "jsonp",
            data: "method=getQuote&format=jsonp&lang=en&jsonp=?",
            success: function (quoteData) {

                //Change quotation
                $('.Quotation').html("\"" + quoteData.quoteText + "\"")
                //Change quotation author
                if (quoteData.quoteAuthor != null || quoteData.quoteAuthor != "") {
                    $('#Author').html("-" + quoteData.quoteAuthor)
                } else {
                    $('#Author').html("-Unkown")
                }

            }

        });
    };

    

    var username = localStorage.getItem('user'); //Get the name
    var interest = localStorage.getItem('interest')

    //check username
    if (username) {
        $('.greeting').css('display', 'inline-block');
        $('.user-name').css('display', 'none');
        $('.greeting').html(`${timeGreeting()} <span class="stored-name">${username}</span>.`); //Display name
    } else {
        $('.greeting').css('display', 'none'); //Some styling
        $('.user-name').css('display', 'inline-block'); //Some styling (Show it)
        $('.greeting').html(`What's your name?`); //Ask for the name
    }

    $('.user-name').keypress(function (e) {
        if (e.which == 13) {
            var username = e.target.value;

            if (!username) return;
            $('.user-name').fadeOut(function () { //Fade out user-name and insert greeting
                $('.greeting').html(`${timeGreeting()} ${username}.`); //Display random greeting
                $('.greeting').fadeIn(function () {

                    localStorage.setItem('user', username); //Save the name

                });
            });
        }
    });




    //check interest
    if (interest) {
        $('.interestText').css('display', 'inline-block');
        $('.interest').css('display', 'none');
        $('.interestText').html(`${interest}.`); //Display name
    } else {
        $('.interestText').css('display', 'none'); //Some styling
        $('.interest').css('display', 'inline-block'); //Some styling (Show it)
        $('.interestText').html(`What's your main focus for today?`); //Ask for the name
    }


    //If interest entered
    $('.interest').keypress(function (e) {
        if (e.which == 13) {
            var interest = e.target.value;

            if (!interest) return;
            $('.interest').fadeOut(function () { //Fade out user-name and insert greeting
                $('.interestText').css("text-decoration", "none");
                $('.interestText').html(`${interest}.`); //Display interest
                $('.interestText').fadeIn(function () {

                    localStorage.setItem('interest', interest); //Save the name

                });
            });
        }
    });

    var todoDict;

    //Loading list
    var todoDictMaster = JSON.parse(window.localStorage.getItem("meta"));

    if (todoDictMaster) {
        //fo each item in dictionary
        //Call add todo list displa
        todoDict = todoDictMaster;
        for (var key in todoDict) {
            // check if the property/key is defined in the object itself, not in parent
            if (todoDict.hasOwnProperty(key)) {
                console.log(key, todoDict[key]);
                todoListDisplay(key);

            }
        }
    }
    else {
        todoDict = {};
    }

    var itemAmount = 0;

    //If interest entered
    $('.TodoList').keypress(function (e) {
        if (e.which == 13) {
            console.log("add button was pressed");

            if (itemAmount < 6 || document.getElementById("TodoList").value == null || document.getElementById("TodoList").value == "" || document.getElementById("TodoList").value.length == 0) {
                //Call the add todolistDisplay

                // 1. get whatever person wrote in the text inputBox
                var item = document.getElementById("TodoList").value;
                todoDict[item] = "no";
                todoListDisplay(item);



            }
        }
    });


    function todoListDisplay(item) {
        console.log("Person wants to add: " + item);

       

        // 2. create an <li> item
        var li = document.createElement("li");
        li.style.listStyleType = 'none';
        li.style.marginTop = '5px';

        li.innerHTML = item;

        console.log("Checkpoint 1");

        // 3. add it to your grocery List
        document.getElementById("TodolistData").appendChild(li);

        // 4.1 create a complete button
        var completeButton = document.createElement("button");
        completeButton.innerHTML = "Complete";
        completeButton.className += "ButtonsComplete";

        completeButton.addEventListener("click", function (e) {

            // get the element BEFORE the button (Text)
            var listItem = completeButton.previousSibling;
            listItem.style.textDecoration = "line-through";

            todoDict[listItem.innerHTML] = "yes";

            console.log(todoDict);

            console.log(itemAmount);

            saveTodoList();

        });

        // 4.2 create a remove button
        var removeButton = document.createElement("button")
        removeButton.innerHTML = "Delete"
        removeButton.className += "ButtonsClearer";

        removeButton.addEventListener("click", function (e) {

            // get the element BEFORE the button (The complete button)
            var buttonCom = removeButton.previousSibling;
            // remove it from the dom
            buttonCom.remove()

            // get the element BEFORE the button (Text)
            var listItem = removeButton.previousSibling;

            // remove from list
            delete todoDict[listItem.innerHTML];

            // remove it from the dom
            listItem.remove()

            // remove the button from the dom
            this.remove()
            itemAmount -= 1;
            console.log(itemAmount);

            saveTodoList();
        });

        document.getElementById("TodolistData").appendChild(completeButton)

        // 5. add the button to the list
        document.getElementById("TodolistData").appendChild(removeButton)

        // 4. clear the text inputBox
        document.getElementById("TodoList").value = ""
        itemAmount += 1;
        console.log(itemAmount);


        if (todoDict[item] == "yes") {
            // get the element BEFORE the button (Text)
            var listItem = completeButton.previousSibling;
            listItem.style.textDecoration = "line-through";
        }

        console.log("Checkpoint 3");

        saveTodoList();
    }
        
    function saveTodoList() {

        window.localStorage.setItem("meta", JSON.stringify(todoDict));
    }
    
  
    randomQuote();


    navigator.geolocation.getCurrentPosition(function (position) {
        let lat = position.coords.latitude;
        let long = position.coords.longitude;


        console.log(lat);
        console.log(long);
        getWeather(lat, long);
    });






    function getWeather(lat, lon) {
        var apiURI = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=fe6e1549be27ad99dfa748f2b6362337";

        $.ajax({
            url: apiURI,
            dataType: "json",
            type: "GET",
            async: "false",
            success: function (resp) {
                /*
                $("#tempMode").on("click", function () {
                    if (this.checked) {
                        $("#temp-text").html(cels.toFixed(1) + " C&deg");
                        console.log("checked");
                    } else
                        $("#temp-text").html(fahr.toFixed(0) + " F&deg");
                });*/
                console.log(apiURI);
                console.log(resp.name);

                if (resp.name) {
                    $(".weatherLocation").html(resp.name);
                }/*
                if (resp.wind) {
                    var knots = resp.wind.speed * 1.9438445;
                    $("#wind-text").html(knots.toFixed(1) + " Knots");
                }*/
                if (resp.main.temp) {
                    //var fahr = (resp.main.temp * 9 / 5) - 459.67;
                    var cels = (resp.main.temp - 273.15);
                    console.log(cels);
                    var celsFormat = cels.toFixed(2);
                    $("#weatherTemp").html(`${celsFormat}&#176`);
                    
                }
                
                if (resp.weather) {
                    var imgURL = "http://openweathermap.org/img/w/" + resp.weather[0].icon + ".png";
                    console.log(imgURL);                   
                    document.getElementById("weatherIcon").src = imgURL; /*
                    $("#weather-text").html(resp.weather[0].description);*/
                }
                
                
            },
            error: function (resp) {
                alert("Error: " + e);
                clearInterval(updateinter);
            }
        });
    }


});

function setCurrentTime(){
    var now = new Date();
    if (now.getMinutes() < 10) {
        $('.time').html(now.getHours() + ":0" + now.getMinutes()) //Display the time
    }
    else {
        $('.time').html(now.getHours() + ":" + now.getMinutes()) //Display the time
    }
 
};

function setBackground() {
    //Set the background
    var urlData = new URL('https://source.unsplash.com/1600x900/?nature,mountains');
    $('.backgroundLayout').css('background-image', `url(${urlData})`); //Set the background image
}



var first_click = true;
function searchIconClick() {

        if (first_click == true) {
           
            $('.searchInput').css('opacity', '100');
            first_click = false;
        } else if (first_click==false){
            
            $('.searchInput').css('opacity', '0');
            first_click = true;
        }
       
};



function clearInterest() {
    localStorage.clear('interest');
    $('.interestText').css('display', 'none'); //Some styling
    $('.interest').css('display', 'inline-block'); //Some styling (Show it)
    $('.interestText').html(`What's your main focus for today?`); //Ask for the name
};


function completeInterest() {
    var ele = document.getElementsByClassName("interestText");
    for (var i = 0; i < ele.length; i++) {
        ele[i].style.setProperty("text-decoration", "line-through");
    }
};


var first_clickTodo = true;
function TodoIconClick() {

    if (first_clickTodo == true) {

        $('.right-top').css('opacity', '0.8');
        first_clickTodo = false;
    } else if (first_clickTodo == false) {

        $('.right-top').css('opacity', '0');
        first_clickTodo = true;
    }

}

var first_clickMain = true;
function ShowMenuMainTask() {

    if (first_clickMain == true) {

        $('.left-bottom').css('opacity', '0.8');
        first_clickMain = false;
    } else if (first_clickMain == false) {

        $('.left-bottom').css('opacity', '0');
        first_clickMain = true;
    }

}


function MenuIconClick() {
    window.location.href = "https://chrome.google.com/webstore/category/extensions";
}
