/**
 * AuthValidator — biznis pravidlá pre autentifikáciu.
 */
export class AuthValidator {

    static forLogin({ username, password }) {
        const errors = [];
        if (!username)          errors.push('Meno je povinné.');
        if (!password)          errors.push('Heslo je povinné.');
        if (password.length > 256) errors.push('Heslo je príliš dlhé.');
        return errors;
    }

    static forTotp({ partialToken, totpCode }) {
        const errors = [];
        if (!partialToken)                       errors.push('Chýba dočasný token.');
        if (!totpCode)                           errors.push('Kód autentifikátora je povinný.');
        if (!/^\d{6}$/.test(totpCode))           errors.push('Kód musí mať presne 6 číslic.');
        return errors;
    }
}
