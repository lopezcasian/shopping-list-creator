import type { IngredientEntry } from './menuParser.ts';

type Total = { normalizedName: string, item: IngredientEntry };

// Case, accents and extra whitespace do not make two names different
const normalize = (name: string) =>
    name.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/\s+/g, ' ').trim();

const compare = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);

// Adds up the amounts of the same ingredient and unit. The first spelling seen is the display name.
export function buildShoppingList(entries: IngredientEntry[]): IngredientEntry[] {
    const totals = new Map<string, Total>();
    for (const { name, amount, unit } of entries) {
        const normalizedName = normalize(name);
        const key = `${normalizedName}|${unit}`;
        const total = totals.get(key);
        if (total) total.item.amount += amount;
        else totals.set(key, { normalizedName, item: { name: name.replace(/\s+/g, ' ').trim(), amount, unit } });
    }
    return [...totals.values()]
        .sort((a, b) => compare(a.normalizedName, b.normalizedName) || compare(a.item.unit, b.item.unit))
        // round once at the end so floating point noise (47.199999) never shows
        .map(({ item }) => ({ ...item, amount: Math.round(item.amount * 10) / 10 }));
}
