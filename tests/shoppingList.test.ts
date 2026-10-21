import {buildShoppingList} from '../src/shoppingList.ts';
import {describe, test, expect} from '@jest/globals';

describe('buildShoppingList - quantities are summed per ingredient and unit', () => {
    test('adds the same ingredient found on several pages', () => {
        const list = buildShoppingList([
            {name: 'Arroz', amount: 100, unit: 'g'},
            {name: 'Arroz', amount: 100, unit: 'g'},
            {name: 'Arroz', amount: 100, unit: 'g'},
        ]);
        expect(list).toEqual([{name: 'Arroz', amount: 300, unit: 'g'}]);
    });

    test('ignores case and accents when comparing names', () => {
        const list = buildShoppingList([
            {name: 'Brócoli cocido', amount: 184, unit: 'g'},
            {name: 'BROCOLI COCIDO', amount: 276, unit: 'g'},
        ]);
        expect(list).toEqual([{name: 'Brócoli cocido', amount: 460, unit: 'g'}]);
    });

    test('ignores surrounding and repeated whitespace when comparing names', () => {
        const list = buildShoppingList([
            {name: ' Fajita  de pollo ', amount: 250, unit: 'g'},
            {name: 'Fajita de pollo', amount: 100, unit: 'g'},
        ]);
        expect(list).toEqual([{name: 'Fajita de pollo', amount: 350, unit: 'g'}]);
    });

    test('keeps the first spelling seen as the display name', () => {
        const list = buildShoppingList([
            {name: 'Jamón de pavo', amount: 21, unit: 'g'},
            {name: 'jamon de pavo', amount: 42, unit: 'g'},
        ]);
        expect(list[0]!.name).toBe('Jamón de pavo');
    });

    test('keeps the same name with different units as separate items', () => {
        const list = buildShoppingList([
            {name: 'Atún', amount: 100, unit: 'g'},
            {name: 'Atún', amount: 180, unit: 'ml'},
        ]);
        expect(list).toEqual([
            {name: 'Atún', amount: 100, unit: 'g'},
            {name: 'Atún', amount: 180, unit: 'ml'},
        ]);
    });
});

describe('buildShoppingList - order and rounding', () => {
    test('sorts alphabetically by name, ignoring case and accents', () => {
        const list = buildShoppingList([
            {name: 'Zanahoria', amount: 40, unit: 'g'},
            {name: 'Ácido', amount: 1, unit: 'g'},
            {name: 'Mayonesa', amount: 12, unit: 'g'},
        ]);
        expect(list.map(item => item.name)).toEqual(['Ácido', 'Mayonesa', 'Zanahoria']);
    });

    test('sorts a name before longer names that start with it', () => {
        const list = buildShoppingList([
            {name: 'Pollo asado', amount: 1, unit: 'g'},
            {name: 'Pollo', amount: 1, unit: 'g'},
        ]);
        expect(list.map(item => item.name)).toEqual(['Pollo', 'Pollo asado']);
    });

    test('rounds sums to one decimal', () => {
        const list = buildShoppingList([
            {name: 'Nuez', amount: 25.7, unit: 'g'},
            {name: 'Nuez', amount: 21.4, unit: 'g'},
            {name: 'Nuez', amount: 0.1, unit: 'g'},
        ]);
        expect(list).toEqual([{name: 'Nuez', amount: 47.2, unit: 'g'}]);
    });

    test('returns an empty list when there are no entries', () => {
        expect(buildShoppingList([])).toEqual([]);
    });
});

describe('buildShoppingList - a realistic week', () => {
    test('combines entries from three pages into one list', () => {
        const page1 = [
            {name: 'Pan de masa madre', amount: 70, unit: 'g' as const},
            {name: 'Arroz', amount: 100, unit: 'g' as const},
            {name: 'Brócoli cocido', amount: 276, unit: 'g' as const},
            {name: 'Aceite de canola', amount: 5, unit: 'ml' as const},
        ];
        const page2 = [
            {name: 'Pan de masa madre', amount: 70, unit: 'g' as const},
            {name: 'Brócoli cocido', amount: 276, unit: 'g' as const},
            {name: 'Aceite de canola', amount: 5, unit: 'ml' as const},
        ];
        const page3 = [
            {name: 'Arroz blanco cocido', amount: 50, unit: 'g' as const},
            {name: 'Aceite de canola', amount: 5, unit: 'ml' as const},
        ];
        expect(buildShoppingList([...page1, ...page2, ...page3])).toEqual([
            {name: 'Aceite de canola', amount: 15, unit: 'ml'},
            {name: 'Arroz', amount: 100, unit: 'g'},
            {name: 'Arroz blanco cocido', amount: 50, unit: 'g'},
            {name: 'Brócoli cocido', amount: 552, unit: 'g'},
            {name: 'Pan de masa madre', amount: 140, unit: 'g'},
        ]);
    });
});
