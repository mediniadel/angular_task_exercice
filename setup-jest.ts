
import 'jest-preset-angular/setup-jest';
import '@angular/localize/init';

// Configuration du DOM virtuel
const mockWindow = () => {
  Object.defineProperties(window, {
    CSS: { value: null },
    getComputedStyle: {
      value: () => ({
        getPropertyValue: () => ''
      })
    },
    matchMedia: {
      value: () => ({
        matches: false,
        addListener: () => {},
        removeListener: () => {}
      })
    },
    requestAnimationFrame: {
      value: (callback: Function) => setTimeout(callback, 0)
    },
    cancelAnimationFrame: {
      value: (id: number) => clearTimeout(id)
    }
  });
};

const mockDocument = () => {
  Object.defineProperties(document, {
    doctype: { value: '<!DOCTYPE html>' },
    domain: { value: 'localhost' }
  });

  Object.defineProperty(document.body.style, 'transform', {
    value: () => ({
      enumerable: true,
      configurable: true
    })
  });
};

const mockAnimations = () => {
  Object.defineProperty(window, 'AnimationEvent', {
    value: class AnimationEvent {
      animationName: string;
      elapsedTime: number;
      pseudoElement: string;

      constructor(type: string, options: any = {}) {
        this.animationName = options.animationName || '';
        this.elapsedTime = options.elapsedTime || 0;
        this.pseudoElement = options.pseudoElement || '';
      }
    }
  });
};

const mockIntersectionObserver = () => {
  Object.defineProperty(window, 'IntersectionObserver', {
    value: class IntersectionObserver {
      constructor(callback: Function, options?: any) {}
      observe() { return null; }
      unobserve() { return null; }
      disconnect() { return null; }
    }
  });
};

const mockResizeObserver = () => {
  Object.defineProperty(window, 'ResizeObserver', {
    value: class ResizeObserver {
      constructor(callback: Function) {}
      observe() { return null; }
      unobserve() { return null; }
      disconnect() { return null; }
    }
  });
};

// Configuration globale de Jest
beforeAll(() => {
  mockWindow();
  mockDocument();
  mockAnimations();
  mockIntersectionObserver();
  mockResizeObserver();
});

// Nettoyage après chaque test
afterEach(() => {
  document.body.innerHTML = '';
  jest.clearAllMocks();
});

// Configuration globale des timeouts
jest.setTimeout(10000);
