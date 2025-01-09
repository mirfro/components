import IMask, { InputMask } from 'imask';

export class MirMaskedInput extends HTMLInputElement {
    static maskAttributes = ['mask-pattern', 'mask-regexp', 'mask-number'];
    #inputMask: InputMask;

    connectedCallback() {
        for (const attr of MirMaskedInput.maskAttributes) {
            if (this.hasAttribute(attr)) {
                this[attr](this.getAttribute(attr));
                return;
            }
        }
        console.warn('No mask-* attribute was set for element "mir-masked-input"');
    }
    disconnectedCallback() {
        this.#inputMask.destroy();
    }

    ['mask-pattern'](mask: string): void {
        this.#inputMask = IMask(this, {
            mask: mask,
        });
    }
    ['mask-regexp'](mask: string): void {
        this.#inputMask = IMask(this, {
            mask: new RegExp(mask),
        });
    }
    ['mask-number'](options: string) {
        this.#inputMask = IMask(this, {mask: Number, ...JSON.parse(options || '{}')});
    }
}
customElements.define('mir-masked-input', MirMaskedInput, { extends: 'input'});