const logText = document.getElementById('log');
const logMessage = document.getElementById('messages');

/* RuleID : {startConcept, verbConcept, endConcept, message} */
const rules = [
{
    'enabled': true,
    'name':'RBD-4.2',
    'startConcept':'ResalePrice',
    'verbConcept':doesNotExceed,
    'endConcept':'InventoryValue',
    'severity':'danger',
    'message':'Resale Price may not exceed Inventory Value.'
},
{
    'enabled': false,
    'name':'RBD-4.2-Bis',
    'startConcept':'ResalePrice',
    'verbConcept':isNonNegativeNumber,
    'endConcept':'ResalePrice',
    'severity':'danger',
    'message':'Resale Price must be a non-negative number.'
}];

function isNonNegativeNumber(startConcept, endConcept) {
    const startConceptValue = parseInt(document.getElementById(startConcept).value, 0);
    const endConceptValue = parseInt(document.getElementById(endConcept).value, 0);
    return (parseFloat(startConceptValue) > -1);
}

function doesNotExceed(startConcept, endConcept) {
    const startConceptValue = parseInt(document.getElementById(startConcept).value, 0);
    const endConceptValue = parseInt(document.getElementById(endConcept).value, 0);
    return !(startConceptValue > endConceptValue);
}

function clearMessages() {
    while (logText.childNodes.length > 0) {
        logText.removeChild(logText.childNodes[0]);
    }
    while (logMessage.childNodes.length > 0) {
        logMessage.removeChild(logMessage.childNodes[0]);
    }
}

function log(message, status) {
    logText.insertAdjacentHTML('beforeend', `<div class="${status}">${message}</div>`);
}

function logMessages(message, status) {
    const icon = '<svg class="bi bi-exclamation-triangle text-danger" width="32" height="32" fill="currentColor" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"></path><path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z"></path></svg> &nbsp;';
    logMessage.insertAdjacentHTML('beforeend', `<div class="alert alert-${status}" role="alert">${ status == 'danger' ? icon : '' }${message}</div>`);
}

// List the configured and enabled rules.
function listRules(rules) {

    const rulesList = document.getElementById('rules');
    const numberOfRules = document.getElementById('numberOfRules');
    let numberOfEnabledRules = 0;

    while (rulesList.children.length > 0) {rulesList.removeChild(rulesList.children[0])};
    rules.forEach(rule => {
        if (rule.enabled) {
            rulesList.insertAdjacentHTML('beforeend',`
            <li class="list-group-item d-flex justify-content-between lh-sm">
                <div>
                  <h6 class="my-0">${rule.name}</h6>
                  <small class="text-body-secondary">${rule.message}</small>
                </div>
                <span class="text-body-secondary"></span>
              </li>`);
            numberOfEnabledRules++;
        }
    });
    numberOfRules.innerText = numberOfEnabledRules;
}

function evaluateRules(rules) {
    
    let allRulesAreValid = true;
    rules.forEach(rule => {
        if (rule.enabled) {
            let ruleIsNotViolated = rule.verbConcept(rule.startConcept, rule.endConcept);

            log(
                'Evaluating: '
                + rule.name +': '
                + rule.startConcept + ' '
                + rule.verbConcept.name + ' '
                + rule.endConcept
                + (ruleIsNotViolated ? ' (Valid)' : ' (Violation)'),
                  (ruleIsNotViolated) ? 'valid' : rule.severity);

            if (!ruleIsNotViolated) {
                logMessages(rule.message, rule.severity);
            }

            allRulesAreValid = allRulesAreValid && ruleIsNotViolated;
        }
    });
    return allRulesAreValid;
}

(() => {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation');
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            clearMessages();
            let isValid = form.checkValidity();
            isValid = isValid && evaluateRules(rules);
            event.preventDefault()
            event.stopPropagation()
            listRules(rules);
        }, false)
    })

})()