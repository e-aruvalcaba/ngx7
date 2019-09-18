module.exports = function() {
    window.slideToTop = function(){
        var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
        if (currentScroll > 0) {
            window.requestAnimationFrame(window.slideToTop);
            window.scrollTo (0,currentScroll - (currentScroll/5));
        }
    }
    window.dismissAlert = function(theAlert){
        theAlert.addEventListener('transitionend',()=>{
            theAlert.parentNode.removeChild(theAlert);
        });
        theAlert.classList.add('hidden');
    }
    window.createAlert = function(parent,type,message,actionMessage=false,actionFn=()=>{}){
        let alert = document.createElement('div');
        alert.setAttribute('class','cmx-alert-bar cmx-alert-bar--'+type+' hidden');

        let alertText = document.createElement('p');
        alertText.setAttribute('class','cmx-alert-bar__message')
        alertText.textContent = message;

        if(actionMessage) {
            let alertAction = document.createElement('button');
            alertAction.setAttribute('class','cmx-alert-bar__action');
            alertAction.addEventListener('click',actionFn);
            alertAction.textContent = actionMessage;
            alertText.appendChild(alertAction);
        }

        alert.appendChild(alertText);

        let alertDismiss = document.createElement('button');
        alertDismiss.setAttribute('class','cmx-alert-bar__close');
        alertDismiss.innerHTML = '<span aria-hidden="true" class="cmx-icon-close"></span><span class="sr-only">Dismiss Alert</span>';
        alertDismiss.addEventListener('click',()=>{
            window.dismissAlert(alert);
        });

        alert.appendChild(alertDismiss);

        let numAlerts = parent.querySelectorAll('.cmx-alert-bar');
        if(numAlerts.length>2){
            parent.removeChild(parent.childNodes[0]);
        }

        parent.appendChild(alert);
        window.slideToTop();
        alert.classList.remove('hidden');

        window.setTimeout(()=>{
            window.dismissAlert(alert);
        },10000);
    };

    // this one is for demo purposes only
    window.fireAlert = function(e){
        e.preventDefault();
        let target = document.querySelector('#alertsWrapper');
        let form = e.target;
        let type = form.alertType.value;
        let message = form.alertMessage.value;
        let cta = form.alertCta.value;
        let ctaFn = function(){
            eval(form.alertCtaFn.value);
        }
        window.createAlert(target, type, message, cta, ctaFn);
    };
}
