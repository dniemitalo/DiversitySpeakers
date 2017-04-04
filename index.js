var speakers;
var numbers;
$(document).ready(function(){
    $('#block').change(function(){
        console.log('block change function called');
        $('#periodA').html($('#block').val()*2-1);
        $('#periodB').html($('#block').val()*2);
        $('#fields').show();
        $('#block').hide();
        $('#blockdiv').hide();
        getTopics();
        });

    $('#periodOrBlock').change(function(){
        console.log('Period or block change function called');
        
        if($('#periodOrBlock').val()=="B4"){
            console.log("B4 selected");
            $('#periodA').html($('#block').val()*2-1);
            $('#periodB').html($('#block').val()*2);
            $('#fields').show();
            $('#PAselect').show();
            $('#PBselect').show();
        }
        else if($('#periodOrBlock').val()=="P7"){
            console.log("P7 selected");
            $('#periodA').html(7);
            $('#fields').show();
            // document.getElementById('topicB').value = "NA";
            // $('#topicB').val("NA");
            $('#topicB').attr('value','NA');
            $('#PAselect').show();
            $('#PBselect').hide();
        }
        else if($('#periodOrBlock').val()=="P8"){
            console.log("P8 selected");
            $('#periodB').html(8);
            $('#fields').show();
            // document.getElementById('topicA').value = "NA";
            // $('#topicA').val("NA");
            $('#topicA').attr('value','NA');
            $('#PAselect').hide();
            $('#PBselect').show();
        }
        getTopics();
        });

    // $('#fields').hide();
    $('#block').val(4);
    $('#block').change();
    
    $("#submit").click(function(){
        // console.log("Button clicked");
        if (validateForm()){
            // console.log("Form validation returned true.");
            signUp();
        }
        else {
            // console.log("Form validation returned false.");
        }
    }
    );//close btn_submit.click

});//close document ready

function signUp(){
    $('#status').html('Connecting to database...');
    var skinny;
    if($('#periodOrBlock').val()=="P7"){
        skinny = 7;
    }
    else if($('#periodOrBlock').val()=="P8"){
        skinny = 8;
    }

    var first = $('#first').val();
    var last = $('#last').val();
    var teacher = $('#teacher').val();
    var periodA = $('#block').val()*2-1;
    var speakerA = $('#topicA').val();
    var periodB = $('#block').val()*2;
    var speakerB = $('#topicB').val();    
    var params = 
        'skinny='+skinny+
        '&first='+first+
        '&last='+last+
        '&teacher='+teacher+
        '&periodA='+periodA+
        '&speakerA='+speakerA+
        '&periodB='+periodB+
        '&speakerB='+speakerB;
    // console.log(params);

    var xhr_signup = new XMLHttpRequest();
    xhr_signup.onreadystatechange = function() {
        if (xhr_signup.status == 200) {
            // console.log("XMLHttpRequest successful");
            // console.log(xhr_signup.responseText);
            $('#status').html(xhr_signup.responseText);
            getTopics();
            $('#first').val("");
            $('#last').val("");
        }
    };
    xhr_signup.open("POST", "signup.php", true);
    xhr_signup.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr_signup.send(params);
}

function getTopics(){
    document.getElementById("topicA").innerHTML = "<option>Loading options...</option>";
    document.getElementById("topicB").innerHTML = "<option>Loading options...</option>";
    var xhr_speakers = new XMLHttpRequest();
    var topicsURL = "get_speakers.php";
    xhr_speakers.open("GET",topicsURL, true);
    xhr_speakers.onload = function(){
        if(xhr_speakers.status===200){
            speakers = JSON.parse(xhr_speakers.responseText);
            var xhr_numbers = new XMLHttpRequest();
            var topicsURL = "get_numbers.php";
            xhr_numbers.open("GET",topicsURL, true);
            xhr_numbers.onload = function(){
                if(xhr_numbers.status===200){
                    numbers = JSON.parse(xhr_numbers.responseText);
                    var htmlTextA = "";
                    var htmlTextB = "";
                    var numSignedUpA;
                    var numSignedUpB;
                    for (i=0;i<parseInt(speakers.length);i++){
                        numSignedUpA = null;
                        numSignedUpB = null;
                        for(n=0;n<parseInt(numbers.length);n++){
                            if(numbers[n]['id']==speakers[i]['id'] && numbers[n]['period']==($('#block').val()*2-1)){
                                numSignedUpA = numbers[n]['studentCount'];
                            }
                            if(numbers[n]['id']==speakers[i]['id'] && numbers[n]['period']==($('#block').val()*2)){
                                numSignedUpB = numbers[n]['studentCount'];
                            }                            
                        }
                        if (numSignedUpA < 28){
                                htmlTextA += "<option value='"+speakers[i]['id']+"'>";
                                htmlTextA += speakers[i]['topic'];
                                htmlTextA += "</option>\n";
                        }
                        if (numSignedUpB < 28){
                                htmlTextB += "<option value='"+speakers[i]['id']+"'>";
                                htmlTextB += speakers[i]['topic'];
                                htmlTextB += "</option>\n";
                        }
                    } 
                    document.getElementById("topicA").innerHTML = htmlTextA;
                    document.getElementById("topicB").innerHTML = htmlTextB;
                    }
                    else{
                    // console.log("XML HTTP error: "+xhr_numbers.status);
                    $('#status').html(xhr_numbers.status);
                    }
                };
            xhr_numbers.send();
        }
        else{
            $('#status').html(xhr_numbers.status);
        }
        };
    xhr_speakers.send();
}

function validateForm(){
    var periodOrBlock = $('#periodOrBlock').val();
    var block = $('#block').val();
    var teacher = $('#teacher').val();     
    var first = $('#first').val();     
    var last = $('#last').val();
    var topicA = $('#topicA').val();
    var topicB = $('#topicB').val();
    
    var alertmessage = "";
    var validated = true;
    if (teacher==""||teacher==null){
        alertmessage += "Teacher must be selected.<br>";
        validated = false;
    }
    if (first==""||first==null||first.length<2){
        alertmessage += "First name must be entered.<br>";
        validated = false;
    }
    if (last==""||last==null||last.length<2){
        alertmessage += "Last name must be entered.<br>";
        validated = false;
    }
    if(periodOrBlock=="P7"||periodOrBlock=="P8"){
        if (topicA==null&&topicB==null){
            alertmessage += "Select a topic.<br>";
            validated = false;
        }
    }
    else{
        if (topicA==""||topicA==null||topicB==""||topicB==null||topicA==topicB){
            alertmessage += "Two different topics must be selected.<br>";
            validated = false;
        }
    }
    if (validated==false){
        $("#status").html("<span style=\"color:red;font-weight:bold;font-size:110%\">"+alertmessage+"</span>");
        window.scrollTo(0,document.body.scrollHeight);
    }
    if (validated){
        $("#status").html("<span style=\"color:red;font-weight:bold;font-size:110%\">"+""+"</span>");
    }
    return validated;      
}