export function isNegative(personData: any, person: string): boolean {
    let isNegative = false;

    try {
        // Support role check
        if (personData.lane === 'BOTTOM' && personData.teamPosition === 'UTILITY') {
            isNegative = personData.kills + (personData.assists / 2) < personData.deaths;
            console.log(`${person} is on support and is ${isNegative ? 'negative' : 'positive'}`);
        }

        else {
            isNegative = personData.kills < personData.deaths;
            console.log(`${person} is ${isNegative ? 'negative' : 'positive'}`);
        }
    }
    catch (error) {
        console.error('Error determining if player is negative:', error);
    }

    return isNegative;
}