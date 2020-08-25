const chai = require('chai'),
    {read} = require('../src/reader'),
    evaluate = require('../src/evaluate');
const should = chai.should();

describe('test lisp', () => {
    it('should support basic math ops', () => {
        evaluate(read('(+ 1 2 3)')).should.be.eql(6);
        evaluate(read('(- 3 1)')).should.be.eql(2);
        evaluate(read('(- 4 1 2)')).should.be.eql(1);
        evaluate(read('(- 3)')).should.be.eql(-3);
        evaluate(read('(* 4 3 2)')).should.be.eql(24);
        evaluate(read('(/ 4 2)')).should.be.eql(2);
        evaluate(read('(mod 10 3)')).should.be.eql(1);
    });

    it('should support math fns', () => {
        evaluate(read('(abs -4)')).should.be.eql(4);
        evaluate(read('(sqrt 9)')).should.be.eql(3);
        evaluate(read('(round 3.5)')).should.be.eql(4);
        evaluate(read('(ceil 3.4)')).should.be.eql(4);
        evaluate(read('(floor 3.6)')).should.be.eql(3);
        evaluate(read('(cos 0)')).should.be.eql(1);
    });

    it('should support comparison operators', () => {
        evaluate(read('(= 1 1)')).should.be.eql(true);
        evaluate(read('(= 1 2)')).should.be.eql(false);
        evaluate(read('(> 3 1)')).should.be.eql(true);
        evaluate(read('(< 3 1)')).should.be.eql(false);
        evaluate(read('(>= 0 0)')).should.be.eql(true);
        evaluate(read('(<= 3 3)')).should.be.eql(true);
    });

    it('should support "apply" special form', () => {
        evaluate(read('(= (+ 1 2 3 4 5) (apply + (quote 1 2 3 4 5)))')).should.be.eql(true);
    });

    it('should support "quote" special form', () => {
        evaluate(read('(quote 1 2 3 4 5)')).should.be.eql([1, 2, 3, 4, 5]);
    });

    it('should support list ops', () => {
        evaluate(read('(list 1 2 3)')).should.be.eql([1, 2, 3]);
        evaluate(read('(first (list 1 2 3))')).should.be.eql(1);
        evaluate(read('(rest (list 1 2 3))')).should.be.eql([2, 3]);
        evaluate(read('(cons 0 (list 1 2 3))')).should.be.eql([0, 1, 2, 3]);
    });

    it('should support "if" special form', () => {
        evaluate(read('(if (> 1 0) 2 3)')).should.be.eql(2);
        evaluate(read('(if (< 1 0) 2 3)')).should.be.eql(3);
    });

    it('should support do, def, and set!', () => {
        evaluate(read('(do (def x 1) (set! x 2) x)')).should.be.eql(2);
    });

    it('should support "fn" special form', () => {
        evaluate(read('(do (def add2 (fn (x) (+ 2 x))) (add2 5))')).should.be.eql(7);
    });

    it('should support string types and boolean literals', () => {
        evaluate(read('(if true "awesome" "nuts")')).should.be.eql('awesome');
    });

    it('should support type checks', () => {
        evaluate(read('(list? (list 1 2 3))')).should.be.eql(true);
        evaluate(read('(list? (quote 1 2 3))')).should.be.eql(true);
        evaluate(read('(list? 1)')).should.be.eql(false);
        evaluate(read('(number? 1)')).should.be.eql(true);
        evaluate(read('(number? 1.023)')).should.be.eql(true);
        evaluate(read('(number? (quote 1))')).should.be.eql(false);
        evaluate(read('(string? "test")')).should.be.eql(true);
        evaluate(read('(string? 1)')).should.be.eql(false);
        evaluate(read('(boolean? true)')).should.be.eql(true);
        evaluate(read('(boolean? "true")')).should.be.eql(false);
        evaluate(read('(fn? (fn (x) (+ 1 x)))')).should.be.eql(true);
        evaluate(read('(fn? map)')).should.be.eql(true);
        evaluate(read('(fn? (list 1 2 3))')).should.be.eql(false);
        evaluate(read('(do (def x 1) (symbol? x))')).should.be.eql(true);
        evaluate(read('(symbol? (list 1 2))')).should.be.eql(false);
    });

    it('should map and filter', () => {
        evaluate(read('(map (fn (x) (* 2)) (list 1 2 3 4))')).should.be.eql([2, 4, 6, 8]);
        evaluate(read('(filter (fn (x) (> x 4)) (list 2 4 6 8))')).should.be.eql([6, 8]);
    });
});
