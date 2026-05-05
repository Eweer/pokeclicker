import CaughtIndicatingItem from './CaughtIndicatingItem';
import { Pokerus } from '../GameConstants';

export default abstract class PokerusIndicatingItem extends CaughtIndicatingItem {
    abstract getPercentUntilResistant(): number;
    abstract getPokerusStatus(): Pokerus;
    abstract getPokerusProgress(): string;
}
