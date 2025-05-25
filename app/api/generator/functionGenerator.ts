export class FunctionGenerator {
    title: string = "";
    inputFields: { type: string; name: string }[] = [];
    outputFields: { type: string; name: string }[] = [];

    constructor(title: string, inputs: { type: string; name: string }[], outputs: { type: string; name: string }[]) {
        this.title = this.toCamelCase(title);
        this.inputFields = inputs.map(field => ({
            type: field.type,
            name: this.toCamelCase(field.name)
        }));
        this.outputFields = outputs.map(field => ({
            type: field.type,
            name: this.toCamelCase(field.name)
        }));
    }

    /** Converts C++ types to Java */
    mapCppToJava(type: string): string {
        if (type.startsWith("vector")) return `ArrayList<${this.mapCppToJava(type.replace("vector<", "").replace(">", ""))}>`;
        const typeMap: { [key: string]: string } = {
            "int": "int",
            "long": "long",
            "double": "double",
            "float": "float",
            "bool": "boolean",
            "string": "String",
        };
        return typeMap[type] || "Object";
    }

    /** Converts C++ types to JavaScript */
    mapCppToJs(type: string): string {
        if (type.startsWith("vector")) return "Array";
        const typeMap: { [key: string]: string } = {
            "int": "number",
            "long": "number",
            "double": "number",
            "float": "number",
            "bool": "boolean",
            "string": "string",
        };
        return typeMap[type] || "any";
    }

    /** Converts C++ types to Python */
    mapCppToPython(type: string): string {
        if (type.startsWith("vector")) return "list";
        const typeMap: { [key: string]: string } = {
            "int": "int",
            "long": "int",
            "double": "float",
            "float": "float",
            "bool": "bool",
            "string": "str",
        };
        return typeMap[type] || "Any";
    }

    /** Converts a title to camelCase */
    toCamelCase(text: string): string {
        return text
            .replace(/^[A-Z]\./, "") // Remove numbering like "A. "
            .replace(/[^a-zA-Z0-9]/g, " ") // Remove special chars
            .split(" ")
            .map((word, index) => (index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1)))
            .join("");
    }

    generateCpp(): string {
        const params = this.inputFields.map(field => `${field.type} ${field.name}`).join(", ");
        const returnType = this.outputFields[0]?.type || "void";

        return `
${returnType} ${this.title}(${params}) {
}
        `;
    }

    generateJava(): string {
        const params = this.inputFields.map(field => `${this.mapCppToJava(field.type)} ${field.name}`).join(", ");
        const returnType = this.mapCppToJava(this.outputFields[0]?.type || "void");

        return `
public static ${returnType} ${this.title}(${params}) {
}
        `;
    }

    generateJs(): string {
        const params = this.inputFields.map(field => field.name).join(", ");

        return `
function ${this.title}(${params}) {
}
        `;
    }

    generatePython(): string {
        const params = this.inputFields.map(field => field.name).join(", ");

        return `
def ${this.title}(${params}):
    pass
        `;
    }
}
