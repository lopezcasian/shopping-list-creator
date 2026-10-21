# shopping-list Specification

## Purpose

Defines how the ingredient entries recognised on all pages of a menu are combined into a single shopping list with summed quantities, and how the upload endpoint returns it.

## Requirements

### Requirement: Quantities are summed per ingredient and unit
The system SHALL add together the amounts of all entries that have the same ingredient name and the same unit, comparing names ignoring case, accents and surrounding or repeated whitespace.

#### Scenario: Same ingredient on several pages
- **WHEN** entries `Arroz` 100 g (page 1), `Arroz` 100 g (page 1) and `Arroz` 100 g (page 2) exist
- **THEN** the list contains one `Arroz` item of 300 g

#### Scenario: Differences in case and accents
- **WHEN** entries `Brócoli cocido` 184 g and `BROCOLI COCIDO` 276 g exist
- **THEN** the list contains one item of 460 g

#### Scenario: Display name
- **WHEN** the same ingredient is spelled `Jamón de pavo` and then `jamon de pavo`
- **THEN** the item is named `Jamón de pavo`, the first spelling seen

#### Scenario: Same name with different units
- **WHEN** entries `Atún` 100 g and `Atún` 180 ml exist
- **THEN** the list contains two separate items

### Requirement: Order and rounding of the list
The system SHALL sort the list alphabetically by name, ignoring case and accents, and SHALL round each summed amount to one decimal.

#### Scenario: Alphabetical order
- **WHEN** the items are `Zanahoria`, `Ácido` and `Mayonesa`
- **THEN** they are listed as `Ácido`, `Mayonesa`, `Zanahoria`

#### Scenario: Decimal amounts
- **WHEN** entries `Nuez` 25.7 g, 21.4 g and 0.1 g exist
- **THEN** the item amount is 47.2

#### Scenario: No entries
- **WHEN** there are no entries
- **THEN** the list is empty

### Requirement: Upload returns one combined list
`POST /upload` SHALL respond with a JSON array of items, each with `name`, `amount` and `unit`, built from the entries of every page of every uploaded file.

#### Scenario: Three pages of one menu
- **WHEN** a PDF with three pages is uploaded
- **THEN** the response is one list whose amounts add up the entries of all three pages

#### Scenario: Two files
- **WHEN** two menu PDFs are uploaded
- **THEN** the response is one list that also adds up the entries of the second file

#### Scenario: Response format
- **WHEN** an upload succeeds
- **THEN** the response body is JSON, not the text `Files uploaded successfully`
