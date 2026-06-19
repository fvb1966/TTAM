TTAM - Build resources and packaging notes

This file documents the expected structure for packaging assets used by `electron-builder`.

Place application icons and resources under the `build/` folder in your local workspace (the folder is ignored by git by default).

Recommended local structure (not committed):

- `build/icons/` — place `icon.ico` (Windows) and `icon.png` (macOS, linux) variants.
- `build/extraResources/` — any extra files to bundle.

Example local file path:

  build/icons/icon.ico

Notes:
- The project already includes a `dist` npm script that runs `electron-builder`.
- Code signing is not handled here — provide certificates and signing configuration when preparing releases.
