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
			expect(js).have.length(4411);
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

			expect(js.match(/_\$coffeeIstanbul\[\"\"\]\.s/g).length).to.equal(15);
			expect(global._$coffeeIstanbul[''].s).to.eql({
			  '1': 1,
			  '2': 2,
			  '3': 2,
			  '4': 2,
			  '5': 2,
			  '6': 1,
			  '7': 1,
			  '8': 1,
			  '9': 1,
			  '10': 1,
			  '11': 1,
			  '12': 1,
			  '13': 1,
			  '14': 1,
			  '15': 1
			});

			expect(js.match(/_\$coffeeIstanbul\[\"\"\]\.f/g).length).to.equal(7);
			expect(global._$coffeeIstanbul[''].f).to.eql({
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
				mappings: ';;;;;;;;;EAAA,IAAA,MAAA;IAAA;;;;;EAAM,UACS;;;oBAAC,IAAD;MAAC,IAAC,CAAA,OAAD;;;MACb,IAAC,CAAA,MAAM;IADK;;qBAGb,OAAM,SAAC,MAAD;;;aACJ,IAAC,CAAA,GAAG,CAAC,IAAL,CAAU,IAAC,CAAA,OAAO,8BAAA,0CAAU,UAAO,IAAjB,CAAlB;IADI;;;;;;;;EAGF;;;;;;;;;oBACJ,OAAM,SAAA;;;MACJ,IAAC,CAAA,GAAG,CAAC,IAAL,CAAU,eAAV;;aACA,gCAAM,CAAN;IAFI;;;;KADY;;;;EAKd;;;;;;;;;oBACJ,OAAM,SAAA;;;MACJ,IAAC,CAAA,GAAG,CAAC,IAAL,CAAU,cAAV;;aACA,gCAAM,EAAN;IAFI;;;;KADY;;;;EAKpB,MAAU,IAAA,KAAA,CAAM,kBAAN;;;;EACV,MAAU,IAAA,KAAA,CAAM,oBAAN;;;;EAEV,GAAG,CAAC,IAAJ,CAAA;;;;EACA,GAAG,CAAC,IAAJ,CAAA',
				sourcesContent: [ testCoffeeSource ],
				sourceRoot: '',
				sources: [''],
				version: 3
			});
			done();
		};
	});

});
