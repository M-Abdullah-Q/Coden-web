export class FullBoilerplateGenerator {
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

    // C++ to Java type mapping
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

    // C++ to JavaScript type mapping
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

    // C++ to Python type mapping
    mapCppToPython(type: string): string {
        if (type.startsWith("std::vector")) return "list";
        const typeMap: { [key: string]: string } = {
            "int": "int",
            "long": "int",
            "double": "float",
            "float": "float",
            "bool": "bool",
            "std::string": "str",
        };
        return typeMap[type] || "Any";
    }

    // Converts title to camelCase
    toCamelCase(text: string): string {
        return text
            .replace(/^[A-Z]\./, "") // Remove numbering like "A. "
            .replace(/[^a-zA-Z0-9]/g, " ") // Remove special chars
            .split(" ")
            .map((word, index) => (index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1)))
            .join("");
    }

    generateCpp(): string {
        const inputReads = this.inputFields
            .map(field => field.type.startsWith("std::vector")
                ? `int size_${field.name}; std::cin >> size_${field.name}; ${field.type} ${field.name}(size_${field.name}); for(int i = 0; i < size_${field.name}; i++) std::cin >> ${field.name}[i];`
                : `std::cin >> ${field.name};`
            ).join("\n  ");

        const functionCall = `${this.outputFields[0].type} result = ${this.title}(${this.inputFields.map(f => f.name).join(", ")});`;
        const outputWrite = `std::cout << result << std::endl;`;

        return `
#include <bits/stdc++.h>
#include <iostream>
#include <vector>
#include <string>

##USER_CODE_HERE##

int main() {
    int T;
    std::cin >> T;
    while (T--) {
        ${inputReads}
        ${functionCall}
        ${outputWrite}
    }
    return 0;
}
        `;
    }

    generateJava(): string {
        const inputReads = this.inputFields
            .map(field => field.type.startsWith("std::vector")
                ? `int size_${field.name} = sc.nextInt(); ArrayList<${this.mapCppToJava(field.type.replace("std::vector<", "").replace(">", ""))}> ${field.name} = new ArrayList<>(); for (int i = 0; i < size_${field.name}; i++) ${field.name}.add(sc.next${this.mapJavaScannerMethod(field.type)}());`
                : `${this.mapCppToJava(field.type)} ${field.name} = sc.next${this.mapJavaScannerMethod(field.type)}();`
            ).join("\n  ");

        const functionCall = `${this.mapCppToJava(this.outputFields[0].type)} result = ${this.title}(${this.inputFields.map(f => f.name).join(", ")});`;
        const outputWrite = `System.out.println(result);`;

        return `
import java.util.*;

public class Main {
    ##USER_CODE_HERE##

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int T = sc.nextInt();
        while (T--) {
            ${inputReads}
            ${functionCall}
            ${outputWrite}
        }
    }
}
        `;
    }

    generateJs(): string {
        const inputReads = this.inputFields
            .map(field => field.type.startsWith("std::vector")
                ? `const size_${field.name} = parseInt(input.shift()); const ${field.name} = input.splice(0, size_${field.name}).map(Number);`
                : `const ${field.name} = parseInt(input.shift());`
            ).join("\n  ");

        const functionCall = `const result = ${this.title}(${this.inputFields.map(f => f.name).join(", ")});`;
        const outputWrite = `console.log(result);`;

        return `
##USER_CODE_HERE##

const input = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\\n').join(' ').split(' ');
let T = parseInt(input.shift());
while (T--) {
    ${inputReads}
    ${functionCall}
    ${outputWrite}
}
        `;
    }

    generatePython(): string {
        const inputReads = this.inputFields
            .map(field => field.type.startsWith("std::vector")
                ? `size_${field.name} = int(input())\n${field.name} = list(map(int, input().split()))`
                : `${field.name} = ${this.mapPythonInputType(field.type)}(input())`
            ).join("\n  ");

        const functionCall = `result = ${this.title}(${this.inputFields.map(f => f.name).join(", ")})`;
        const outputWrite = `print(result)`;

        return `
##USER_CODE_HERE##

if __name__ == "__main__":
    T = int(input())
    for _ in range(T):
        ${inputReads}
        ${functionCall}
        ${outputWrite}
        `;
    }

    mapJavaScannerMethod(type: string): string {
        const typeMap: { [key: string]: string } = {
            "int": "Int",
            "long": "Long",
            "double": "Double",
            "float": "Float",
            "boolean": "Boolean",
            "std::string": "Line",
        };
        return typeMap[type] || "Int";
    }

    mapPythonInputType(type: string): string {
        return this.mapCppToPython(type);
    }
}
