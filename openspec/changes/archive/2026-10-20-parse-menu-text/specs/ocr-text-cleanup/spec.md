# Spec Delta

## REMOVED Requirements

### Requirement: Header words are removed wherever they appear in a line
**Reason**: The header-word filter no longer exists in the code; headers are now ignored because they contain no quantity.
**Migration**: Use the `menu-text-parsing` capability.

### Requirement: Cleaned output contains no blank lines
**Reason**: The line-cleanup function no longer exists; blank lines are ignored by the menu text parser.
**Migration**: Use the `menu-text-parsing` capability.

### Requirement: Leading title lines are dropped after cleaning
**Reason**: Page titles are ignored because they contain no quantity.
**Migration**: Use the `menu-text-parsing` capability.
