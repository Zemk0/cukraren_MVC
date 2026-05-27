/**
 * ProduktValidator — overí, či filtrovaný vstup spĺňa biznis pravidlá.
 */
export class ProduktValidator {

    static forCreate(data) {
        const errors = [];

        if (!data.name)
            errors.push('Názov produktu je povinný.');

        if (!data.price)
            errors.push('Cena produktu je povinná.');

        if (!data.category)
            errors.push('Kategória produktu je povinná.');

        return errors;
    }

    static forUpdate(data) {
        const errors = [];

        if (data.name !== undefined && !data.name)
            errors.push('Názov produktu nesmie byť prázdny.');

        if (data.price !== undefined && !data.price)
            errors.push('Cena produktu nesmie byť prázdna.');

        return errors;
    }
}
