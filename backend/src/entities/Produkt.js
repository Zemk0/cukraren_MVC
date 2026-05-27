/**
 * Produkt entita — odráža stĺpce tabuľky `produkty`.
 * Jednoduchá dátová trieda bez akejkoľvek biznis logiky.
 */
export class Produkt {
    /** @type {number} */
    id;

    /** @type {string} */
    name;

    /** @type {string} */
    description;

    /** @type {string} */
    price;

    /** @type {string} */
    category;

    /** @type {string|null} */
    image;

    /** @type {boolean} */
    isActive;

    /** @type {Date} */
    createdAt;

    /** @type {Date} */
    updatedAt;

    constructor({ id, name, description, price, category, image, isActive, createdAt, updatedAt }) {
        this.id          = id;
        this.name        = name;
        this.description = description;
        this.price       = price;
        this.category    = category;
        this.image       = image ?? null;
        this.isActive    = isActive;
        this.createdAt   = createdAt;
        this.updatedAt   = updatedAt;
    }
}
