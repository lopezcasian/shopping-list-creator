# ocr-text-cleanup Specification

## Purpose

Defines how raw OCR lines from a nutritionist menu page are cleaned of day-of-week and meal-name header words so that only ingredient content remains.

## Requirements

### Requirement: Header words are removed wherever they appear in a line
The system SHALL remove every day-of-week and meal-name header word or phrase from each OCR line, matching case-insensitively and as whole words, regardless of how many occur in the same line or where.

#### Scenario: Line made only of several header words
- **WHEN** a line is `Lunes Martes Miércoles`
- **THEN** the line is removed from the output

#### Scenario: Multi-word phrase header
- **WHEN** a line is `Desayuno Medio Día Cena`
- **THEN** the line is removed from the output

#### Scenario: Header words mixed with content
- **WHEN** a line is `Lunes 200g pollo Cena`
- **THEN** the output contains the line `200g pollo`

#### Scenario: Case-insensitive match
- **WHEN** a line is `DESAYUNO`
- **THEN** the line is removed from the output

#### Scenario: Word contained inside a longer word
- **WHEN** a line is `Cenado de verduras`
- **THEN** the line is kept unchanged

### Requirement: Cleaned output contains no blank lines
The system SHALL trim every output line and omit lines that are empty, before or after header-word removal.

#### Scenario: Whitespace-only line
- **WHEN** an input line contains only spaces
- **THEN** it is not present in the output

#### Scenario: Extra spaces left after removal
- **WHEN** a line is `Comida   arroz   Cena`
- **THEN** the output contains `arroz`

### Requirement: Leading title lines are dropped after cleaning
The system SHALL drop the first two lines of the cleaned output when it has more than two lines, and SHALL otherwise return the cleaned lines unchanged.

#### Scenario: More than two lines remain
- **WHEN** cleaning leaves lines `A`, `B`, `C`
- **THEN** the output is `C`

#### Scenario: Two or fewer lines remain
- **WHEN** cleaning leaves lines `A`, `B`
- **THEN** the output is `A`, `B`
