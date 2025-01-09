export declare class MirMaskedInput extends HTMLInputElement {
    #private;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: string, prev: unknown, value: string): void;
    patternChanged(prev: unknown, value: string): void;
}
