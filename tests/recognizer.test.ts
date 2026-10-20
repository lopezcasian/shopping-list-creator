import {cleanLines} from '../src/recognizer.ts';
import {describe, test, expect} from '@jest/globals';

describe('cleanLines', () => {
    test('removes a line made of several header words', () => {
        expect(cleanLines('x\ny\nz\nLunes Martes Miércoles')).toEqual(['z']);
    });

    test('removes multi-word phrase headers', () => {
        expect(cleanLines('x\ny\nz\nDesayuno Medio Día Cena')).toEqual(['z']);
        expect(cleanLines('x\ny\nz\nMedia Tarde')).toEqual(['z']);
    });

    test('keeps content when header words are mixed in the line', () => {
        expect(cleanLines('x\ny\nLunes 200g pollo Cena')).toEqual(['200g pollo']);
    });

    test('matches case-insensitively', () => {
        expect(cleanLines('x\ny\nz\nDESAYUNO')).toEqual(['z']);
        expect(cleanLines('x\ny\nMiÉrcoles 50g pan')).toEqual(['50g pan']);
    });

    test('keeps lines where a header word is only part of a longer word', () => {
        expect(cleanLines('x\ny\nCenado de verduras')).toEqual(['Cenado de verduras']);
    });

    test('omits blank and whitespace-only lines', () => {
        expect(cleanLines('x\n\n   \ny\nleche')).toEqual(['leche']);
    });

    test('collapses extra spaces left after removal', () => {
        expect(cleanLines('x\ny\nComida   arroz   Cena')).toEqual(['arroz']);
    });

    test('drops the first two lines only when more than two remain', () => {
        expect(cleanLines('A\nB\nC')).toEqual(['C']);
        expect(cleanLines('A\nB')).toEqual(['A', 'B']);
    });
});
