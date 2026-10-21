# menu-page-recognition Specification

## Purpose

Defines how completely and accurately the ingredients of a nutritionist menu page must be recovered from its image, so the quantities that feed the shopping list can be trusted.

## Requirements

### Requirement: Ingredients of the sample menu are recovered
The system SHALL recover, through recognition and parsing of the three sample menu pages, at least 95% of their 97 known ingredients, each with its correct name, amount and unit.

#### Scenario: Overall recovery
- **WHEN** the three sample pages are recognised and parsed
- **THEN** at least 92 of the 97 ground-truth ingredients are returned with the correct name, amount and unit

#### Scenario: Previously lost ingredients
- **WHEN** the sample pages are recognised and parsed
- **THEN** the result includes `Almendras 10 g`, `Almendras 15 g`, `Brócoli cocido 184 g`, `Aguacate 103.3 g` and `Fresas enteras 108 g`

### Requirement: Few wrong entries
The system SHALL NOT return more than 2 entries that match no known ingredient when the three sample pages are recognised and parsed.

#### Scenario: Merged columns do not create wrong names
- **WHEN** the sample pages are recognised and parsed
- **THEN** the result contains neither `Alambre de pollo 10 g` nor `Huevo revuelto con piezas 108 g`

#### Scenario: Count of wrong entries
- **WHEN** the returned entries are compared with the ground truth
- **THEN** at most 2 of them match no ground-truth ingredient
