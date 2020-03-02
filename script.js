let fn = document.querySelectorAll('[name="full-name"]');
let zipname = document.querySelectorAll('[name="zip"]');
let seccode = document.querySelector('[name="sec-code"]');
let card = document.querySelector('.card');
let validate = {
    fullname: function (ev) {
        let v = this.value;
        if(v.length == 0) {
            return;
        }
        v = v[v.length-1].codePointAt(0);
        if (!((v>=65 && v<=90) ||
            (v>=97 && v<=122) ||
            (v==32 || v==39 || v==45))) {
            this.value.slice(0,-1);
        }
    },
    zip: function (ev) {
        let z = this.value;
        if(z.length == 0) {
            return;
        }
        z = z[z.length-1].codePointAt(0);
       if (!(z>=48 && z<=57) || this.value.length > 12) {
          this.value =  this.value.slice(0,-1);
}
    },
    securitycode: function (ev) {
        let s = this.value;
        if(s.length == 0) {
            return;
        }
        s = s[s.length-1].codePointAt(0);
        if (!(s>=48 && s<=57)) {
            this.value =  this.value.slice(0,-1);
        }
    },
    master: function (ev) {
        let visa = document.querySelector('.visa');
        let mastercard = document.querySelector('.mast');
        let amex = document.querySelector('.amex');
        let m = this.value;
        if (m.length[0] == 4) {
            visa.classList.add('visiblecard');
        }
        if (m.length[0] == 5) {
            mastercard.classList.add('visiblecard');
        }
        if (m.length[0] == 3) {
            amex.classList.add('visiblecard');
        }
    }
};

fn[0].addEventListener('input', validate.fullname);
fn[1].addEventListener('input', validate.fullname);
zipname[0].addEventListener('input',validate.zip);
zipname[1].addEventListener('input',validate.zip);
seccode.addEventListener('input', validate.securitycode);

let formSwitchs = document.querySelectorAll('[data-form]');

for (let i = 0; i < formSwitchs.length; i++) {
    formSwitchs[i].addEventListener('click', validSwitch);
}

function validSwitch (ev) {
let elem = ev.target;
let siblings = [];
let sibling = elem.previousElementSibling;
while(sibling != null) {
    siblings.push(sibling);
    sibling = sibling.previousElementSibling;
}
if (siblings.length > 0) {
    for (let i = 0; i < siblings.length; i++) {
       invalidRow(null, siblings[i])
    }
}
}

function switchForm (ev, fObj) {

    let forms = document.querySelectorAll('.forms-inputs>div');
    for (let i = 0; i < forms.length; i++) {
        forms[i].classList.add('hidden');
    }
    let form = null;
    if (fObj) {
        form = fObj;
    }
    else {
        let formClass = ev.target.getAttribute('data-form');
         form = document.querySelector('.' + formClass);
    }
    if (form) {
        form.classList.remove('hidden');
    }
}

let btn = document.querySelector('.shipping-continue');
btn.addEventListener('click', invalidRow);

let btn2 = document.querySelector('.billing-continue');
btn2.addEventListener('click', invalidRow);

// let btn3 = document.querySelector('..payment-button ');
// btn3.addEventListener('click', invalidRow);

function invalidRow(ev, span) {
let elem = null;
if (span) {
    elem = span;
    parent = document.querySelector('.' + elem.getAttribute('data-form'));
} else {
    elem = ev.target;
    parent = elem.closest('.form-item');
}

    let inputs = parent.querySelectorAll('.input-required');
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].value.length == 0) {
            inputs[i].classList.add('input-invalid');
        } else {

            if (inputs[i].getAttribute('name') === "zip") {
                if (inputs[i].value.length < 4 || inputs[i].value.length > 12) {
                    inputs[i].classList.add('input-invalid');
                    continue;
                }

            }

            inputs[i].classList.remove('input-invalid');
            let msg = inputs[i].closest('.input-field').querySelector('.input-message ');
            if (msg) {
                msg.classList.remove('show')
            }
        }
    }
    let invalid = parent.querySelector('.input-invalid');
    if(invalid) {
        invalid.focus();
        let msg = invalid.closest('.input-field').querySelector('.input-message ');
        if (msg) {
            msg.classList.add('show')
        }
    } else {
        if (span) {
            elem.nextElementSibling.classList.add('violet-color');
        }
        switchForm(null,  parent.nextElementSibling);
    }

}

let copy = document.querySelector('.billing-a');
copy.addEventListener('click', function () {
   let sames = document.querySelectorAll('.same');
   let pasts = document.querySelectorAll('.past');
    for (let i = 0; i < sames.length; i++) {
        if(sames[i].getAttribute("data-input") == pasts[i].getAttribute("data-input") ) {
           pasts[i].value = sames[i].value;
        }
    }
});



function getCountries () {
    let dropdown = document.querySelectorAll('.country');

    let defaultOption = document.createElement('option');
    defaultOption.text = 'Country';

    dropdown[0].add(defaultOption);
    dropdown[0].selectedIndex = 0;

    const url = 'https://restcountries.eu/rest/v2/all';

    const request = new XMLHttpRequest();
    request.open('GET', url, true);

    request.onreadystatechange = function() {
        if (request.status === 200 && request.readyState ===4) {
            const data = JSON.parse(request.responseText);
            let option;
            for (let i = 0; i < data.length; i++) {
                option = document.createElement('option');
                option.text = data[i].name;
                option.value = data[i].name;
                dropdown[0].add(option);
            }
            dropdown[1].parentElement.replaceChild(dropdown[0].cloneNode(true), dropdown[1]);

        }
    };

    request.onerror = function() {
        console.error('An error occurred fetching the JSON from ' + url);
    };

    request.send();
}
getCountries ();

let geo = document.querySelectorAll('.shape');
geo[0].addEventListener('click', function () {

    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (res){
            let req = new XMLHttpRequest();
            req.open('GET', "https://api.opencagedata.com/geocode/v1/json?q="+res.coords.latitude+"+"+res.coords.longitude+"&key=1bd982cf74cd430fa3335f64f0da351f&pretty=1", true);
            req.send();
            req.onreadystatechange = function() {
                if (this.readyState ===4 && this.status === 200) {
                    let data = this.responseText;
                    data = JSON.parse(data);
                    setCity(data);

                }
            };

        });
    }

});
geo[1].addEventListener('click', function () {

    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (res){
            let req = new XMLHttpRequest();
            req.open('GET', "https://api.opencagedata.com/geocode/v1/json?q="+res.coords.latitude+"+"+res.coords.longitude+"&key=1bd982cf74cd430fa3335f64f0da351f&pretty=1", true);
            req.send();
            req.onreadystatechange = function() {
                if (this.readyState ===4 && this.status === 200) {
                    let data = this.responseText;
                    data = JSON.parse(data);
                    setCity(data);

                }
            };

        });
    }

});
function setCity (data) {
    let city = document.querySelectorAll('.city');
    city[0].value = data.results[0].components.city;
    city[1].value = data.results[0].components.city;
    let country = data.results[0].components.country;
    document.querySelectorAll('option[value="' + country + '"]').selected = true;
}


function Pay () {
    let formform = document.querySelector('.form-form');
    let thanks = document.querySelector('.thank');
    let pay = document.querySelector('.pay');
    pay.addEventListener('click', function () {

        formform.classList.add('formhid');
        thanks.classList.add('thank-vis');
    });
}
Pay();



$(document).ready(function() {
    $(".daytime").inputmask("+374 (99) 99-99-99");
    $(".billing-em").inputmask({ alias: "email"});
    $('.date').inputmask({
        alias: 'datetime',
        inputFormat: 'mm/yy'
    });
    $('.card').inputmask({
        mask: "9{4} 9{4} 9{4} 9{4}",
        inputFormat: 'XXXX XXXX XXXX XXXX'
    });
});






function validateThanks () {
    let email = document.querySelector('billing-em');
    let thankemail = document.querySelector('.a1');
    thankemail.innerText = email.value;

    let day = document.querySelector('.days');
    let d = new Date ();
    d.setMonth(d.getMonth() + 1);
    day.innerText = d;

    let print = document.querySelector('a2');
    print.addEventListener('click', function () {
        window.print();
    });
}

validateThanks ();


//  function month_name (dt){
//     months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October",
//         "November", "December" ];
//     return months[dt.getMonth()];
// };





























