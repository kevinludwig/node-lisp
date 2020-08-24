const chai = require('chai'),
    lisp = require('../src/lisp');
const should = chai.should();

describe('test lisp', () => {
    it('should +,-,*,/,mod', () => {
        lisp.eval(lisp.parse('(+ 1 2 3)')).should.be.eql(6);
        lisp.eval(lisp.parse('(- 3 1)')).should.be.eql(2);
        lisp.eval(lisp.parse('(- 4 1 2)')).should.be.eql(1);
        lisp.eval(lisp.parse('(- 3)')).should.be.eql(-3);
        lisp.eval(lisp.parse('(* 4 3 2)')).should.be.eql(24);
        lisp.eval(lisp.parse('(/ 4 2)')).should.be.eql(2);
        lisp.eval(lisp.parse('(mod 10 3)')).should.be.eql(1);
    });
});
