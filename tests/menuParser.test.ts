import {parseMenu} from '../src/menuParser.ts';
import {describe, test, expect} from '@jest/globals';

describe('parseMenu - wrapped lines are joined', () => {
    test('joins an ingredient wrapped over two lines', () => {
        expect(parseMenu('Pan de masa madre 2\npiezas 70 g')).toEqual([{name: 'Pan de masa madre', amount: 70, unit: 'g'}]);
    });

    test('joins a unit separated by a blank line', () => {
        expect(parseMenu('Queso manchego 90\n\ng')).toEqual([{name: 'Queso manchego', amount: 90, unit: 'g'}]);
    });

    test('joins a wrapped line that starts with a digit', () => {
        expect(parseMenu('Tomate rojo (Jitomate)\n3 rebanadas 30 g'))
            .toEqual([{name: 'Tomate rojo (Jitomate)', amount: 30, unit: 'g'}]);
    });

    test('does not join a line that starts with a capital letter', () => {
        expect(parseMenu('Jamón de pavo 1\nLechuga ½ taza 23 g')).toEqual([{name: 'Lechuga', amount: 23, unit: 'g'}]);
    });
});

describe('parseMenu - only lines with a quantity become entries', () => {
    test('ignores headers and day names', () => {
        expect(parseMenu('Lunes\n\nDesayuno\n\nComida Media tarde')).toEqual([]);
    });

    test('ignores the date range', () => {
        expect(parseMenu('Lunes 21 de Septiembre - Domingo 27 de Septiembre')).toEqual([]);
    });

    test('ignores a recipe name that wraps onto a second line', () => {
        expect(parseMenu('Sándwich de\nJamón\nJitomate bola 50 g')).toEqual([{name: 'Jitomate bola', amount: 50, unit: 'g'}]);
    });

    test('keeps an ingredient whose name wraps before its measure', () => {
        expect(parseMenu('Atún en agua,\ndrenado 2 latas 180 ml')).toEqual([{name: 'Atún en agua, drenado', amount: 180, unit: 'ml'}]);
    });
});

describe('parseMenu - entry name and quantity', () => {
    test('drops the household measure', () => {
        expect(parseMenu('Tortilla 2 piezas 44 g')).toEqual([{name: 'Tortilla', amount: 44, unit: 'g'}]);
    });

    test('reads a decimal amount', () => {
        expect(parseMenu('Nuez 18 25.7 g')).toEqual([{name: 'Nuez', amount: 25.7, unit: 'g'}]);
    });

    test('reads millilitres', () => {
        expect(parseMenu('Aceite de canola 1 cucharadita 5 ml')).toEqual([{name: 'Aceite de canola', amount: 5, unit: 'ml'}]);
    });

    test('reads a unit written right after the number', () => {
        expect(parseMenu('Pasta cocida 1 taza 120g')).toEqual([{name: 'Pasta cocida', amount: 120, unit: 'g'}]);
    });

    test('stops the name at a fraction, including its OCR misread', () => {
        expect(parseMenu('Lechuga % taza 23 g')).toEqual([{name: 'Lechuga', amount: 23, unit: 'g'}]);
        expect(parseMenu('Zanahoria ½ taza 40 g')).toEqual([{name: 'Zanahoria', amount: 40, unit: 'g'}]);
    });

    test('reads a decimal comma', () => {
        expect(parseMenu('Aguacate 1 pieza 113,3 g')).toEqual([{name: 'Aguacate', amount: 113.3, unit: 'g'}]);
    });

    test('skips a line whose name would be empty', () => {
        expect(parseMenu('2 piezas 70 g')).toEqual([]);
    });
});

describe('parseMenu - order', () => {
    test('keeps the order of the text', () => {
        const result = parseMenu('Pan 2 piezas 70 g\nJamón 1 rebanada 21 g');
        expect(result.map(entry => entry.name)).toEqual(['Pan', 'Jamón']);
    });
});

describe('parseMenu - a realistic block of page text', () => {
    test('returns only the ingredients of two meals', () => {
        const text = [
            'Desayuno', '', 'Sándwich de', 'Jamón', 'Pan de masa madre 2', 'piezas 70 g',
            'Jamón de pavo 1', 'rebanada 21 g', 'Mayonesa 2', 'cucharaditas 12 g', '',
            'Medio día', '', 'Fresa', 'Fresas enteras 8', 'piezas 96 g',
        ].join('\n');
        expect(parseMenu(text)).toEqual([
            {name: 'Pan de masa madre', amount: 70, unit: 'g'},
            {name: 'Jamón de pavo', amount: 21, unit: 'g'},
            {name: 'Mayonesa', amount: 12, unit: 'g'},
            {name: 'Fresas enteras', amount: 96, unit: 'g'},
        ]);
    });
});
