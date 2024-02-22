export function formatErrorMessage(errorMessage: string, properties: Record<string, string>): string {
    let propString = "\n```";
    let currentKeyIndex = 1;
    for (let key in properties) {
        propString += `- ${key}: ${properties[key]}`

        if (Object.keys(properties).length !== currentKeyIndex) {
            propString += `\n`;
        }
        currentKeyIndex += 1;
    }
    propString += "```";
    return `Error: ${errorMessage} ${propString}`
}