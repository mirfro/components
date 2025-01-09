import IMask, { InputMask } from 'imask';

export class MirMaskedInput extends HTMLInputElement {
    #masker: InputMask;

    connectedCallback() {
        this.#masker = IMask(this, {
            mask: this.getAttribute('pattern'),
        });
    }
    disconnectedCallback() {
        this.#masker.destroy();
    }

    attributeChangedCallback(name: string, prev: unknown, value: string) {
        if (this[`${name}Changed`]) {
            this[`${name}Changed`](prev, value);
        }
    }

    patternChanged(prev: unknown, value: string) {
        if (this.#masker) {
            this.#masker.mask = value;
        }
    }
}
customElements.define('mir-masked-input', MirMaskedInput);