export interface Card {
    name: string;
    type: string;
    image?: string;
    meaning: string;
    original_title: string;
    attribution: Attribution;
}

interface Attribution {
    primary: string;
    secondary?: string;
}

export interface MajorArcanaCard extends Card {
    hebrew_letter: string;
    letter_association: string;
    tree_of_life_path: string;
}

export interface MinorArcanaCard extends Card {
    suit_element: string;
    part_of_soul: string;
    division_of_creation: string;
    tree_of_life_sefira: string;
}

export interface CourtCard extends MinorArcanaCard {
    dates: string;
    birthday_examples: string[];
}

export const createCard = (cardData: any = null): Card => {
    if (cardData && cardData.type === "Major Arcana") 
        return createMajorArcanaCard(cardData);
    else if (cardData && cardData.type === "Court Card")
        return createCourtCard(cardData);
    else if (cardData && cardData.type === "Minor Arcana")
        return createMinorArcanaCard(cardData);
    return createBaseCard(cardData);
};


const createBaseCard = (cardData: any): Card => {
    if (!cardData) {
        return {
            name: "",
            type: "",
            image: "/cards/card.png",
            meaning: "",
            original_title: "",
            attribution: { primary: "" }
        };
    }
    
    return {
        name: cardData.name,
        type: cardData.type,
        image: cardData.image,
        meaning: cardData.meaning,
        original_title: cardData.original_title,
        attribution: cardData.attribution
    };
};

const createMajorArcanaCard = (cardData: any): MajorArcanaCard => ({
    ...createBaseCard(cardData),
    hebrew_letter: cardData.hebrew_letter,
    letter_association: cardData.letter_association,
    tree_of_life_path: cardData.tree_of_life_path
});

const createMinorArcanaCard = (cardData: any): MinorArcanaCard => ({
    ...createBaseCard(cardData),
    suit_element: cardData.suit_element,
    part_of_soul: cardData.part_of_soul,
    division_of_creation: cardData.division_of_creation,
    tree_of_life_sefira: cardData.tree_of_life_sefira
});

const createCourtCard = (cardData: any): CourtCard => ({
    ...createMinorArcanaCard(cardData),
    tree_of_life_sefira: "",
    dates: cardData.dates,
    birthday_examples: cardData.birthday_examples
});