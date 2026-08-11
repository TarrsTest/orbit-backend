'use strict';

// Runtime flags, read once at start-up.

const DEFAULT_PAGE_SIZE = 20;

// Old clients still send v1 payloads.
const LEGACY_MODE = process.env.EVALKIT_LEGACY === '1';

module.exports = { DEFAULT_PAGE_SIZE, LEGACY_MODE };
