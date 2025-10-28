import { type Card } from "$/lib/types/Card"

export interface CarouselEmitters {
	emitCardChange: (card: Card) => void;
	emitPosUpdate: (pos: number) => void;
	emitSectionChange: (label: string) => void;
};
