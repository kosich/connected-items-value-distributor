const _ = require('lodash/fp');

// HELPERS
const summ = _.compose(
    _.sum, _.map('value')
);

const not = x => !x;

const redistribute = (target, controls)=>{
    const isEnabled = _.compose(_.map('enabled'));

    const filtered = _.compose(_.filter(isEnabled), _.without([target]))

    const diff = _.compose(
        x=>100-x, summ
    );

    return distribute(diff(controls), filtered(controls));
}

const distribute = (value, controls) => {
    const sign = Math.sign(value);
    const absValue = Math.abs(value);
    const distribution = Math.floor(absValue/controls.length);
    const leftover = absValue%controls.length;
    const updated = controls.map(x=>({
        name:x.name,
        value:x.value+distribution*sign,
        enabled:x.enabled
    }));
    _.last(updated).value += leftover*sign;
    const overdrafted    = updated.filter(x=>x.value < 0);
    const overdraftValue = summ(overdrafted);
    if (overdraftValue==0) return updated;
    const zero = overdrafted.map(x=>({
        name:x.name,
        value:0,
        enabled:x.enabled
    }));
    const pending = distribute(overdraftValue, updated.filter(x=>x.value>0));
    return _.unionBy(x=>x.name)(pending, zero, updated)
}

module.exports = { redistribute, summ };
