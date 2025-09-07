export interface Card {
    name: string;
    image?: string;
    meaning: string;
    original_title: string;
    attribution: Attribution;
    dates: string;
    hebrew_letter: string;
    letter_association: string;
    part_of_soul: string;
    suit_element: string;
    division_of_creation: string;
    tree_of_life_path: string;
    tree_of_life_sefira: string;
    birthday_examples: string[];
}

interface Attribution {
    primary: string;
    secondary?: string;
}

export const createCard = (data: any): Card => ({
    name: data.name,
    image: data.image,
    meaning: data.meaning,
    original_title: data.original_title,
    attribution: data.attribution,
    dates: data.dates,
    hebrew_letter: data.hebrew_letter,
    letter_association: data.letter_association,
    part_of_soul: data.part_of_soul,
    suit_element: data.suit_element,
    division_of_creation: data.division_of_creation,
    tree_of_life_path: data.tree_of_life_path,
    tree_of_life_sefira: data.tree_of_life_sefira,
    birthday_examples: data.birthday_examples
});