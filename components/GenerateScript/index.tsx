import React from "react";
import { ActionsState } from "../Actions";
import { ParamsState } from "../Params";
import { minify } from "terser";

interface GenerateScriptProps {
	params: ParamsState[]
	actions: ActionsState[]
	setGeneratedCode: React.Dispatch<React.SetStateAction<string | null>>
}

const GenerateScript: React.FC<GenerateScriptProps> = ({
	params,
	actions,
	setGeneratedCode,
}) => {


	const handleGenerate = async () => {
		if(!params.length || !actions.length) {
			return null
		}

		const code = `
			var actions = ${JSON.stringify(actions)};
			var params = ${JSON.stringify(params)};
			var queryString = window.location.search;
			var urlParams = new URLSearchParams(queryString);
			var actionsVariables = {}
			for( var param of params ) {
					var paramValue = urlParams.get(param.value)
					if(paramValue && !param.parsing) {
						actionsVariables[param.value] = paramValue
						continue
					}
					if(paramValue && param.parsing) {
							if (param.parsing.type === 'casematch') {
									for (var c of param.parsing.cases) {
											if(paramValue === inputParsing({param: param.value, value: paramValue}, c.match)) {
													actionsVariables[param.value] = inputParsing({param: param.value, value: paramValue}, c.return)
													break
											}
											actionsVariables[param.value] = paramValue
									}
							}
			
							if (param.parsing.type === 'format') {
									actionsVariables[param.value] = inputParsing({param: param.value, value: paramValue}, param.parsing.format)
							}
							continue
					}
			
					actionsVariables[param.value] = paramValue
			}
			
			for (var action of actions) {
					var actionQuery = inputParsing(actionsVariables, action.query)
					var actionText = inputParsing(actionsVariables, action.text)
					var element = document.querySelector(actionQuery)
					if(!element) {
							continue
					}
					if(action.type === 'insertattr') {
							var textSplit = actionText.replaceAll('"', '').replace(/=/, '{<#>}').split('{<#>}')
							var attributeName = textSplit[0]
							var attributeValue = textSplit[1]
			
							if(!attributeName || !attributeValue) {
									continue
							}
			
							element.setAttribute(attributeName, attributeValue)
					}
			
					if(action.type === 'insertlink') {
							var elementHtml = element.outerHTML;
							var newElementHtml = document.createElement('a');
							newElementHtml.setAttribute('href', actionText)
							newElementHtml.setAttribute('target', '_blank')
							newElementHtml.innerHTML = elementHtml
							element.parentNode.replaceChild(newElementHtml, element)
					}
			}

			function inputParsing(variables, templateString) {
				var varriablesKeys = Object.keys(variables)
				var newString = templateString
				for(var key of varriablesKeys) {
					newString = newString.replaceAll('{' + key +'}', variables[key])
				}
				return newString
			}
		`

		const result = await minify(code);
		result.code && setGeneratedCode(result.code)
	}

	if(!params.length || !actions.length) {
		return null
	}

  return (
		<div className="w-full flex justify-end">
			<button type="button" onClick={handleGenerate}>Generate Script</button>
		</div>
	);
};

export default GenerateScript;
