import { Directive, HostListener, ElementRef, inject } from '@angular/core';

const TEXTOS = ['¡CLICK!', '¡PAM!', '¡ZAP!', '¡POW!', '¡BUM!', '¡CRACK!', '¡BOOM!', '¡POM!'];

function injectStyles(): void {
  if (document.getElementById('click-effect-styles')) return;
  const style = document.createElement('style');
  style.id = 'click-effect-styles';
  style.textContent = CLICK_EFFECT_CSS;
  document.head.appendChild(style);
}

@Directive({
  selector: '[appClickEffect], [appClickEffectSimple]',
  standalone: true,
})
export class ClickEffectDirective {
  private el = inject(ElementRef);

  constructor() {
    injectStyles();
  }

  // ── Escuchador para detectar el click en el objeto ──
  @HostListener('click')
  onClick(): void {
    const usaDestellos = (this.el.nativeElement as HTMLElement)
      .hasAttribute('appClickEffect');
    this.spawnEffect(usaDestellos);
  }

  // ── Lógica compartida para con o sin destellos ──
  private spawnEffect(conDestellos: boolean): void {
    const rect  = (this.el.nativeElement as HTMLElement).getBoundingClientRect();
    const cx    = rect.left + rect.width  / 2;
    const cy    = rect.top  + rect.height / 2;
    const texto = TEXTOS[Math.floor(Math.random() * TEXTOS.length)];

    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      left: ${cx}px;
      top: ${cy}px;
      width: 0;
      height: 0;
      pointer-events: none;
      z-index: 9999;
    `;

    // ── Mostrar el mensaje del bocadillo ──
    const bubble = document.createElement('div');
    bubble.className   = 'ce-bubble';
    bubble.textContent = texto;
    container.appendChild(bubble);

    // ── Crear destellos en el modal ──
    if (conDestellos) {
      const corners: { cls: string; angles: number[] }[] = [
        { cls: 'ce-corner ce-corner--tl', angles: [-135, -110, -160] },
        { cls: 'ce-corner ce-corner--tr', angles: [-45,  -20,  -70]  },
        { cls: 'ce-corner ce-corner--bl', angles:  [135,  110,  160] },
        { cls: 'ce-corner ce-corner--br', angles:  [45,   20,   70]  },
      ];

      corners.forEach(({ cls, angles }) => {
        const group = document.createElement('div');
        group.className = cls;

        angles.forEach((angle, i) => {
          const line = document.createElement('div');
          line.className = 'ce-line';
          const len = 14 + i * 4;
          line.style.cssText = `
            transform: rotate(${angle}deg);
            width: ${len}px;
            animation-delay: ${i * 30}ms;
          `;
          group.appendChild(line);
        });

        container.appendChild(group);
      });
    }

    document.body.appendChild(container);
    setTimeout(() => document.body.removeChild(container), 700);
  }
}

const CLICK_EFFECT_CSS = `
  .ce-bubble {
    position: absolute;
    transform: translate(-50%, -160%) scale(0.3);
    background: var(--amarillo);
    border: 2.5px solid var(--marron);
    border-radius: 10px 10px 10px 10px;
    padding: 3px 10px;
    font-family: 'Lato', sans-serif;
    font-weight: 900;
    font-size: 13px;
    margin-top: 5px;
    margin-left: 30px;
    color: var(--marron);
    white-space: nowrap;
    box-shadow: 2px 2px 0 var(--marron);
    animation: ce-bubble 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    z-index: 2;
  }
  @keyframes ce-bubble {
    0%   { opacity: 0;   transform: translate(-50%, -120%) scale(0.3) rotate(-8deg); }
    25%  { opacity: 1;   transform: translate(-50%, -150%) scale(1.25) rotate(4deg); }
    50%  { opacity: 1;   transform: translate(-50%, -155%) scale(0.95) rotate(-2deg); }
    75%  { opacity: 1;   transform: translate(-50%, -158%) scale(1.05) rotate(0deg); }
    100% { opacity: 0;   transform: translate(-50%, -175%) scale(0.9)  rotate(0deg); }
  }
  .ce-corner {
    position: absolute;
    width: 0;
    height: 0;
  }
  .ce-corner--tl { transform: translate(-44px, -44px); }
  .ce-corner--tr { transform: translate( 44px, -44px); }
  .ce-corner--bl { transform: translate(-44px,  44px); }
  .ce-corner--br { transform: translate( 44px,  44px); }
  .ce-line {
    position: absolute;
    height: 2.5px;
    background: var(--marron);
    border-radius: 2px;
    transform-origin: left center;
    left: 0;
    top: -1px;
    opacity: 0;
    animation: ce-line 0.5s ease forwards;
  }
  @keyframes ce-line {
    0%   { opacity: 0; transform-origin: left center; width: 0%;  }
    20%  { opacity: 1; }
    50%  { opacity: 1; }
    100% { opacity: 0; }
  }
`;