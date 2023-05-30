const KEY = "PapXiuiFyPoqSiDufQ";
const SEP = "314159";

saveToLocal("Kyle", "M0nk3y14");
console.log(checkPassword("M0nk3y14"));

function convertToKey(password){
    var converted = "";
    for(var i = 0; i < password.length; i++){
        converted += password.charCodeAt(i) * KEY.charCodeAt(i);
        converted += SEP;
    }
    return converted;
}

function convertToPassword(encrypted){
    var converted = "";
    var chars = encrypted.split(SEP);
    console.log(chars);
    for(var i = 0; i < chars.length - 1; i++){
        converted += String.fromCharCode(chars[i] / KEY.charCodeAt(i));
    }
    return converted;
}

function saveToLocal(name, pass){
    var user = {name: name, key: convertToKey(pass)};
    localStorage.setItem("user", JSON.stringify(user));
}

function pullFromLocal() {
    return JSON.parse(localStorage.getItem("user"));
}

function checkPassword(input) {
    var stored = pullFromLocal();
    var check = convertToPassword(stored.key);

    for(var i = 0; i < input.length; i++){
        if(input.at(i) !== check.at(i)){
            return false;
        }
    }
    return true;
}