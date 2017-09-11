const { expect } = require('chai');
const _ = require('lodash/fp');
const { summ, redistribute } = require('./index');


describe('La distribucion', function(){
    let controls;

    beforeEach(()=>{
        controls =
            // consider we have the target ctrl with other controls
            [ { name: 'ctrl1', value: 15, enabled: true  }
            , { name: 'ctrl2', value: 22, enabled: false }
            , { name: 'ctrl3', value: 40, enabled: true  }
            , { name: 'ctrl4', value: 7,  enabled: true  }
            , { name: 'ctrl5', value: 16, enabled: true  }
            ]
    })

    it('should initially be 100 in summ', ()=>{
        let initalSumm = summ(controls);
        expect(initalSumm).to.equal(100);
    })

    describe('Simple', function(){
        it('should add 1', ()=>{
            const target = controls[0];
            target.value+=1;
            const patch = redistribute(target, controls);
            expect(summ(patch)).to.equal(100 - target.value);
        })

        it('should add 10', ()=>{
            const target = controls[0];
            target.value+=10;
            const patch = redistribute(target, controls);
            expect(summ(patch)).to.equal(100 - target.value);
        })

        it('should sub 1', ()=>{
            const target = controls[0];
            target.value-=1;
            const patch = redistribute(target, controls);
            expect(summ(patch)).to.equal(100 - target.value);
        })

        it('should sub 10', ()=>{
            const target = controls[0];
            target.value-=10;
            const patch = redistribute(target, controls);
            expect(summ(patch)).to.equal(100 - target.value);
        })
    })

    describe('Overdraft', function(){
        const add = (i, value) => {
            const target = controls[i];
            target.value+=value;
            const patch = redistribute(target, controls);
            console.log(patch);
            return patch;
        }

        it('should still sum in 100 after -20', ()=>{
            const index = 0;
            const value = 30;

            const patch = add(index,value);
            expect(summ(patch)).to.equal(100 - controls[index].value);
        })

        it('should be all positive after -50', ()=>{
            const index = 1;
            const value = 50;
            const patch = add(index,value);
            expect(patch.every(x=>x.value>=0)).to.equal(true)
        })
    })
})
