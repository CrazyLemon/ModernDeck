#!/usr/bin/env node
var fs = require("fs"),
	path = require("path"),

	colors = require("colors"),
	pleeease = require("pleeease"),
	mkdirp = require("mkdirp");

const SOURCE_DIR = path.join(__dirname, "../source");
const STAGE_DIR = path.join(__dirname, "../stage");

try {
	var css = pleeease.process("", {
		in: path.join(SOURCE_DIR, "sources/scss/enhancer.scss"),

		sass: {
			imagePath: "../imgs",

			outputStyle: "nested",
			sourceMap: true, // TODO: disable in release builds
		},

		minifier: false, // TODO: enable in release builds

		browsers: [
			"last 2 versions" // last two major releases of each browser
		]
	});

	var outputFile = path.join(STAGE_DIR, "sources/css/enhancer.css");

	mkdirp(path.dirname(outputFile), function(error) {
		if (error) {
			console.error("Creating output directory failed".red);
			console.error(outputFile.yellow);
			throw error;
		} else {
			fs.writeFile(outputFile, css, "utf8", function(writeError) {
				if (writeError) {
					console.error("Writing css failed".red);
					throw writeError;
				} else {
					console.log("CSS compiled successfully".green);
				}
			});
		}
	});
} catch (error) {
	console.error("CSS compilation failed".red);
	throw error;
}
