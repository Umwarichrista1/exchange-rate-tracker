const API_URL = "https://open.er-api.com/v6/latest/USD";

const africa = ["RWF","KES","UGX","TZS","ZAR","ZMW","BWP","ETB","MWK"
   , "MAD","EGP"];

const major = ["USD","EUR","GBP","JPY","CNY","CHF","CAD","AUD","AED","INR"];

let rates ={};

const amountInput = document.getElementById("amount");
const fromSelect= document.getElementById("from");
const toSelect = document.getElementById("to");
const  resultText = document.getElementById("result");
const searchInput = document.getElementById("search");
const  regionSelect = document.getElementById("region");
const  sortSelect = document.getElementById("sort");
const  statusText = document.getElementById("status");
const errorText = document.getElementById("error");
const tableBody = document.getElementById("rows");


async function loadRates() {
    statusText.textContent = "Loading...";
    errorText.hidden = true;


try{
    const response = await fetch(API_URL);

    if(!response.ok) {
        throw new Error("The server answered with an error("+response.status +").");
    }
    const data = await response.json();
    if(data.result !=="success" || !data.rates) {
        throw new Error("The API sent bad data.");
    }
    rates = data.rates;
    fillDropdowns();
    showTable();
    convert();
    statusText.textContent = "Last update: "+ data.time_last_update_utc;

}catch (error){
    statusText.textContent="";
    errorText.hidden= false;
    errorText.textContent="could not laod rates. "+error.message + "Check your internet and refresh the page";
    }
}

function fillDropdowns(){
    const codes = Object.keys(rates).sort();
    
    for(const code of codes) {
        fromSelect.add( new Option(code , code));
        toSelect.add(new Option(code,code));

    }

    fromSelect.value ="USD";
    toSelect.value ="RWF";
}

function convert(){
    const amount = parseFloat(amountInput.value);

    if (isNaN(amount) || amount < 0) {
        resultText.textContent ="please enter a valid amount";
        return;
    }

    const inUSD = amount /rates[fromSelect.value];
    const answer = inUSD * rates[toSelect.value];

    resultText.textContent = 
    amount + " " + fromSelect.value + " = " + answer.toFixed(2) + " " + toSelect.value ;
}

function showTable(){
    const search = searchInput.value.trim().toUpperCase();
    const region = regionSelect.value;
    const sort = sortSelect.value;

    let list = Object.entries(rates);

    list = list.filter(function(item){
        return item[0].includes(search);
    });

    if (region === "africa"){
        list = list.filter(function(item){return africa.includes(item[0]); });
            }else if (region =="major"){
                list =  list.filter(function (item){return major.includes(item[0]); });
            }

            if(sort === "code"){
                list.sort(function(a,b){return a[0].localeCompare(b[0]); });
            }else if (sort === "high"){
                list.sort(function(a,b) {return b[1] - a[1]; });
            }else if ( sort === "low"){
                list.sort(function(a,b) {return a[1] - b[1]; });
            }


            tableBody.innerHTML = "";
            if (list.length === 0){
                const row = tableBody.insertRow();
                row.inserCell().textContent ="No currency found";
                return;
            }
            for (const item of list){
                const row = tableBody.insertRow();

                row.insertCell().textContent = item[0];
                row.insertCell().textContent = item[1];
            }
        }    


amountInput.addEventListener("input", convert);
fromSelect.addEventListener("change",convert);
toSelect.addEventListener("change", convert);
searchInput.addEventListener("input", showTable);
regionSelect.addEventListener("change", showTable);
sortSelect.addEventListener("change",showTable);

loadRates();