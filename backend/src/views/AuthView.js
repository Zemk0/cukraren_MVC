/**
 * AuthView — formátuje HTTP odpovede pre auth endpointy.
 */
export class AuthView {

    /** Step 1 success — vráti partial token pre TOTP krok */
    static passwordOk(res, partialToken) {
        res.json({ partialToken });
    }

    /** Step 2 success — vráti plný JWT */
    static loginOk(res, token) {
        res.json({ token });
    }

    static unauthorized(res, message = 'Nesprávne prihlasovacie údaje.') {
        res.status(401).json({ message });
    }

    static validationError(res, errors) {
        res.status(422).json({ errors });
    }

    static conflict(res, message) {
        res.status(409).json({ message });
    }
}
