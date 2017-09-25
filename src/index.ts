export type AuctionEvent =
    {
        type: 'init';
        auctionId: string;
        owner: string;
        quantity: number;
        description: string;
    } |
    {
        type: 'pledge',
        auctionId: string;
        owner: string;
        price: number;
        quantity: number
    } |
    {
        type: 'close';
        auctionId: string;
    };

export type Pledge = {
    owner: string;
    price: number;
    quantity: number;
};

export type Auction = {
    id: string;
    description: string;
    owner: string;
    pledges: Pledge[];
    closed: boolean;
};

// TODO: this should probably return error messages so that we can map
// them to application errors
export function getAuction(id: string, events: AuctionEvent[]): Auction | null {
    return events.reduce((state: Auction | null, event: AuctionEvent) => {
        if (event.auctionId !== id) {
            return state;
        }

        if (state != null && state.closed) {
            console.log(`event received after auction closed: ${event}`);
            return state;
        }

        if (event.type === 'init') {
            return {
                id: id,
                owner: event.owner,
                description: event.description,
                pledges: [],
                closed: false
            };
        }

        if (state == null) {
            throw new TypeError(`Updating a non-initialised Auction: ${id}`);
        }

        if (event.type === 'pledge') {
            const pledges = state.pledges.concat({
                owner: event.owner,
                quantity: event.quantity,
                price: event.price
            });

            // TODO: dedupe by owner
            // TODO: truncate to the number of items for sale 
            pledges.sort((a, b) => b.price - a.price);

            return { ...state, pledges };
        }

        if (event.type === 'close') {
            return { ...state, closed: true };
        }

        throw new Error();
    }, null);
}
