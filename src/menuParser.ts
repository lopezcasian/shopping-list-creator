export type IngredientEntry = { name: string, amount: number, unit: 'g' | 'ml' };

// A quantity is a number followed by a unit: "44 g", "5 ml", "120g"
const quantityRegex = /(\d+(?:[.,]\d+)?)\s*(g|ml)\b/i;
// A word that starts the household measure ("2 piezas", "½ taza"); "%" is how OCR often reads "½"
const measureStartRegex = /^[\d½¼¾⅓⅔%]/;
// A line starting with a lowercase letter or a digit continues the previous line
const continuationRegex = /^(\p{Ll}|\d)/u;

// Step 1: one entry per line. Drops blank lines and glues wrapped lines back together.
function joinWrappedLines(text: string): string[] {
    const lines: string[] = [];
    for (const line of text.split('\n').map(line => line.trim()).filter(line => line.length > 0)) {
        if (lines.length > 0 && continuationRegex.test(line)) lines[lines.length - 1] += ` ${line}`;
        else lines.push(line);
    }
    return lines;
}

// Step 3: "Tortilla 2 piezas 44 g" -> { name: 'Tortilla', amount: 44, unit: 'g' }
function toIngredientEntry(line: string, quantity: RegExpExecArray): IngredientEntry | undefined {
    const words = line.slice(0, quantity.index).trim().split(/\s+/);
    const measureAt = words.findIndex(word => measureStartRegex.test(word));
    const name = (measureAt === -1 ? words : words.slice(0, measureAt)).join(' ');
    if (name.length === 0) return undefined;
    return { name, amount: Number(quantity[1]!.replace(',', '.')), unit: quantity[2]!.toLowerCase() as 'g' | 'ml' };
}

// Turns the text of a menu page into ingredients and quantities.
export function parseMenu(text: string): IngredientEntry[] {
    const entries: IngredientEntry[] = [];
    for (const line of joinWrappedLines(text)) {
        // Step 2: headers, day names, the date and recipe names have no quantity, so they are skipped
        const quantity = quantityRegex.exec(line);
        const entry = quantity && toIngredientEntry(line, quantity);
        if (entry) entries.push(entry);
    }
    return entries;
}
