var loaderUtils = require('loader-utils');
var coffee = require("coffee-script");
var esprima = require('esprima');
var CoverageInstrumentor = require('coffee-coverage/lib/coffeeCoverage').CoverageInstrumentor;

var instrumentor = new CoverageInstrumentor({
    instrumentor: 'istanbul'
});


module.exports = function(source) {
    if (this.cacheable) {
        this.cacheable();
    }

    var coffeeRequest = loaderUtils.interpolateName(this, '[path][name].[ext]', {});

    var coffeeScriptOptions = {
        filename: coffeeRequest,
        bare: true,
        sourceMap: true,
        sourceRoot: "",
        sourceFiles: [ coffeeRequest ],
        inline: true
    };

    var esprimaOptions = {
      loc: true,
      tokens: true
    };

    var instrumentedJS = instrumentor.instrumentCoffee(coffeeRequest, source);
    instrumentedJS = instrumentedJS.init + '\n\n' + instrumentedJS.js;
    var instrumentedProgram = esprima.parse(instrumentedJS, esprimaOptions);

    var compiledJS = coffee.compile(source, coffeeScriptOptions);
    var compiledProgram = esprima.parse(compiledJS.js, esprimaOptions);

    var smLines = compiledJS.sourceMap.lines;
    var instrumentedTokens = instrumentedProgram.tokens;
    var compiledTokens = compiledProgram.tokens;

    var compiledToken, instrumentedToken, smLineDef, smColumns, smCol, i, j, k, l;

    lineLoop:
    for (k = 0; k < smLines.length; k++) {
        smLineDef = smLines[k];
        smColumns = smLineDef && smLineDef.columns;

        if (!smColumns) {
            smLines.splice(k, 1);
            k--;
            continue lineLoop;
        }

        columnLoop:
        for (i = 0; i < smColumns.length; i++) {
            smCol = smColumns[i];

            if (!smCol) {
                continue columnLoop;
            }

            originalTokenLookup:
            for (j = 0, l = compiledTokens.length; j < l; j++) {
                compiledToken = compiledTokens[j];

                if (compiledToken.loc.start.line - 1 === smCol.line && compiledToken.loc.start.column === smCol.column) {
                    break originalTokenLookup;
                }

                if (j + 1 === l) {
                    smColumns[i] = null;
                    continue columnLoop;
                }
            }

            instrumentedTokenLookup:
            while (instrumentedTokens.length) {
                instrumentedToken = instrumentedTokens.shift();

                if (instrumentedToken.type === compiledToken.type && instrumentedToken.value === compiledToken.value) {
                    smCol.line = smLineDef.line = instrumentedToken.loc.start.line - 1;
                    smCol.column = instrumentedToken.loc.start.column;
                    continue columnLoop;
                }
            }
        }

        emptyColumnCleanup:
        while (smColumns.length) {
            if (!smColumns[smColumns.length - 1]) {
                smColumns.pop();
            } else {
                break emptyColumnCleanup;
            }
        }
    }

    var sourceMap = compiledJS.sourceMap.generate(coffeeScriptOptions, source);
    sourceMap = JSON.parse(sourceMap);

    this.callback(null, instrumentedJS, sourceMap);
};
