import {
    uniqueNamesGenerator,
    adjectives,
    animals,
    NumberDictionary,
} from "unique-names-generator";

export function generateUsername(): string {
    const numberDictionary = NumberDictionary.generate({ min: 100, max: 999 });
    return uniqueNamesGenerator({
        dictionaries: [adjectives, animals, numberDictionary],
        separator: "-",
        length: 3,
        style: "lowerCase",
    });
}
