$(function(){
    var emailIn = $('#user-email');
    var passIn = $('#user-password');
    var modalButtons = $('.modal-button');
    var loggedIn = false;

    const KEY = "PapXiuiFyPoqSiDufQ";
    const SEP = "314159";

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

    modalButtons.on('click', function(e) {
        var clicked = $(e.target);
        if(clicked.attr('id') === 'openLogin'){
            openModal('login');
        }else{
            openModal('signup');
        }
    });

    function openModal(type){
        var loginModal = $('#loginPrompt');
        var initialText = $('#start');
        initialText.addClass('d-none');
        loginModal.removeClass('d-none');
        loginModal.addClass('d-flex');

        if(type === 'login'){
            $('#modal-title').text("Log in");
            $('#loginBtn').text("Log in");
        }else{
            $('#modal-title').text("Register");
            $('#loginBtn').text("Register");
            $('#passwordConfirm').removeClass("d-none");
        }

        $('#backBtn').on('click', function (){
            loginModal.removeClass('d-flex');
            loginModal.addClass('d-none');
            initialText.removeClass('d-none');
            $('#passwordConfirm').addClass('d-none');
        });

        $('#loginBtn').on('click', function (){
            var email = $('#email').val();
            var password = $('#passwordIn').val();
            if(type === 'login'){
                if(checkPassword(password) && pullFromLocal().name === email){
                    loggedIn = true;
                    console.log(loggedIn);
                }
            }
            if(type === 'signup'){
                var passwordCheck = $('#passwordConfirm').val();
                if(password === passwordCheck){
                    saveToLocal(email, password);
                    loggedIn = true;
                    console.log(loggedIn);
                }
            }
        });
    }

    function modalAlert(message){
        
    }
});    