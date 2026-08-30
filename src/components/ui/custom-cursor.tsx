import { useEffect, useRef } from 'react';
import './custom-cursor.css';

type CursorState = 'default' | 'interactive' | 'view' | 'disabled';

const ACTIVE_CLASS = 'kenz-custom-cursor-active';
const POINTER_QUERY = '(hover: hover) and (pointer: fine)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

const DISABLED_SELECTOR = ':disabled, [aria-disabled="true"], [data-disabled]';
const NATIVE_CONTROL_SELECTOR = [
  'input:not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="file"]):not([type="color"])',
  'textarea',
  'select',
  '[contenteditable="true"]',
  '[data-native-cursor]',
  'input[type="range"]',
  '[role="slider"]',
  '[draggable="true"]',
].join(', ');
const INTERACTIVE_SELECTOR = [
  'a[href]',
  'button',
  'input[type="button"]',
  'input[type="submit"]',
  'input[type="reset"]',
  'input[type="checkbox"]',
  'input[type="radio"]',
  'input[type="file"]',
  'input[type="color"]',
  '[role="button"]',
  '[role="link"]',
  'summary',
  'label[for]',
  '[data-cursor="interactive"]',
].join(', ');
const SELECTABLE_TEXT_SELECTOR = 'p, h1, h2, h3, h4, h5, h6, blockquote, pre, code, [data-selectable-text]';
const VIEW_SELECTOR = '[data-cursor="view"], [data-cursor-label]';

function closest(target: EventTarget | null, selector: string) {
  return target instanceof Element ? target.closest<HTMLElement>(selector) : null;
}

/**
 * Lightweight, global fine-pointer cursor. Pointer coordinates are written
 * directly to transforms and the trailing ring is animated by a single RAF.
 */
export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    const pointerMedia = window.matchMedia(POINTER_QUERY);
    const reducedMotionMedia = window.matchMedia(REDUCED_MOTION_QUERY);
    let deactivate: () => void = () => undefined;

    const activate = () => {
      let frame = 0;
      let targetX = -100;
      let targetY = -100;
      let ringX = -100;
      let ringY = -100;
      let positioned = false;
      let lastTarget: EventTarget | null = null;
      let state: CursorState = 'default';
      let label = '';

      const setVisible = (visible: boolean) => {
        ring.dataset.visible = String(visible);
        dot.dataset.visible = String(visible);
      };

      const setPressed = (pressed: boolean) => {
        ring.dataset.pressed = String(pressed);
        dot.dataset.pressed = String(pressed);
      };

      const setState = (nextState: CursorState, nextLabel = '') => {
        if (nextState !== state) {
          state = nextState;
          ring.dataset.state = nextState;
          dot.dataset.state = nextState;
        }
        if (nextLabel !== label) {
          label = nextLabel;
          ring.style.setProperty('--cursor-label', `"${nextLabel.replaceAll('"', '')}"`);
        }
      };

      const resetContext = (hide = false) => {
        lastTarget = null;
        setPressed(false);
        setState('default');
        if (hide) setVisible(false);
      };

      const classifyTarget = (target: EventTarget | null) => {
        if (target === lastTarget) return;
        lastTarget = target;

        if (closest(target, DISABLED_SELECTOR)) {
          setState('disabled');
          return;
        }
        if (closest(target, NATIVE_CONTROL_SELECTOR)) {
          setState('default');
          setVisible(false);
          return;
        }

        const viewTarget = closest(target, VIEW_SELECTOR);
        if (viewTarget) {
          setState('view', viewTarget.dataset.cursorLabel || 'VIEW');
          return;
        }
        if (closest(target, INTERACTIVE_SELECTOR)) {
          setState('interactive');
          return;
        }
        if (closest(target, SELECTABLE_TEXT_SELECTOR)) {
          setState('default');
          setVisible(false);
          return;
        }
        setState('default');
      };

      const renderRing = () => {
        ringX += (targetX - ringX) * 0.2;
        ringY += (targetY - ringY) * 0.2;
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;

        if (Math.abs(targetX - ringX) > 0.08 || Math.abs(targetY - ringY) > 0.08) {
          frame = window.requestAnimationFrame(renderRing);
        } else {
          ringX = targetX;
          ringY = targetY;
          ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
          frame = 0;
        }
      };

      const onPointerMove = (event: PointerEvent) => {
        if (event.pointerType && event.pointerType !== 'mouse') return;

        targetX = event.clientX;
        targetY = event.clientY;
        dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
        classifyTarget(event.target);

        const usesNativeCursor =
          !closest(event.target, DISABLED_SELECTOR) &&
          (closest(event.target, NATIVE_CONTROL_SELECTOR) ||
            (!closest(event.target, VIEW_SELECTOR) &&
              !closest(event.target, INTERACTIVE_SELECTOR) &&
              closest(event.target, SELECTABLE_TEXT_SELECTOR)));
        setVisible(!usesNativeCursor);

        if (!positioned) {
          positioned = true;
          ringX = targetX;
          ringY = targetY;
          ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
          return;
        }
        if (!frame) frame = window.requestAnimationFrame(renderRing);
      };

      const onPointerDown = (event: PointerEvent) => {
        if (event.pointerType === 'mouse' && event.button === 0) setPressed(true);
      };
      const onPointerUp = () => setPressed(false);
      const onPointerOut = (event: PointerEvent) => {
        if (!event.relatedTarget) setVisible(false);
      };
      const onRouteClick = (event: MouseEvent) => {
        if (closest(event.target, 'a[href]')) queueMicrotask(() => resetContext(true));
      };
      const onContextReset = () => resetContext(true);

      document.documentElement.classList.add(ACTIVE_CLASS);
      document.addEventListener('pointermove', onPointerMove, { passive: true });
      document.addEventListener('pointerdown', onPointerDown, { passive: true });
      document.addEventListener('pointerup', onPointerUp, { passive: true });
      document.addEventListener('pointercancel', onPointerUp, { passive: true });
      document.addEventListener('click', onRouteClick, true);
      window.addEventListener('pointerout', onPointerOut, { passive: true });
      window.addEventListener('blur', onContextReset);
      window.addEventListener('popstate', onContextReset);
      window.addEventListener('hashchange', onContextReset);

      return () => {
        document.documentElement.classList.remove(ACTIVE_CLASS);
        document.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerdown', onPointerDown);
        document.removeEventListener('pointerup', onPointerUp);
        document.removeEventListener('pointercancel', onPointerUp);
        document.removeEventListener('click', onRouteClick, true);
        window.removeEventListener('pointerout', onPointerOut);
        window.removeEventListener('blur', onContextReset);
        window.removeEventListener('popstate', onContextReset);
        window.removeEventListener('hashchange', onContextReset);
        if (frame) window.cancelAnimationFrame(frame);
        setVisible(false);
      };
    };

    const syncCapability = () => {
      deactivate();
      deactivate = () => undefined;
      if (pointerMedia.matches && !reducedMotionMedia.matches) deactivate = activate();
    };

    syncCapability();
    pointerMedia.addEventListener('change', syncCapability);
    reducedMotionMedia.addEventListener('change', syncCapability);

    return () => {
      pointerMedia.removeEventListener('change', syncCapability);
      reducedMotionMedia.removeEventListener('change', syncCapability);
      deactivate();
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        className="kenz-cursor kenz-cursor--ring"
        data-state="default"
        data-visible="false"
        data-pressed="false"
        aria-hidden="true"
      >
        <span className="kenz-cursor__ring" />
      </div>
      <div
        ref={dotRef}
        className="kenz-cursor kenz-cursor--dot"
        data-state="default"
        data-visible="false"
        data-pressed="false"
        aria-hidden="true"
      />
    </>
  );
}
