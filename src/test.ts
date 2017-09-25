import * as test from 'tape';
import { getAuction } from './index';

test('init creates a new auction', (t) => {
    t.plan(2);

    const auction = getAuction('fart', [
        {
            type: 'init',
            auctionId: 'fart',
            owner: 'fartface',
            quantity: 5,
            description: 'a fart'
        }
    ]);

    t.notEqual(auction, null, `Result should not be null`);
    t.equal(auction && auction.id, 'fart', `ID is set by the init event`);
});

test('pledge adds a pledge to an auction', (t) => {
    t.plan(3);

    const auction = getAuction('fart', [
        {
            type: 'init',
            auctionId: 'fart',
            owner: 'fartface',
            quantity: 5,
            description: 'a fart'
        },
        {
            type: 'pledge',
            auctionId: 'fart',
            owner: 'buttface',
            price: 34,
            quantity: 3
        }
    ]);

    t.notEqual(auction, null, `Result should not be null`);
    if (auction == null) throw new Error(); // this shouldn't happen really

    t.equal(auction.pledges.length, 1);
    t.deepEqual(auction.pledges[0], { owner: 'buttface', quantity: 3, price: 34 });
});

test('close event closes an auction', _ => { });
test('pledge after close fails', _ => { });
test('second init fails', _ => { });
test('second close fails', _ => { });
test('a higher pledge by the same user replaces the first', _ => { });
test('a lower pledge by the same user is rejected', _ => { });

// TODO: test a finalised auction
// TODO: winning pledges with quantities higher than 1 should truncate properly
