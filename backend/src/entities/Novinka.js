/**
 * Novinka entita — odráža stĺpce tabuľky `novinky`.
 */
export class Novinka {
    /** @type {number} */
    id;

    /** @type {string} */
    title;

    /** @type {string} */
    excerpt;

    /** @type {string} */
    content;

    /** @type {string|null} */
    image;

    /** @type {Date} */
    date;

    /** @type {Date} */
    createdAt;

    /** @type {Date} */
    updatedAt;

    constructor({ id, title, excerpt, content, image, date, createdAt, updatedAt }) {
        this.id        = id;
        this.title     = title;
        this.excerpt   = excerpt;
        this.content   = content;
        this.image     = image ?? null;
        this.date      = date;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
