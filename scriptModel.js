var actions = ${JSON.stringify(actions)};
var params = ${JSON.stringify(params)};
var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
var actionsVariables = {};
for (var param of params) {
  var paramValue = urlParams.get(param.value);
  if (paramValue && !param.parsing) {
    actionsVariables[param.value] = paramValue;
    continue;
  }
  if (paramValue && param.parsing) {
    if (param.parsing.type === "casematch") {
      for (var c of param.parsing.cases) {
        if (
          paramValue ===
          inputParsing({ param: param.value, value: paramValue }, c.match)
        ) {
          actionsVariables[param.value] = inputParsing(
            { param: param.value, value: paramValue },
            c.return
          );
          break;
        }
      }
    }

    if (param.parsing.type === "format") {
      actionsVariables[param.value] = inputParsing(
        { param: param.value, value: paramValue },
        param.parsing.format
      );
    }
    continue;
  }

  actionsVariables[param.value] = paramValue;
}

for (var action of actions) {
  var actionQuery = inputParsing(actionsVariables, action.query);
  var actionText = inputParsing(actionsVariables, action.text);
  var element = document.querySelector(actionQuery);
  if (!element) {
    continue;
  }
  if (action.type === "insertattr") {
    var textSplit = actionText.replace('"', "").split("=");
    var attributeName = textSplit[0];
    var attributeValue = textSplit[1];

    if (!attributeName || !attributeValue) {
      continue;
    }

    element.setAttribute(attributeName, attributeValue);
  }

  if (action.type === "insertlink") {
    var elementHtml = element.outerHTML;
    var newElementHtml = '<a href="' + actionText + '">' + elementHtml + "</a>";
    element.outerHTML = newElementHtml;
  }
}

function inputParsing(variables, templateString) {
  var varriablesKeys = Object.keys(variables);
  var newString = templateString;
  for (var key of varriablesKeys) {
    newString.replace("{" + key + "}", variables[key]);
  }
  return newString;
}
