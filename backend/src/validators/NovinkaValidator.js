/**
 * NovinkaValidator — overí, či filtrovaný vstup spĺňa biznis pravidlá.
 */
export class NovinkaValidator {

    static forCreate(data) {
        const errors = [];

        if (!data.title)
            errors.push('Nadpis novinky je povinný.');

        if (!data.content)
            errors.push('Obsah novinky je povinný.');

        return errors;
    }

    static forUpdate(data) {
        const errors = [];

        if (data.title !== undefined && !data.title)
            errors.push('Nadpis novinky nesmie byť prázdny.');

        if (data.content !== undefined && !data.content)
            errors.push('Obsah novinky nesmie byť prázdny.');

        return errors;
    }
}
