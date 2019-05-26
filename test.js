var Loader = require('./index');
var expect = require('chai').expect;
var fs = require('fs');

var testCoffeeSource = fs.readFileSync(__dirname + '/test.coffee', {
	encoding: 'utf-8'
});

var loader;

describe('Coffee-coverage loader', function () {
	Loader.prototype.loaders = ['coffee-coverage-loader'];
	Loader.prototype.loaderIndex = 0;

	it('should compile CoffeeScript', function (done) {
		// given
		Loader.prototype.callback = callback;

		// when
		new Loader(testCoffeeSource);

		// then
		function callback(err, js, sourcemap) {
			expect(err).to.be.null;
			expect(js).have.length(4314);
			done();
		};
	});

	it('should instrument CoffeeScript', function (done) {
		// given
		Loader.prototype.callback = callback;

		// when
		new Loader(testCoffeeSource);

		// then
		function callback(err, js, sourcemap) {
			eval(js);

			cov = global.__coverage__['file.bin']

			expect(cov.s).to.eql({
			  '1': 1,
			  '2': 2,
			  '3': 2,
			  '4': 2,
			  '5': 1,
			  '6': 1,
			  '7': 1,
			  '8': 1,
			  '9': 1,
			  '10': 1,
			  '11': 1,
			  '12': 1,
			  '13': 1,
			  '14': 1
			});

			expect(cov.f).to.eql({
			  '1': 1,
			  '2': 2,
			  '3': 2,
			  '4': 1,
			  '5': 1,
			  '6': 1,
			  '7': 1
			});

			done();
		};
	});

	it('should provide SourceMap', function (done) {
		// given
		Loader.prototype.callback = callback;

		// when
		new Loader(testCoffeeSource);

		// then
		function callback(err, js, sourcemap) {
			expect(err).to.be.null;
			expect(sourcemap).to.eql({
				file: '',
				names: [],
				mappings: ';;;;;;;;;EAAA,IAAA,MAAA,EAAA,KAAA,EAAA,KAAA,EAAA,GAAA,EAAA;;;;EAAM;IAAN,MAAA,OAAA;MACE,WAAa,KAAA;QAAC,IAAC,CAAA;;;QACb,IAAC,CAAA,MAAM;MADI;;MAGb,IAAM,CAAC,MAAD;;;eACJ,IAAC,CAAA,GAAG,CAAC,IAAL,CAAU,IAAC,CAAA,OAAO,4CAAU,OAAV,IAAlB;MADI;;IAJR;;;;;;;;;;EAOM;IAAN,MAAA,MAAA,QAAoB,OAApB;MACE,IAAM,CAAA;;;QACJ,IAAC,CAAA,GAAG,CAAC,IAAL,CAAU,eAAV;gCADF;qBAAA,IAEE,CAAM,CAAN;MAFI;;IADR;;;;;;;;;;EAKM;IAAN,MAAA,MAAA,QAAoB,OAApB;MACE,IAAM,CAAA;;;QACJ,IAAC,CAAA,GAAG,CAAC,IAAL,CAAU,cAAV;gCADF;qBAAA,IAEE,CAAM,EAAN;MAFI;;IADR;;;;;;;;;;EAKA,MAAM,IAAI,KAAJ,CAAU,kBAAV;;;;EACN,MAAM,IAAI,KAAJ,CAAU,oBAAV;;;;EAEN,GAAG,CAAC,IAAJ,CAAA;;;;EACA,GAAG,CAAC,IAAJ,CAAA',
				sourcesContent: [testCoffeeSource],
				sourceRoot: '',
				sources: ['file.bin'],
				version: 3
			});
			done();
		};
	});

});
