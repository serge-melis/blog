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
    logMessage.insertAdjacentHTML('beforeend', `<div class="alert alert-${status}" role="alert">${message}</div>`);
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