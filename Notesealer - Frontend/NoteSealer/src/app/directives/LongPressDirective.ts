import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from "@angular/core";
import { fromEvent, merge, of, Subject, timer } from "rxjs";
import { filter, map, switchMap, takeUntil, tap } from "rxjs/operators";

@Directive({
  selector: "[longPress]",
  standalone: true,
})
export class LongPressDirective implements OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private longPressed = false;

  @Input() longPressThreshold = 500;
  @Input() longPressRepeatInterval = 0;

  @Output() longPress = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) {
    const el = this.elementRef.nativeElement;

    // --- Press start streams ---
    const mousedown$ = fromEvent<MouseEvent>(el, "mousedown").pipe(
      filter((e) => e.button === 0),
      map(() => true)
    );

    const touchstart$ = fromEvent<TouchEvent>(el, "touchstart").pipe(
      tap(() => (this.longPressed = false)), // reset flag each new touch
      map(() => true)
    );

    // --- Press end streams ---
    const mouseup$ = fromEvent<MouseEvent>(window, "mouseup").pipe(map(() => false));
    const mouseleave$ = fromEvent<MouseEvent>(el, "mouseleave").pipe(map(() => false));
    const touchend$ = fromEvent<TouchEvent>(el, "touchend").pipe(map(() => false));
    const touchcancel$ = fromEvent<TouchEvent>(el, "touchcancel").pipe(map(() => false));

    // --- Suppress ghost click & context menu only after a long press ---
    fromEvent<Event>(el, "contextmenu")
      .pipe(takeUntil(this.destroy$))
      .subscribe((e) => {
        if (this.longPressed) e.preventDefault();
      });

    fromEvent<MouseEvent>(el, "click", { capture: true })
      .pipe(takeUntil(this.destroy$))
      .subscribe((e) => {
        if (this.longPressed) {
          e.preventDefault();
          e.stopPropagation();
          this.longPressed = false;
        }
      });

    // --- Core logic ---
    merge(mousedown$, touchstart$, mouseup$, mouseleave$, touchend$, touchcancel$)
      .pipe(
        takeUntil(this.destroy$),
        switchMap((pressed) => {
          if (!pressed) return of(null);

          return this.longPressRepeatInterval > 0
            ? timer(this.longPressThreshold, this.longPressRepeatInterval)
            : timer(this.longPressThreshold);
        }),
        filter((value): value is number => value !== null),
        tap(() => (this.longPressed = true))
      )
      .subscribe(() => this.longPress.emit());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}