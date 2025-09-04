export interface Card {
    id: number;
    image: string;
    name: string;
    meaning: string;
    symbol: Symbol;
    letter: string;
    letter_association: string;
    tree_of_life: string;
    archetype: string;
    alchemical: string;
    archetypal_correspondences: string;
    colloquial_informal: string;
    memes: string;
}

interface Symbol {
    primary: string;
    secondary?: string;
}

export const createCard = (data: any): Card => ({
    id: data.id,
    image: data.image,
    name: data.name,
    meaning: data.meaning,
    symbol: data.symbol,
    letter: data.letter,
    letter_association: data.letter_association,
    tree_of_life: data.tree_of_life,
    archetype: data.archetype,
    alchemical: data.alchemical,
    archetypal_correspondences: data.archetypal_correspondences,
    colloquial_informal: data.colloquial_informal,
    memes: data.memes
});