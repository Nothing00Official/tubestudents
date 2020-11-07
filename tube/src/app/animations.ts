import { style, animate, group, transition, state, trigger } from '@angular/animations';

export const fadeSlide = [
  trigger('slide', [
    state('left', style({ transform: 'translateX(0)' })),
    state('right', style({ transform: 'translateX(-50%)' })),
    transition('* => *', animate(300))
  ])
];

export const fadeOut = [
  trigger('slideInOut', [
    state('in', style({ height: '*', opacity: 0 })),
    transition(':leave', [
      style({ height: '*', opacity: 1 }),

      group([
        animate(300, style({ height: 0 })),
        animate('200ms ease-in-out', style({ 'opacity': '0' }))
      ])

    ]),
    transition(':enter', [
      style({ height: '0', opacity: 0 }),

      group([
        animate(300, style({ height: '*' })),
        animate('400ms ease-in-out', style({ 'opacity': '1' }))
      ])

    ])
  ])
]
