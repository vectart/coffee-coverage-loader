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
				mappings: ';;;;;;;;;EAAA,IAAA,MAAA,VAAA,FAAM,EACS,gBAAC,IAAD,lBAAC,IAAC,CAAA,OAAD,ZACZ,IAAC,CAAA,MAAM,bADI;mBAGb,OAAM,SAAC,MAAD;WACJ,IAAC,CAAA,GAAG,CAAC,IAAL,CAAU,IAAC,CAAA,OAAO,CAAA,YAAU,SAAO,IAAjB,CAAlB;EADI;;;;;;AAGF;;;;;;;kBACJ,OAAM,SAAA;IACJ,IAAC,CAAA,GAAG,CAAC,IAAL,CAAU,eAAV;WACA,gCAAM,CAAN;EAFI;;;;GADY;;AAKd;;;;;;;kBACJ,OAAM,SAAA;IACJ,IAAC,CAAA,GAAG,CAAC,IAAL,CAAU,cAAV;WACA,gCAAM,EAAN;EAFI;;;;GADY;;AAKpB,MAAM,IAAI,KAAJ,CAAU,kBAAV;;AACN,MAAM,IAAI,KAAJ,CAAU,oBAAV;;AAEN,GAAG,CAAC,IAAJ,CAAA;;AACA,GAAG,CAAC,IAAJ,CAAA',
				sourcesContent: ["class Animal\n  constructor: (@name) ->\n    @log = []\n\n  move: (meters) ->\n    @log.push @name + \" moved #{meters}m.\"\n\nclass Snake extends Animal\n  move: ->\n    @log.push \"Slithering...\"\n    super 5\n\nclass Horse extends Animal\n  move: ->\n    @log.push \"Galloping...\"\n    super 45\n\nsam = new Snake \"Sammy the Python\"\ntom = new Horse \"Tommy the Palomino\"\n\nsam.move()\ntom.move()\n"],
				sourceRoot: '',
				sources: ['file.bin'],
				version: 3
			});
			done();
		};
	});

});
