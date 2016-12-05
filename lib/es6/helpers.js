'use srtrict';
const Promise = require('bluebird');
const errors = require('./errors');

exports.asChainable = asChainable;

function asChainable(func) {
    return function () {
        const errs = [];
        return Promise.map(arguments, (arg, idx) => {
            return Promise.resolve(arg)
            .catch(err => { 
                errs.push(err);
                return null;
            });
        })
        .then(args => {
            if (errs.length) {
                throw new errors.AFChainedError(errs);
            }
            return func.apply(null, args);
        });
    };
}