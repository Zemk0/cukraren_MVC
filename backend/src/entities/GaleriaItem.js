/**
 * GaleriaItem entita — odráža stĺpce tabuľky `galeria`.
 */
export class GaleriaItem {
    /** @type {number} */
    id;

    /** @type {string} */
    title;

    /** @type {string|null} */
    image;

    /** @type {Date} */
    createdAt;

    constructor({ id, title, image, createdAt }) {
        this.id        = id;
        this.title     = title;
        this.image     = image ?? null;
        this.createdAt = createdAt;
    }
}
