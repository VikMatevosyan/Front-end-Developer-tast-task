let fn = document.querySelectorAll('[name="full-name"]');
fn[0].addEventListener('input', validate.fullname);
fn[1].addEventListener('input', validate.fullname);

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
       if (z>=48 && z<=57) {
    return true;
} else {
    return false
}
    },
    securitycode: function (ev) {
        let s = this.value;
        if(s.length == 0) {
            return;
        }
        s = s[s.length-1].codePointAt(0);
        if (s>=48 && s<=57) {
            return true;
        } else {
            return false
        }
    }
};


let formSwitchs = document.querySelectorAll('[data-form]');

for (let i = 0; i < formSwitchs.length; i++) {
    formSwitchs[i].addEventListener('click', switchForm);
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
btn.addEventListener('click', function () {
    let form = this.closest('.form-item');

    function invalidRow(ev) {
        let inputs = ev.target.closest('.form-item').querySelectorAll('.input-required');
        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].value.length == 0) {
                inputs[i].classList.add('input-invalid');
            } else {
                    inputs[i].classList.remove('input-invalid');
                    let msg = inputs[i].closest('.shipping-name').querySelector('.input-message ');
                    if (msg) {
                        msg.classList.remove('show')
                    }
                }
            }
        let invalid = document.querySelector('.input-invalid');
        if(invalid) {
            invalid.focus();
            let msg = invalid.closest('.shipping-name').querySelector('.input-message ');
            if (msg) {
                msg.classList.add('show')
            }
        } else {
      switchForm(null,  ev.target.closest('.form-item').nextElementSibling);
        }

        }


}




























































