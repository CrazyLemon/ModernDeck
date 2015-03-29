#!/usr/bin/env node
var manifest = require("../source/manifest.json");
process.stdout.write(manifest.version);
