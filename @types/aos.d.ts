declare module 'aos' {
  interface AosOptions {
    offset?: number;
    delay?: number;
    duration?: number;
    easing?: string;
    once?: boolean;
    mirror?: boolean;
    anchorPlacement?: string;
    [key: string]: any;
  }

  interface Aos {
    init(options?: AosOptions): void;
    refresh(): void;
    refreshHard(): void;
    remove(element: HTMLElement): void;
  }

  const AOS: Aos;
  export default AOS;
}
