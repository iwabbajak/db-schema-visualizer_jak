# DBML ERD Visualizer

Maintained by [@iwabbajak](https://github.com/iwabbajak). This community-maintained version is based on the original DBML ERD Visualizer by [BOCOVO](https://github.com/BOCOVO/db-schema-visualizer).

Visualize database schemas from `.dbml` files as Entity Relationship Diagrams in VS Code.

## Features

![Demo](https://github.com/BOCOVO/db-schema-visualizer/assets/51182814/a59fd0c0-246d-4f00-be39-9885d88b8b85)

- Create Entity Relationship Diagram from your dbml file
- Display field comments and table descriptions from DBML notes
- Zoom in and out with the toolbar slider or mouse wheel
- Allow you to drag diagrams
- Resize the Field, Type, and Remarks columns in the diagram to fit content
- Support both light and dark themes
- Multiple display mode. Display all columns, relational columns only or table headers only

## Extension Settings

The following Visual Studio Code settings are available for the extension.

- `dbmlERDPreviewer.preferredTheme`: This configuration define the theme to use. There are two different theme the `light` and `dark`. The default theme is `dark`.
- `dbmlERDPreviewer.scrollDirection`: This configuration define the scroll direction. There are two different scroll direction the `up-out` and `up-in`. The default scroll direction is `up-out`.

## Release Notes

### 0.8.4

- Add draggable dividers to resize the Field, Type, and Remarks columns independently
- Adjust column widths to make long field names, types, and remarks easier to read

Previous release notes are available in the [full changelog](https://github.com/iwabbajak/db-schema-visualizer_jak/blob/HEAD/packages/dbml-vs-code-extension/CHANGELOG.md).

## Update\Modification Notes (iwabbajak)

- Display field remarks and table descriptions from DBML notes
- Add a toolbar zoom slider synchronized with mouse-wheel zoom and Fit to View
- Document field remarks, table descriptions, and interactive zoom functionality
- Add resizable Field, Type, and Remarks columns for better control over long values

## Author

- Maintainer: [@iwabbajak](https://github.com/iwabbajak)
- Original project and attribution: [BOCOVO/db-schema-visualizer](https://github.com/BOCOVO/db-schema-visualizer)
