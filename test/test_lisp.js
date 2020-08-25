const chai = require('chai'),
    lisp = require('../src/lisp');
const should = chai.should();

describe('test lisp', () => {
    it('should support basic math ops', () => {
        lisp.eval(lisp.parse('(+ 1 2 3)')).should.be.eql(6);
        lisp.eval(lisp.parse('(- 3 1)')).should.be.eql(2);
        lisp.eval(lisp.parse('(- 4 1 2)')).should.be.eql(1);
        lisp.eval(lisp.parse('(- 3)')).should.be.eql(-3);
        lisp.eval(lisp.parse('(* 4 3 2)')).should.be.eql(24);
        lisp.eval(lisp.parse('(/ 4 2)')).should.be.eql(2);
        lisp.eval(lisp.parse('(mod 10 3)')).should.be.eql(1);
    });

    it('should support math fns', () => {
        lisp.eval(lisp.parse('(abs -4)')).should.be.eql(4);
        lisp.eval(lisp.parse('(sqrt 9)')).should.be.eql(3);
        lisp.eval(lisp.parse('(round 3.5)')).should.be.eql(4);
        lisp.eval(lisp.parse('(ceil 3.4)')).should.be.eql(4);
        lisp.eval(lisp.parse('(floor 3.6)')).should.be.eql(3);
        lisp.eval(lisp.parse('(cos 0)')).should.be.eql(1);
    });

    it('should support comparison operators', () => {
        lisp.eval(lisp.parse('(= 1 1)')).should.be.eql(true);
        lisp.eval(lisp.parse('(= 1 2)')).should.be.eql(false);
        lisp.eval(lisp.parse('(> 3 1)')).should.be.eql(true);
        lisp.eval(lisp.parse('(< 3 1)')).should.be.eql(false);
        lisp.eval(lisp.parse('(>= 0 0)')).should.be.eql(true);
        lisp.eval(lisp.parse('(<= 3 3)')).should.be.eql(true);
    });

    it('should support "apply" special form', () => {
        lisp.eval(lisp.parse('(= (+ 1 2 3 4 5) (apply + (quote 1 2 3 4 5)))')).should.be.eql(true);
    });

    it('should support "quote" special form', () => {
        lisp.eval(lisp.parse('(quote 1 2 3 4 5)')).should.be.eql([1, 2, 3, 4, 5]);
    });

    it('should support list ops', () => {
        lisp.eval(lisp.parse('(list 1 2 3)')).should.be.eql([1, 2, 3]);
        lisp.eval(lisp.parse('(first (list 1 2 3))')).should.be.eql(1);
        lisp.eval(lisp.parse('(rest (list 1 2 3))')).should.be.eql([2, 3]);
        lisp.eval(lisp.parse('(cons 0 (list 1 2 3))')).should.be.eql([0, 1, 2, 3]);
    });

    it('should support "if" special form', () => {
        lisp.eval(lisp.parse('(if (> 1 0) 2 3)')).should.be.eql(2);
        lisp.eval(lisp.parse('(if (< 1 0) 2 3)')).should.be.eql(3);
    });

    it('should support do, def, and set!', () => {
        lisp.eval(lisp.parse('(do (def x 1) (set! x 2) x)')).should.be.eql(2);
    });

    it('should support "fn" special form', () => {
        lisp.eval(lisp.parse('(do (def add2 (fn (x) (+ 2 x))) (add2 5))')).should.be.eql(7);
    });

    it('should support type checks', () => {
        lisp.eval(lisp.parse('(list? (list 1 2 3))')).should.be.eql(true);
        lisp.eval(lisp.parse('(list? (quote 1 2 3))')).should.be.eql(true);
        lisp.eval(lisp.parse('(list? 1)')).should.be.eql(false);
        lisp.eval(lisp.parse('(number? 1)')).should.be.eql(true);
        lisp.eval(lisp.parse('(number? 1.023)')).should.be.eql(true);
        lisp.eval(lisp.parse('(number? (quote 1))')).should.be.eql(false);
        lisp.eval(lisp.parse('(fn? (fn (x) (+ 1 x)))')).should.be.eql(true);
        lisp.eval(lisp.parse('(fn? map)')).should.be.eql(true);
        lisp.eval(lisp.parse('(fn? (list 1 2 3))')).should.be.eql(false);
        lisp.eval(lisp.parse('(do (def x 1) (symbol? x))')).should.be.eql(true);
        lisp.eval(lisp.parse('(symbol? (list 1 2))')).should.be.eql(false);
    });

    it('should map and filter', () => {
        lisp.eval(lisp.parse('(map (fn (x) (* 2)) (list 1 2 3 4))')).should.be.eql([2, 4, 6, 8]);
        lisp.eval(lisp.parse('(filter (fn (x) (> x 4)) (list 2 4 6 8))')).should.be.eql([6, 8]);
    });
});
