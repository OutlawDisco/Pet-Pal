// wrapped in $ so the page loads first
$(function(){
    // initial jQuery grabs
    var emailIn = $('#user-email');
    var passIn = $('#user-password');
    var modalButtons = $('.modal-button'); // array
    var loggedIn = false;

    // Used for encryption, can be anything
    const KEY = "PapXiuiFyPoqSiDufQ";
    const SEP = "314159";

    // Changes the password into a more secure key to store
    function convertToKey(password){
        var converted = "";
        for(var i = 0; i < password.length; i++){
            converted += password.charCodeAt(i) * KEY.charCodeAt(i);
            converted += SEP;
        }
        return converted;
    }

    // Changes the secure key back into the original password
    function convertToPassword(encrypted){
        var converted = "";
        var chars = encrypted.split(SEP);
        
        for(var i = 0; i < chars.length - 1; i++){
            converted += String.fromCharCode(chars[i] / KEY.charCodeAt(i));
        }
        return converted;
    }

    // Pushes the username and secure key to local storage
    function saveToLocal(name, pass){
        var user = {name: name, key: convertToKey(pass)};
        localStorage.setItem("user", JSON.stringify(user));
    }

    // Grabs the username and secure key from local storage
    function pullFromLocal() {
        return JSON.parse(localStorage.getItem("user"));
    }

    // Checks that input matches the saved password
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

    // Opens a modal* when "log in" or "sign up" are clicked
    modalButtons.on('click', function(e) {
        var clicked = $(e.target);
        if(clicked.attr('id') === 'openLogin'){
            openModal('login');
        }else{
            openModal('signup');
        }
    });

    // Opens the modal for signup/login information
    function openModal(type){
        console.log(type);

        // Initial jquery grabs
        var loginModal = $('#loginPrompt');
        var initialText = $('#start');

        // Changes which section is displayed
        initialText.addClass('d-none');
        loginModal.removeClass('d-none');
        loginModal.addClass('d-flex');

        // If "log in" was pressed, change some text values to reflect that
        // Same with "sign up"
        if(type === 'login'){
            $('#modal-title').text("Log in");
            $('#loginBtn').text("Log in");
        }else{
            $('#modal-title').text("Register");
            $('#loginBtn').text("Register");
            $('#passwordConfirm').removeClass("d-none");
        }

        // displays original section when "back" is clicked
        $('#backBtn').on('click', function (){
            loginModal.removeClass('d-flex');
            loginModal.addClass('d-none');
            initialText.removeClass('d-none');
            $('#passwordConfirm').addClass('d-none');
            return;
        });

        // Handles the signing up and logging in process
        $('#loginBtn').on('click', function (){
            var email = $('#email').val();
            var password = $('#passwordIn').val();

            if(type === 'login' && (pullFromLocal() !== null)){ // makes sure there is information in local storage
                if(checkPassword(password) && pullFromLocal().name === email){
                    loggedIn = true;
                    console.log(loggedIn);
                    return;
                }else{
                    modalAlert("Incorrect Info", "Incorrect email or password. Please try again.");
                }
            }else if(type === 'signup'){
                console.log("poopy");
                var passwordCheck = $('#passwordConfirm').val();
                if(password === passwordCheck){
                    saveToLocal(email, password);
                    loggedIn = true;
                    console.log(loggedIn);
                    return;
                }else{
                    modalAlert("Mismatch", "Passwords don't match. Please make sure you enter them correctly.");
                }
            }else{
                modalAlert("No account", "No accounts found. Please use the sign up page to create an account.");
            }
        });
    }

    function modalAlert(_title, _message){
        var modal = $('<section>');
        var title = $('<h1>' + _title + "</h1>");
        var message = $('<p>' + _message + '</p>');
        var buttonSect = $('<section>');
        var button = $('<button>OK</button>');

        $('html').append(modal);
        modal.append(title);
        modal.append('<hr>');
        modal.append(message);
        modal.append('<hr>');
        modal.append(buttonSect);
        buttonSect.append(button);

        modal.addClass('bg-white rounded p-3 fixed-top my-2 mx-auto w-25');
        button.addClass('bg-primary rounded border-0 text-white p-2 px-4');
        buttonSect.addClass('text-right');
        $('body').css({ opacity: 0.5});

        button.on('click', function (){
            $('body').css({opacity: 1});
            modal.remove();
        });
    }
});    