# menu-text-parsing Specification

## Purpose

Defines how the OCR text of a nutritionist menu page is turned into ingredient entries, each with a name, an amount and a unit, ignoring headers and recipe names.

## Requirements

### Requirement: Wrapped lines are joined
The system SHALL ignore blank lines and SHALL join a line that starts with a lowercase letter or a digit onto the previous line.

#### Scenario: Ingredient wrapped over two lines
- **WHEN** the text has the lines `Pan de masa madre 2` and `piezas 70 g`
- **THEN** they are read as the single line `Pan de masa madre 2 piezas 70 g`

#### Scenario: Unit separated by a blank line
- **WHEN** the text has the lines `Queso manchego 90`, an empty line, and `g`
- **THEN** they are read as the single line `Queso manchego 90 g`

#### Scenario: Wrapped line starting with a digit
- **WHEN** the text has the lines `Tomate rojo (Jitomate)` and `3 rebanadas 30 g`
- **THEN** they are read as the single line `Tomate rojo (Jitomate) 3 rebanadas 30 g`

#### Scenario: Line starting with a capital letter
- **WHEN** a line starts with a capital letter
- **THEN** it starts a new line and is not joined to the previous one

### Requirement: Only lines with a quantity become entries
The system SHALL return an entry only for a line that contains a quantity, a number followed by `g` or `ml`, and SHALL return nothing for headers, day names, the date range and recipe names.

#### Scenario: Headers and day names
- **WHEN** the text has the lines `Lunes`, `Desayuno` and `Comida Media tarde`
- **THEN** no entry is returned

#### Scenario: Date range
- **WHEN** the text has the line `Lunes 21 de Septiembre - Domingo 27 de Septiembre`
- **THEN** no entry is returned

#### Scenario: Recipe name followed by its ingredients
- **WHEN** the text has the lines `Sándwich de`, `Jamón` and `Jitomate bola 50 g`
- **THEN** the only entry returned is `Jitomate bola`

#### Scenario: Ingredient name that wraps
- **WHEN** the text has the lines `Atún en agua,` and `drenado 2 latas 180 ml`
- **THEN** the entry returned has the name `Atún en agua, drenado`

### Requirement: Entry name and quantity
The system SHALL return for each entry the name, made of the words before the household measure, and the amount and unit (`g` or `ml`) of the quantity, with the household measure left out.

#### Scenario: Household measure dropped
- **WHEN** a line is `Tortilla 2 piezas 44 g`
- **THEN** the entry is name `Tortilla`, amount 44, unit `g`

#### Scenario: Decimal amount
- **WHEN** a line is `Nuez 18 25.7 g`
- **THEN** the entry is name `Nuez`, amount 25.7, unit `g`

#### Scenario: Millilitres
- **WHEN** a line is `Aceite de canola 1 cucharadita 5 ml`
- **THEN** the entry is name `Aceite de canola`, amount 5, unit `ml`

#### Scenario: Unit written right after the number
- **WHEN** a line is `Pasta cocida 1 taza 120g`
- **THEN** the entry is name `Pasta cocida`, amount 120, unit `g`

#### Scenario: Fraction measure, including its OCR misread
- **WHEN** a line is `Lechuga % taza 23 g`
- **THEN** the entry is name `Lechuga`, amount 23, unit `g`

### Requirement: Entries keep the text order
The system SHALL return the entries in the order their lines appear in the text.

#### Scenario: Two ingredients
- **WHEN** the text has the lines `Pan 2 piezas 70 g` and `Jamón 1 rebanada 21 g`
- **THEN** `Pan` is returned before `Jamón`
