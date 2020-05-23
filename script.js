function converToBinary(data) {
    // Jesli data jest adresem ip podziel ja i konwertuj
    if (verifyIpAddress(data)) {
        const array = data.split(".");
        let converted = "";

        array.forEach(number => {
            let binary = "";
            while (number > 0) {
                if (number % 2 == 0) binary = "0" + binary;
                else binary = "1" + binary;
                number = Math.floor(number / 2);
            }

            while (binary.length < 8) {
                binary = "0" + binary;
            }
            converted += binary + ".";
        });
        return converted.slice(0, -1);
    }
    // Jesli data jest liczbą
    else if (typeof data == "number") {
        let binary = "";

        while (data > 0) {
            if (data % 2 == 0) binary = "0" + binary;
            else if (data == 0) binary = "0" + binary;
            else binary = "1" + binary;
            data = Math.floor(data / 2);
        }

        while (binary.length < 8) {
            binary = "0" + binary;
        }
        return binary;
    }
}

function returnDateYearAhead() {
    let date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    date.setHours(date.getHours() + 1);
    return date.toUTCString();
}

// Weryfikacja adresu ip
function verifyIpAddress(ip) {
    return new RegExp("^[0-9]{1,3}[.][0-9]{1,3}[.][0-9]{1,3}[.][0-9]{1,3}$").test(ip);
}

// Sprawdzenie i zwrócenie klasy adresu ip
function returnIpClass(ipAddress) {
    let ip = ipAddress.split(".");

    if (ip[0] >= 1 && ip[0] <= 127) {
        return "A";
    }
    else if (ip[0] >= 128 && ip[0] <= 191) {
        return "B";
    }
    else if (ip[0] >= 192 && ip[0] <= 223) {
        return "C";
    }
    else if (ip[0] >= 224 && ip[0] <= 239) {
        return "D";
    }
    else if (ip[0] >= 240 && ip[0] <= 255) {
        return "E";
    }
}

function returnShortMask(mask) {
    switch (mask) {
        case "255.0.0.0":
            return "8";
            break;
        case "255.255.0.0":
            return "16";
            break;
        case "255.255.255.0":
            return "24";
            break;
    }
}

function calculateIp(data) {
    let dataSplitted = data.split("/");
    const ipAddress = dataSplitted[0];
    let maskAddress = dataSplitted[1];

    switch (maskAddress) {
        case "255.0.0.0":
            maskAddress = "8";
            break;
        case "255.255.0.0":
            maskAddress = "16";
            break;
        case "255.255.255.0":
            maskAddress = "24";
            break;
    }

    if (!verifyIpAddress(ipAddress)) {
        return false;
    }
    else {
        const ipSplited = ipAddress.split(".");

        // Uzyskiwanie przygotowanych danych do wyswietlenia
        let fullMask, webAddress, broadcastAddress, hostMin, hostMax;
        switch (maskAddress) {
            case "8":
                fullMask = "255.0.0.0";
                webAddress = ipSplited[0] + ".0.0.0"
                broadcastAddress = ipSplited[0] + ".255.255.255";
                hostMin = ipSplited[0] + ".0.0.1";
                hostMax = ipSplited[0] + ".255.255.254";
                break;
            case "16":
                fullMask = "255.255.0.0";
                webAddress = ipSplited[0] + "." + ipSplited[1] + ".0.0";
                broadcastAddress = ipSplited[0] + "." + ipSplited[1] + ".255.255";
                hostMin = ipSplited[0] + "." + ipSplited[1] + ".0.1";
                hostMax = ipSplited[0] + "." + ipSplited[1] + ".255.254";
                break;
            case "24":
                fullMask = "255.255.255.0";
                webAddress = ipSplited[0] + "." + ipSplited[1] + "." + ipSplited[2] + ".0";
                broadcastAddress = ipSplited[0] + "." + ipSplited[1] + "." + ipSplited[2] + ".255";
                hostMin = ipSplited[0] + "." + ipSplited[1] + "." + ipSplited[2] + ".1";
                hostMax = ipSplited[0] + "." + ipSplited[1] + "." + ipSplited[2] + ".254";
                break;
        }
        const fullData = [ipAddress, fullMask, webAddress, broadcastAddress, Math.pow(2, (32 - maskAddress)) - 2, hostMin, hostMax];
        console.log(fullData);

        return fullData;
    }
}

function createHistory () {
    let cookies = decodeURIComponent(document.cookie);
    if (cookies == "") {
        alert("Brak historii do wyświetlenia.")
    }
    else {
        document.getElementById("historyContent").innerHTML = "";
        document.getElementById("historyContent").removeAttribute("style");
        console.log("Wykryto ciastka. Analizowanie...");
        cookies = cookies.split("; ");
        console.log(cookies);

        let ipArray = [];
        let tempArray = [];

        cookies.forEach(element => {
            if (element.substring(0, 7) != "counter") {
                tempArray.push(element.split("="));
            }
        });

        tempArray.forEach(el => {
            ipArray.push(el[1]);
        });

        console.log(ipArray);

        // [ipAddress, fullMask, webAddress, broadcastAddress, hostNumber, hostMin, hostMax]
        let fullDataArray = [];
        ipArray.forEach(element => {
            fullDataArray.push(calculateIp(element));
        });

        console.log(fullDataArray);

        const historyContent = document.getElementById("historyContent");
        historyContent.removeAttribute("style");
        for (let i = 0; i < fullDataArray.length; i++) {
            // const element = array[i];

            const table = document.createElement("table");
            table.setAttribute("id", "history" + i);
            historyContent.appendChild(table);

            let row1 = table.insertRow(0);
            let cell1row1 = row1.insertCell(0);
            let cell2row1 = row1.insertCell(1);
            let cell3row1 = row1.insertCell(2);
            cell1row1.innerHTML = "&nbsp;";
            cell2row1.innerHTML = "<b>dziesiętnie</b>";
            cell3row1.innerHTML = "<b>binarnie</b>";

            let row2 = table.insertRow(1);
            let cell1row2 = row2.insertCell(0);
            let cell2row2 = row2.insertCell(1);
            let cell3row2 = row2.insertCell(2);
            cell1row2.innerHTML = "Adres IP";
            cell2row2.innerHTML = fullDataArray[i][0];
            cell3row2.setAttribute("class", "binary");
            cell3row2.innerHTML = converToBinary(fullDataArray[i][0]);

            let row3 = table.insertRow(2);
            let cell1row3 = row3.insertCell(0);
            let cell2row3 = row3.insertCell(1);
            let cell3row3 = row3.insertCell(2);
            cell1row3.innerHTML = "Maska";
            cell2row3.innerHTML = fullDataArray[i][1] + " = " + returnShortMask(fullDataArray[i][1]);
            cell3row3.setAttribute("class", "binary");
            cell3row3.innerHTML = converToBinary(fullDataArray[i][1]);

            let row4 = table.insertRow(3);
            let cell1row4 = row4.insertCell(0);
            let cell2row4 = row4.insertCell(1);
            let cell3row4 = row4.insertCell(2);
            let cell4row4 = row4.insertCell(3);
            cell1row4.innerHTML = "Adres sieci";
            cell2row4.innerHTML = fullDataArray[i][2];
            cell3row4.setAttribute("class", "binary");
            cell3row4.innerHTML = converToBinary(fullDataArray[i][2]);
            cell4row4.innerHTML = "klasa " + returnIpClass(fullDataArray[i][2]);

            let row5 = table.insertRow(4);
            let cell1row5 = row5.insertCell(0);
            let cell2row5 = row5.insertCell(1);
            let cell3row5 = row5.insertCell(2);
            cell1row5.innerHTML = "Adres rozgłoszeniowy";
            cell2row5.innerHTML = fullDataArray[i][3];
            cell3row5.setAttribute("class", "binary");
            cell3row5.innerHTML = converToBinary(fullDataArray[i][3]);

            let row6 = table.insertRow(5);
            let cell1row6 = row6.insertCell(0);
            let cell2row6 = row6.insertCell(1);
            cell1row6.innerHTML = "Hostów w sieci";
            cell2row6.innerHTML = fullDataArray[i][4];

            let row7 = table.insertRow(6);
            let cell1row7 = row7.insertCell(0);
            let cell2row7 = row7.insertCell(1);
            let cell3row7 = row7.insertCell(2);
            cell1row7.innerHTML = "Host min";
            cell2row7.innerHTML = fullDataArray[i][5];
            cell3row7.setAttribute("class", "binary");
            cell3row7.innerHTML = converToBinary(fullDataArray[i][5]);

            let row8 = table.insertRow(7);
            let cell1row8 = row8.insertCell(0);
            let cell2row8 = row8.insertCell(1);
            let cell3row8 = row8.insertCell(2);
            cell1row8.innerHTML = "Host max";
            cell2row8.innerHTML = fullDataArray[i][6];
            cell3row8.setAttribute("class", "binary");
            cell3row8.innerHTML = converToBinary(fullDataArray[i][6]);

            table.appendChild(document.createElement("hr"));

            console.log(fullDataArray);
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("send").addEventListener('click', function () {
        const table = document.getElementById("table").rows;

        // [ipAddress, fullMask, webAddress, broadcastAddress, hostNumber, hostMin, hostMax]
        let fullData = calculateIp(document.getElementById("ip").value + "/" + document.getElementById("mask").value);
        if (!fullData) {
            alert("IP powinno być w formacie XXX.XXX.XXX.XXX i być liczbami!");
        }
        else {
            document.getElementById("content").removeAttribute("style");
            for (let i = 0; i <= table.length - 2; i++) {
                console.log(fullData[i]);
                table[i + 1].cells[1].innerHTML = fullData[i];
                table[i + 1].cells[2].innerHTML = converToBinary(fullData[i]);
                if (i == 1) {
                    table[i + 1].cells[1].innerHTML = fullData[i] + " = " + returnShortMask(fullData[i]);
                }
                else if (i == 2) {
                    table[i + 1].cells[3].innerHTML = "klasa " + returnIpClass(fullData[0]);
                }
                else if (i == 4) {
                    table[i + 1].cells[2].innerHTML = "";
                }
            }

            let cookies = decodeURIComponent(document.cookie);
            console.log("Ciastka: " + cookies);
            if (cookies == "") {
                console.log("Brak ciastek. Dodawanie...");
                document.cookie = "ipaddress1=" + fullData[0] + "/" + returnShortMask(fullData[1]) + "; expires=" + returnDateYearAhead() + ";";
                document.cookie = "counter=1; expires=" + returnDateYearAhead() + ";";
                console.log("Dodano!");
                console.log("Ciastka: " + decodeURIComponent(document.cookie));
            }
            else {
                console.log("Wykryto ciastka. Analizowanie...");
                cookies = cookies.split("; ");
                console.log("Ciastka: " + cookies);

                let counter;
                for (let i = 0; i < cookies.length; i++) {
                    if (cookies[i].substring(0, 7) == "counter") {
                        counter = parseInt(cookies[i].substring(8)) + 1;
                    }
                }

                console.log("Counter: " + counter);
                document.cookie = "ipaddress" + counter + "=" + fullData[0] + "/" + returnShortMask(fullData[1]) + "; expires=" + returnDateYearAhead() + ";";
                document.cookie = "counter=" + counter + "; expires=" + returnDateYearAhead() + ";";
                console.log("Ciastka po dodaniu nowych: " + decodeURIComponent(document.cookie));
            }
        }
    });

    document.getElementById("history").addEventListener('click', createHistory);

    document.getElementById("deleteHistory").addEventListener('click', function () {
        let cookies = decodeURIComponent(document.cookie);
        cookies = cookies.split("; ");

        let counter;
        for (let i = 0; i < cookies.length; i++) {
            if (cookies[i].substring(0, 7) == "counter") {
                counter = parseInt(cookies[i].substring(8)) + 1;
            }
        }

        console.log("------------");
        console.log("Counter: " + counter);

        for (let j = 1; j < counter; j++) {
            console.log("Usuwanie ciastka nr." + j);
            document.cookie = "ipaddress" + j + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
            console.log("Usunięto ciastko nr." + j);
        }
        document.cookie = "counter=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

        document.getElementById("historyContent").innerHTML = "";
        alert("Historia obliczeń została wyczyszczona.");
    });
});