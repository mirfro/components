function F(a) {
  return typeof a == "string" || a instanceof String;
}
function P(a) {
  var t;
  return typeof a == "object" && a != null && (a == null || (t = a.constructor) == null ? void 0 : t.name) === "Object";
}
function G(a, t) {
  return Array.isArray(t) ? G(a, (e, s) => t.includes(s)) : Object.entries(a).reduce((e, s) => {
    let [i, n] = s;
    return t(n, i) && (e[i] = n), e;
  }, {});
}
const l = {
  NONE: "NONE",
  LEFT: "LEFT",
  FORCE_LEFT: "FORCE_LEFT",
  RIGHT: "RIGHT",
  FORCE_RIGHT: "FORCE_RIGHT"
};
function W(a) {
  switch (a) {
    case l.LEFT:
      return l.FORCE_LEFT;
    case l.RIGHT:
      return l.FORCE_RIGHT;
    default:
      return a;
  }
}
function R(a) {
  return a.replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1");
}
function D(a, t) {
  if (t === a) return !0;
  const e = Array.isArray(t), s = Array.isArray(a);
  let i;
  if (e && s) {
    if (t.length != a.length) return !1;
    for (i = 0; i < t.length; i++) if (!D(t[i], a[i])) return !1;
    return !0;
  }
  if (e != s) return !1;
  if (t && a && typeof t == "object" && typeof a == "object") {
    const n = t instanceof Date, u = a instanceof Date;
    if (n && u) return t.getTime() == a.getTime();
    if (n != u) return !1;
    const r = t instanceof RegExp, h = a instanceof RegExp;
    if (r && h) return t.toString() == a.toString();
    if (r != h) return !1;
    const o = Object.keys(t);
    for (i = 0; i < o.length; i++) if (!Object.prototype.hasOwnProperty.call(a, o[i])) return !1;
    for (i = 0; i < o.length; i++) if (!D(a[o[i]], t[o[i]])) return !1;
    return !0;
  } else if (t && a && typeof t == "function" && typeof a == "function")
    return t.toString() === a.toString();
  return !1;
}
class J {
  /** Current input value */
  /** Current cursor position */
  /** Old input value */
  /** Old selection */
  constructor(t) {
    for (Object.assign(this, t); this.value.slice(0, this.startChangePos) !== this.oldValue.slice(0, this.startChangePos); )
      --this.oldSelection.start;
    if (this.insertedCount)
      for (; this.value.slice(this.cursorPos) !== this.oldValue.slice(this.oldSelection.end); )
        this.value.length - this.cursorPos < this.oldValue.length - this.oldSelection.end ? ++this.oldSelection.end : ++this.cursorPos;
  }
  /** Start changing position */
  get startChangePos() {
    return Math.min(this.cursorPos, this.oldSelection.start);
  }
  /** Inserted symbols count */
  get insertedCount() {
    return this.cursorPos - this.startChangePos;
  }
  /** Inserted symbols */
  get inserted() {
    return this.value.substr(this.startChangePos, this.insertedCount);
  }
  /** Removed symbols count */
  get removedCount() {
    return Math.max(this.oldSelection.end - this.startChangePos || // for Delete
    this.oldValue.length - this.value.length, 0);
  }
  /** Removed symbols */
  get removed() {
    return this.oldValue.substr(this.startChangePos, this.removedCount);
  }
  /** Unchanged head symbols */
  get head() {
    return this.value.substring(0, this.startChangePos);
  }
  /** Unchanged tail symbols */
  get tail() {
    return this.value.substring(this.startChangePos + this.insertedCount);
  }
  /** Remove direction */
  get removeDirection() {
    return !this.removedCount || this.insertedCount ? l.NONE : (this.oldSelection.end === this.cursorPos || this.oldSelection.start === this.cursorPos) && // if not range removed (event with backspace)
    this.oldSelection.end === this.oldSelection.start ? l.RIGHT : l.LEFT;
  }
}
function d(a, t) {
  return new d.InputMask(a, t);
}
function z(a) {
  if (a == null) throw new Error("mask property should be defined");
  return a instanceof RegExp ? d.MaskedRegExp : F(a) ? d.MaskedPattern : a === Date ? d.MaskedDate : a === Number ? d.MaskedNumber : Array.isArray(a) || a === Array ? d.MaskedDynamic : d.Masked && a.prototype instanceof d.Masked ? a : d.Masked && a instanceof d.Masked ? a.constructor : a instanceof Function ? d.MaskedFunction : (console.warn("Mask not found for mask", a), d.Masked);
}
function B(a) {
  if (!a) throw new Error("Options in not defined");
  if (d.Masked) {
    if (a.prototype instanceof d.Masked) return {
      mask: a
    };
    const {
      mask: t = void 0,
      ...e
    } = a instanceof d.Masked ? {
      mask: a
    } : P(a) && a.mask instanceof d.Masked ? a : {};
    if (t) {
      const s = t.mask;
      return {
        ...G(t, (i, n) => !n.startsWith("_")),
        mask: t.constructor,
        _mask: s,
        ...e
      };
    }
  }
  return P(a) ? {
    ...a
  } : {
    mask: a
  };
}
function A(a) {
  if (d.Masked && a instanceof d.Masked) return a;
  const t = B(a), e = z(t.mask);
  if (!e) throw new Error("Masked class is not found for provided mask " + t.mask + ", appropriate module needs to be imported manually before creating mask.");
  return t.mask === e && delete t.mask, t._mask && (t.mask = t._mask, delete t._mask), new e(t);
}
d.createMask = A;
class N {
  /** */
  /** */
  /** */
  /** Safely returns selection start */
  get selectionStart() {
    let t;
    try {
      t = this._unsafeSelectionStart;
    } catch {
    }
    return t ?? this.value.length;
  }
  /** Safely returns selection end */
  get selectionEnd() {
    let t;
    try {
      t = this._unsafeSelectionEnd;
    } catch {
    }
    return t ?? this.value.length;
  }
  /** Safely sets element selection */
  select(t, e) {
    if (!(t == null || e == null || t === this.selectionStart && e === this.selectionEnd))
      try {
        this._unsafeSelect(t, e);
      } catch {
      }
  }
  /** */
  get isActive() {
    return !1;
  }
  /** */
  /** */
  /** */
}
d.MaskElement = N;
const H = 90, Q = 89;
class V extends N {
  /** HTMLElement to use mask on */
  constructor(t) {
    super(), this.input = t, this._onKeydown = this._onKeydown.bind(this), this._onInput = this._onInput.bind(this), this._onBeforeinput = this._onBeforeinput.bind(this), this._onCompositionEnd = this._onCompositionEnd.bind(this);
  }
  get rootElement() {
    var t, e, s;
    return (t = (e = (s = this.input).getRootNode) == null ? void 0 : e.call(s)) != null ? t : document;
  }
  /** Is element in focus */
  get isActive() {
    return this.input === this.rootElement.activeElement;
  }
  /** Binds HTMLElement events to mask internal events */
  bindEvents(t) {
    this.input.addEventListener("keydown", this._onKeydown), this.input.addEventListener("input", this._onInput), this.input.addEventListener("beforeinput", this._onBeforeinput), this.input.addEventListener("compositionend", this._onCompositionEnd), this.input.addEventListener("drop", t.drop), this.input.addEventListener("click", t.click), this.input.addEventListener("focus", t.focus), this.input.addEventListener("blur", t.commit), this._handlers = t;
  }
  _onKeydown(t) {
    if (this._handlers.redo && (t.keyCode === H && t.shiftKey && (t.metaKey || t.ctrlKey) || t.keyCode === Q && t.ctrlKey))
      return t.preventDefault(), this._handlers.redo(t);
    if (this._handlers.undo && t.keyCode === H && (t.metaKey || t.ctrlKey))
      return t.preventDefault(), this._handlers.undo(t);
    t.isComposing || this._handlers.selectionChange(t);
  }
  _onBeforeinput(t) {
    if (t.inputType === "historyUndo" && this._handlers.undo)
      return t.preventDefault(), this._handlers.undo(t);
    if (t.inputType === "historyRedo" && this._handlers.redo)
      return t.preventDefault(), this._handlers.redo(t);
  }
  _onCompositionEnd(t) {
    this._handlers.input(t);
  }
  _onInput(t) {
    t.isComposing || this._handlers.input(t);
  }
  /** Unbinds HTMLElement events to mask internal events */
  unbindEvents() {
    this.input.removeEventListener("keydown", this._onKeydown), this.input.removeEventListener("input", this._onInput), this.input.removeEventListener("beforeinput", this._onBeforeinput), this.input.removeEventListener("compositionend", this._onCompositionEnd), this.input.removeEventListener("drop", this._handlers.drop), this.input.removeEventListener("click", this._handlers.click), this.input.removeEventListener("focus", this._handlers.focus), this.input.removeEventListener("blur", this._handlers.commit), this._handlers = {};
  }
}
d.HTMLMaskElement = V;
class tt extends V {
  /** InputElement to use mask on */
  constructor(t) {
    super(t), this.input = t;
  }
  /** Returns InputElement selection start */
  get _unsafeSelectionStart() {
    return this.input.selectionStart != null ? this.input.selectionStart : this.value.length;
  }
  /** Returns InputElement selection end */
  get _unsafeSelectionEnd() {
    return this.input.selectionEnd;
  }
  /** Sets InputElement selection */
  _unsafeSelect(t, e) {
    this.input.setSelectionRange(t, e);
  }
  get value() {
    return this.input.value;
  }
  set value(t) {
    this.input.value = t;
  }
}
d.HTMLMaskElement = V;
class K extends V {
  /** Returns HTMLElement selection start */
  get _unsafeSelectionStart() {
    const t = this.rootElement, e = t.getSelection && t.getSelection(), s = e && e.anchorOffset, i = e && e.focusOffset;
    return i == null || s == null || s < i ? s : i;
  }
  /** Returns HTMLElement selection end */
  get _unsafeSelectionEnd() {
    const t = this.rootElement, e = t.getSelection && t.getSelection(), s = e && e.anchorOffset, i = e && e.focusOffset;
    return i == null || s == null || s > i ? s : i;
  }
  /** Sets HTMLElement selection */
  _unsafeSelect(t, e) {
    if (!this.rootElement.createRange) return;
    const s = this.rootElement.createRange();
    s.setStart(this.input.firstChild || this.input, t), s.setEnd(this.input.lastChild || this.input, e);
    const i = this.rootElement, n = i.getSelection && i.getSelection();
    n && (n.removeAllRanges(), n.addRange(s));
  }
  /** HTMLElement value */
  get value() {
    return this.input.textContent || "";
  }
  set value(t) {
    this.input.textContent = t;
  }
}
d.HTMLContenteditableMaskElement = K;
class w {
  constructor() {
    this.states = [], this.currentIndex = 0;
  }
  get currentState() {
    return this.states[this.currentIndex];
  }
  get isEmpty() {
    return this.states.length === 0;
  }
  push(t) {
    this.currentIndex < this.states.length - 1 && (this.states.length = this.currentIndex + 1), this.states.push(t), this.states.length > w.MAX_LENGTH && this.states.shift(), this.currentIndex = this.states.length - 1;
  }
  go(t) {
    return this.currentIndex = Math.min(Math.max(this.currentIndex + t, 0), this.states.length - 1), this.currentState;
  }
  undo() {
    return this.go(-1);
  }
  redo() {
    return this.go(1);
  }
  clear() {
    this.states.length = 0, this.currentIndex = 0;
  }
}
w.MAX_LENGTH = 100;
class et {
  /**
    View element
  */
  /** Internal {@link Masked} model */
  constructor(t, e) {
    this.el = t instanceof N ? t : t.isContentEditable && t.tagName !== "INPUT" && t.tagName !== "TEXTAREA" ? new K(t) : new tt(t), this.masked = A(e), this._listeners = {}, this._value = "", this._unmaskedValue = "", this._rawInputValue = "", this.history = new w(), this._saveSelection = this._saveSelection.bind(this), this._onInput = this._onInput.bind(this), this._onChange = this._onChange.bind(this), this._onDrop = this._onDrop.bind(this), this._onFocus = this._onFocus.bind(this), this._onClick = this._onClick.bind(this), this._onUndo = this._onUndo.bind(this), this._onRedo = this._onRedo.bind(this), this.alignCursor = this.alignCursor.bind(this), this.alignCursorFriendly = this.alignCursorFriendly.bind(this), this._bindEvents(), this.updateValue(), this._onChange();
  }
  maskEquals(t) {
    var e;
    return t == null || ((e = this.masked) == null ? void 0 : e.maskEquals(t));
  }
  /** Masked */
  get mask() {
    return this.masked.mask;
  }
  set mask(t) {
    if (this.maskEquals(t)) return;
    if (!(t instanceof d.Masked) && this.masked.constructor === z(t)) {
      this.masked.updateOptions({
        mask: t
      });
      return;
    }
    const e = t instanceof d.Masked ? t : A({
      mask: t
    });
    e.unmaskedValue = this.masked.unmaskedValue, this.masked = e;
  }
  /** Raw value */
  get value() {
    return this._value;
  }
  set value(t) {
    this.value !== t && (this.masked.value = t, this.updateControl("auto"));
  }
  /** Unmasked value */
  get unmaskedValue() {
    return this._unmaskedValue;
  }
  set unmaskedValue(t) {
    this.unmaskedValue !== t && (this.masked.unmaskedValue = t, this.updateControl("auto"));
  }
  /** Raw input value */
  get rawInputValue() {
    return this._rawInputValue;
  }
  set rawInputValue(t) {
    this.rawInputValue !== t && (this.masked.rawInputValue = t, this.updateControl(), this.alignCursor());
  }
  /** Typed unmasked value */
  get typedValue() {
    return this.masked.typedValue;
  }
  set typedValue(t) {
    this.masked.typedValueEquals(t) || (this.masked.typedValue = t, this.updateControl("auto"));
  }
  /** Display value */
  get displayValue() {
    return this.masked.displayValue;
  }
  /** Starts listening to element events */
  _bindEvents() {
    this.el.bindEvents({
      selectionChange: this._saveSelection,
      input: this._onInput,
      drop: this._onDrop,
      click: this._onClick,
      focus: this._onFocus,
      commit: this._onChange,
      undo: this._onUndo,
      redo: this._onRedo
    });
  }
  /** Stops listening to element events */
  _unbindEvents() {
    this.el && this.el.unbindEvents();
  }
  /** Fires custom event */
  _fireEvent(t, e) {
    const s = this._listeners[t];
    s && s.forEach((i) => i(e));
  }
  /** Current selection start */
  get selectionStart() {
    return this._cursorChanging ? this._changingCursorPos : this.el.selectionStart;
  }
  /** Current cursor position */
  get cursorPos() {
    return this._cursorChanging ? this._changingCursorPos : this.el.selectionEnd;
  }
  set cursorPos(t) {
    !this.el || !this.el.isActive || (this.el.select(t, t), this._saveSelection());
  }
  /** Stores current selection */
  _saveSelection() {
    this.displayValue !== this.el.value && console.warn("Element value was changed outside of mask. Syncronize mask using `mask.updateValue()` to work properly."), this._selection = {
      start: this.selectionStart,
      end: this.cursorPos
    };
  }
  /** Syncronizes model value from view */
  updateValue() {
    this.masked.value = this.el.value, this._value = this.masked.value, this._unmaskedValue = this.masked.unmaskedValue, this._rawInputValue = this.masked.rawInputValue;
  }
  /** Syncronizes view from model value, fires change events */
  updateControl(t) {
    const e = this.masked.unmaskedValue, s = this.masked.value, i = this.masked.rawInputValue, n = this.displayValue, u = this.unmaskedValue !== e || this.value !== s || this._rawInputValue !== i;
    this._unmaskedValue = e, this._value = s, this._rawInputValue = i, this.el.value !== n && (this.el.value = n), t === "auto" ? this.alignCursor() : t != null && (this.cursorPos = t), u && this._fireChangeEvents(), !this._historyChanging && (u || this.history.isEmpty) && this.history.push({
      unmaskedValue: e,
      selection: {
        start: this.selectionStart,
        end: this.cursorPos
      }
    });
  }
  /** Updates options with deep equal check, recreates {@link Masked} model if mask type changes */
  updateOptions(t) {
    const {
      mask: e,
      ...s
    } = t, i = !this.maskEquals(e), n = this.masked.optionsIsChanged(s);
    i && (this.mask = e), n && this.masked.updateOptions(s), (i || n) && this.updateControl();
  }
  /** Updates cursor */
  updateCursor(t) {
    t != null && (this.cursorPos = t, this._delayUpdateCursor(t));
  }
  /** Delays cursor update to support mobile browsers */
  _delayUpdateCursor(t) {
    this._abortUpdateCursor(), this._changingCursorPos = t, this._cursorChanging = setTimeout(() => {
      this.el && (this.cursorPos = this._changingCursorPos, this._abortUpdateCursor());
    }, 10);
  }
  /** Fires custom events */
  _fireChangeEvents() {
    this._fireEvent("accept", this._inputEvent), this.masked.isComplete && this._fireEvent("complete", this._inputEvent);
  }
  /** Aborts delayed cursor update */
  _abortUpdateCursor() {
    this._cursorChanging && (clearTimeout(this._cursorChanging), delete this._cursorChanging);
  }
  /** Aligns cursor to nearest available position */
  alignCursor() {
    this.cursorPos = this.masked.nearestInputPos(this.masked.nearestInputPos(this.cursorPos, l.LEFT));
  }
  /** Aligns cursor only if selection is empty */
  alignCursorFriendly() {
    this.selectionStart === this.cursorPos && this.alignCursor();
  }
  /** Adds listener on custom event */
  on(t, e) {
    return this._listeners[t] || (this._listeners[t] = []), this._listeners[t].push(e), this;
  }
  /** Removes custom event listener */
  off(t, e) {
    if (!this._listeners[t]) return this;
    if (!e)
      return delete this._listeners[t], this;
    const s = this._listeners[t].indexOf(e);
    return s >= 0 && this._listeners[t].splice(s, 1), this;
  }
  /** Handles view input event */
  _onInput(t) {
    this._inputEvent = t, this._abortUpdateCursor();
    const e = new J({
      // new state
      value: this.el.value,
      cursorPos: this.cursorPos,
      // old state
      oldValue: this.displayValue,
      oldSelection: this._selection
    }), s = this.masked.rawInputValue, i = this.masked.splice(e.startChangePos, e.removed.length, e.inserted, e.removeDirection, {
      input: !0,
      raw: !0
    }).offset, n = s === this.masked.rawInputValue ? e.removeDirection : l.NONE;
    let u = this.masked.nearestInputPos(e.startChangePos + i, n);
    n !== l.NONE && (u = this.masked.nearestInputPos(u, l.NONE)), this.updateControl(u), delete this._inputEvent;
  }
  /** Handles view change event and commits model value */
  _onChange() {
    this.displayValue !== this.el.value && this.updateValue(), this.masked.doCommit(), this.updateControl(), this._saveSelection();
  }
  /** Handles view drop event, prevents by default */
  _onDrop(t) {
    t.preventDefault(), t.stopPropagation();
  }
  /** Restore last selection on focus */
  _onFocus(t) {
    this.alignCursorFriendly();
  }
  /** Restore last selection on focus */
  _onClick(t) {
    this.alignCursorFriendly();
  }
  _onUndo() {
    this._applyHistoryState(this.history.undo());
  }
  _onRedo() {
    this._applyHistoryState(this.history.redo());
  }
  _applyHistoryState(t) {
    t && (this._historyChanging = !0, this.unmaskedValue = t.unmaskedValue, this.el.select(t.selection.start, t.selection.end), this._saveSelection(), this._historyChanging = !1);
  }
  /** Unbind view events and removes element reference */
  destroy() {
    this._unbindEvents(), this._listeners.length = 0, delete this.el;
  }
}
d.InputMask = et;
class p {
  /** Inserted symbols */
  /** Additional offset if any changes occurred before tail */
  /** Raw inserted is used by dynamic mask */
  /** Can skip chars */
  static normalize(t) {
    return Array.isArray(t) ? t : [t, new p()];
  }
  constructor(t) {
    Object.assign(this, {
      inserted: "",
      rawInserted: "",
      tailShift: 0,
      skip: !1
    }, t);
  }
  /** Aggregate changes */
  aggregate(t) {
    return this.inserted += t.inserted, this.rawInserted += t.rawInserted, this.tailShift += t.tailShift, this.skip = this.skip || t.skip, this;
  }
  /** Total offset considering all changes */
  get offset() {
    return this.tailShift + this.inserted.length;
  }
  get consumed() {
    return !!this.rawInserted || this.skip;
  }
  equals(t) {
    return this.inserted === t.inserted && this.tailShift === t.tailShift && this.rawInserted === t.rawInserted && this.skip === t.skip;
  }
}
d.ChangeDetails = p;
class E {
  /** Tail value as string */
  /** Tail start position */
  /** Start position */
  constructor(t, e, s) {
    t === void 0 && (t = ""), e === void 0 && (e = 0), this.value = t, this.from = e, this.stop = s;
  }
  toString() {
    return this.value;
  }
  extend(t) {
    this.value += String(t);
  }
  appendTo(t) {
    return t.append(this.toString(), {
      tail: !0
    }).aggregate(t._appendPlaceholder());
  }
  get state() {
    return {
      value: this.value,
      from: this.from,
      stop: this.stop
    };
  }
  set state(t) {
    Object.assign(this, t);
  }
  unshift(t) {
    if (!this.value.length || t != null && this.from >= t) return "";
    const e = this.value[0];
    return this.value = this.value.slice(1), e;
  }
  shift() {
    if (!this.value.length) return "";
    const t = this.value[this.value.length - 1];
    return this.value = this.value.slice(0, -1), t;
  }
}
class k {
  /** */
  /** */
  /** Transforms value before mask processing */
  /** Transforms each char before mask processing */
  /** Validates if value is acceptable */
  /** Does additional processing at the end of editing */
  /** Format typed value to string */
  /** Parse string to get typed value */
  /** Enable characters overwriting */
  /** */
  /** */
  /** */
  /** */
  constructor(t) {
    this._value = "", this._update({
      ...k.DEFAULTS,
      ...t
    }), this._initialized = !0;
  }
  /** Sets and applies new options */
  updateOptions(t) {
    this.optionsIsChanged(t) && this.withValueRefresh(this._update.bind(this, t));
  }
  /** Sets new options */
  _update(t) {
    Object.assign(this, t);
  }
  /** Mask state */
  get state() {
    return {
      _value: this.value,
      _rawInputValue: this.rawInputValue
    };
  }
  set state(t) {
    this._value = t._value;
  }
  /** Resets value */
  reset() {
    this._value = "";
  }
  get value() {
    return this._value;
  }
  set value(t) {
    this.resolve(t, {
      input: !0
    });
  }
  /** Resolve new value */
  resolve(t, e) {
    e === void 0 && (e = {
      input: !0
    }), this.reset(), this.append(t, e, ""), this.doCommit();
  }
  get unmaskedValue() {
    return this.value;
  }
  set unmaskedValue(t) {
    this.resolve(t, {});
  }
  get typedValue() {
    return this.parse ? this.parse(this.value, this) : this.unmaskedValue;
  }
  set typedValue(t) {
    this.format ? this.value = this.format(t, this) : this.unmaskedValue = String(t);
  }
  /** Value that includes raw user input */
  get rawInputValue() {
    return this.extractInput(0, this.displayValue.length, {
      raw: !0
    });
  }
  set rawInputValue(t) {
    this.resolve(t, {
      raw: !0
    });
  }
  get displayValue() {
    return this.value;
  }
  get isComplete() {
    return !0;
  }
  get isFilled() {
    return this.isComplete;
  }
  /** Finds nearest input position in direction */
  nearestInputPos(t, e) {
    return t;
  }
  totalInputPositions(t, e) {
    return t === void 0 && (t = 0), e === void 0 && (e = this.displayValue.length), Math.min(this.displayValue.length, e - t);
  }
  /** Extracts value in range considering flags */
  extractInput(t, e, s) {
    return t === void 0 && (t = 0), e === void 0 && (e = this.displayValue.length), this.displayValue.slice(t, e);
  }
  /** Extracts tail in range */
  extractTail(t, e) {
    return t === void 0 && (t = 0), e === void 0 && (e = this.displayValue.length), new E(this.extractInput(t, e), t);
  }
  /** Appends tail */
  appendTail(t) {
    return F(t) && (t = new E(String(t))), t.appendTo(this);
  }
  /** Appends char */
  _appendCharRaw(t, e) {
    return t ? (this._value += t, new p({
      inserted: t,
      rawInserted: t
    })) : new p();
  }
  /** Appends char */
  _appendChar(t, e, s) {
    e === void 0 && (e = {});
    const i = this.state;
    let n;
    if ([t, n] = this.doPrepareChar(t, e), t && (n = n.aggregate(this._appendCharRaw(t, e)), !n.rawInserted && this.autofix === "pad")) {
      const u = this.state;
      this.state = i;
      let r = this.pad(e);
      const h = this._appendCharRaw(t, e);
      r = r.aggregate(h), h.rawInserted || r.equals(n) ? n = r : this.state = u;
    }
    if (n.inserted) {
      let u, r = this.doValidate(e) !== !1;
      if (r && s != null) {
        const h = this.state;
        if (this.overwrite === !0) {
          u = s.state;
          for (let c = 0; c < n.rawInserted.length; ++c)
            s.unshift(this.displayValue.length - n.tailShift);
        }
        let o = this.appendTail(s);
        if (r = o.rawInserted.length === s.toString().length, !(r && o.inserted) && this.overwrite === "shift") {
          this.state = h, u = s.state;
          for (let c = 0; c < n.rawInserted.length; ++c)
            s.shift();
          o = this.appendTail(s), r = o.rawInserted.length === s.toString().length;
        }
        r && o.inserted && (this.state = h);
      }
      r || (n = new p(), this.state = i, s && u && (s.state = u));
    }
    return n;
  }
  /** Appends optional placeholder at the end */
  _appendPlaceholder() {
    return new p();
  }
  /** Appends optional eager placeholder at the end */
  _appendEager() {
    return new p();
  }
  /** Appends symbols considering flags */
  append(t, e, s) {
    if (!F(t)) throw new Error("value should be string");
    const i = F(s) ? new E(String(s)) : s;
    e != null && e.tail && (e._beforeTailState = this.state);
    let n;
    [t, n] = this.doPrepare(t, e);
    for (let u = 0; u < t.length; ++u) {
      const r = this._appendChar(t[u], e, i);
      if (!r.rawInserted && !this.doSkipInvalid(t[u], e, i)) break;
      n.aggregate(r);
    }
    return (this.eager === !0 || this.eager === "append") && e != null && e.input && t && n.aggregate(this._appendEager()), i != null && (n.tailShift += this.appendTail(i).tailShift), n;
  }
  remove(t, e) {
    return t === void 0 && (t = 0), e === void 0 && (e = this.displayValue.length), this._value = this.displayValue.slice(0, t) + this.displayValue.slice(e), new p();
  }
  /** Calls function and reapplies current value */
  withValueRefresh(t) {
    if (this._refreshing || !this._initialized) return t();
    this._refreshing = !0;
    const e = this.rawInputValue, s = this.value, i = t();
    return this.rawInputValue = e, this.value && this.value !== s && s.indexOf(this.value) === 0 && (this.append(s.slice(this.displayValue.length), {}, ""), this.doCommit()), delete this._refreshing, i;
  }
  runIsolated(t) {
    if (this._isolated || !this._initialized) return t(this);
    this._isolated = !0;
    const e = this.state, s = t(this);
    return this.state = e, delete this._isolated, s;
  }
  doSkipInvalid(t, e, s) {
    return !!this.skipInvalid;
  }
  /** Prepares string before mask processing */
  doPrepare(t, e) {
    return e === void 0 && (e = {}), p.normalize(this.prepare ? this.prepare(t, this, e) : t);
  }
  /** Prepares each char before mask processing */
  doPrepareChar(t, e) {
    return e === void 0 && (e = {}), p.normalize(this.prepareChar ? this.prepareChar(t, this, e) : t);
  }
  /** Validates if value is acceptable */
  doValidate(t) {
    return (!this.validate || this.validate(this.value, this, t)) && (!this.parent || this.parent.doValidate(t));
  }
  /** Does additional processing at the end of editing */
  doCommit() {
    this.commit && this.commit(this.value, this);
  }
  splice(t, e, s, i, n) {
    s === void 0 && (s = ""), i === void 0 && (i = l.NONE), n === void 0 && (n = {
      input: !0
    });
    const u = t + e, r = this.extractTail(u), h = this.eager === !0 || this.eager === "remove";
    let o;
    h && (i = W(i), o = this.extractInput(0, u, {
      raw: !0
    }));
    let c = t;
    const f = new p();
    if (i !== l.NONE && (c = this.nearestInputPos(t, e > 1 && t !== 0 && !h ? l.NONE : i), f.tailShift = c - t), f.aggregate(this.remove(c)), h && i !== l.NONE && o === this.rawInputValue)
      if (i === l.FORCE_LEFT) {
        let _;
        for (; o === this.rawInputValue && (_ = this.displayValue.length); )
          f.aggregate(new p({
            tailShift: -1
          })).aggregate(this.remove(_ - 1));
      } else i === l.FORCE_RIGHT && r.unshift();
    return f.aggregate(this.append(s, n, r));
  }
  maskEquals(t) {
    return this.mask === t;
  }
  optionsIsChanged(t) {
    return !D(this, t);
  }
  typedValueEquals(t) {
    const e = this.typedValue;
    return t === e || k.EMPTY_VALUES.includes(t) && k.EMPTY_VALUES.includes(e) || (this.format ? this.format(t, this) === this.format(this.typedValue, this) : !1);
  }
  pad(t) {
    return new p();
  }
}
k.DEFAULTS = {
  skipInvalid: !0
};
k.EMPTY_VALUES = [void 0, null, ""];
d.Masked = k;
class v {
  /** */
  constructor(t, e) {
    t === void 0 && (t = []), e === void 0 && (e = 0), this.chunks = t, this.from = e;
  }
  toString() {
    return this.chunks.map(String).join("");
  }
  extend(t) {
    if (!String(t)) return;
    t = F(t) ? new E(String(t)) : t;
    const e = this.chunks[this.chunks.length - 1], s = e && // if stops are same or tail has no stop
    (e.stop === t.stop || t.stop == null) && // if tail chunk goes just after last chunk
    t.from === e.from + e.toString().length;
    if (t instanceof E)
      s ? e.extend(t.toString()) : this.chunks.push(t);
    else if (t instanceof v) {
      if (t.stop == null) {
        let i;
        for (; t.chunks.length && t.chunks[0].stop == null; )
          i = t.chunks.shift(), i.from += t.from, this.extend(i);
      }
      t.toString() && (t.stop = t.blockIndex, this.chunks.push(t));
    }
  }
  appendTo(t) {
    if (!(t instanceof d.MaskedPattern))
      return new E(this.toString()).appendTo(t);
    const e = new p();
    for (let s = 0; s < this.chunks.length; ++s) {
      const i = this.chunks[s], n = t._mapPosToBlock(t.displayValue.length), u = i.stop;
      let r;
      if (u != null && // if block not found or stop is behind lastBlock
      (!n || n.index <= u) && ((i instanceof v || // for continuous block also check if stop is exist
      t._stops.indexOf(u) >= 0) && e.aggregate(t._appendPlaceholder(u)), r = i instanceof v && t._blocks[u]), r) {
        const h = r.appendTail(i);
        e.aggregate(h);
        const o = i.toString().slice(h.rawInserted.length);
        o && e.aggregate(t.append(o, {
          tail: !0
        }));
      } else
        e.aggregate(t.append(i.toString(), {
          tail: !0
        }));
    }
    return e;
  }
  get state() {
    return {
      chunks: this.chunks.map((t) => t.state),
      from: this.from,
      stop: this.stop,
      blockIndex: this.blockIndex
    };
  }
  set state(t) {
    const {
      chunks: e,
      ...s
    } = t;
    Object.assign(this, s), this.chunks = e.map((i) => {
      const n = "chunks" in i ? new v() : new E();
      return n.state = i, n;
    });
  }
  unshift(t) {
    if (!this.chunks.length || t != null && this.from >= t) return "";
    const e = t != null ? t - this.from : t;
    let s = 0;
    for (; s < this.chunks.length; ) {
      const i = this.chunks[s], n = i.unshift(e);
      if (i.toString()) {
        if (!n) break;
        ++s;
      } else
        this.chunks.splice(s, 1);
      if (n) return n;
    }
    return "";
  }
  shift() {
    if (!this.chunks.length) return "";
    let t = this.chunks.length - 1;
    for (; 0 <= t; ) {
      const e = this.chunks[t], s = e.shift();
      if (e.toString()) {
        if (!s) break;
        --t;
      } else
        this.chunks.splice(t, 1);
      if (s) return s;
    }
    return "";
  }
}
class st {
  constructor(t, e) {
    this.masked = t, this._log = [];
    const {
      offset: s,
      index: i
    } = t._mapPosToBlock(e) || (e < 0 ? (
      // first
      {
        index: 0,
        offset: 0
      }
    ) : (
      // last
      {
        index: this.masked._blocks.length,
        offset: 0
      }
    ));
    this.offset = s, this.index = i, this.ok = !1;
  }
  get block() {
    return this.masked._blocks[this.index];
  }
  get pos() {
    return this.masked._blockStartPos(this.index) + this.offset;
  }
  get state() {
    return {
      index: this.index,
      offset: this.offset,
      ok: this.ok
    };
  }
  set state(t) {
    Object.assign(this, t);
  }
  pushState() {
    this._log.push(this.state);
  }
  popState() {
    const t = this._log.pop();
    return t && (this.state = t), t;
  }
  bindBlock() {
    this.block || (this.index < 0 && (this.index = 0, this.offset = 0), this.index >= this.masked._blocks.length && (this.index = this.masked._blocks.length - 1, this.offset = this.block.displayValue.length));
  }
  _pushLeft(t) {
    for (this.pushState(), this.bindBlock(); 0 <= this.index; --this.index, this.offset = ((e = this.block) == null ? void 0 : e.displayValue.length) || 0) {
      var e;
      if (t()) return this.ok = !0;
    }
    return this.ok = !1;
  }
  _pushRight(t) {
    for (this.pushState(), this.bindBlock(); this.index < this.masked._blocks.length; ++this.index, this.offset = 0)
      if (t()) return this.ok = !0;
    return this.ok = !1;
  }
  pushLeftBeforeFilled() {
    return this._pushLeft(() => {
      if (!(this.block.isFixed || !this.block.value) && (this.offset = this.block.nearestInputPos(this.offset, l.FORCE_LEFT), this.offset !== 0))
        return !0;
    });
  }
  pushLeftBeforeInput() {
    return this._pushLeft(() => {
      if (!this.block.isFixed)
        return this.offset = this.block.nearestInputPos(this.offset, l.LEFT), !0;
    });
  }
  pushLeftBeforeRequired() {
    return this._pushLeft(() => {
      if (!(this.block.isFixed || this.block.isOptional && !this.block.value))
        return this.offset = this.block.nearestInputPos(this.offset, l.LEFT), !0;
    });
  }
  pushRightBeforeFilled() {
    return this._pushRight(() => {
      if (!(this.block.isFixed || !this.block.value) && (this.offset = this.block.nearestInputPos(this.offset, l.FORCE_RIGHT), this.offset !== this.block.value.length))
        return !0;
    });
  }
  pushRightBeforeInput() {
    return this._pushRight(() => {
      if (!this.block.isFixed)
        return this.offset = this.block.nearestInputPos(this.offset, l.NONE), !0;
    });
  }
  pushRightBeforeRequired() {
    return this._pushRight(() => {
      if (!(this.block.isFixed || this.block.isOptional && !this.block.value))
        return this.offset = this.block.nearestInputPos(this.offset, l.NONE), !0;
    });
  }
}
class j {
  /** */
  /** */
  /** */
  /** */
  /** */
  /** */
  constructor(t) {
    Object.assign(this, t), this._value = "", this.isFixed = !0;
  }
  get value() {
    return this._value;
  }
  get unmaskedValue() {
    return this.isUnmasking ? this.value : "";
  }
  get rawInputValue() {
    return this._isRawInput ? this.value : "";
  }
  get displayValue() {
    return this.value;
  }
  reset() {
    this._isRawInput = !1, this._value = "";
  }
  remove(t, e) {
    return t === void 0 && (t = 0), e === void 0 && (e = this._value.length), this._value = this._value.slice(0, t) + this._value.slice(e), this._value || (this._isRawInput = !1), new p();
  }
  nearestInputPos(t, e) {
    e === void 0 && (e = l.NONE);
    const s = 0, i = this._value.length;
    switch (e) {
      case l.LEFT:
      case l.FORCE_LEFT:
        return s;
      case l.NONE:
      case l.RIGHT:
      case l.FORCE_RIGHT:
      default:
        return i;
    }
  }
  totalInputPositions(t, e) {
    return t === void 0 && (t = 0), e === void 0 && (e = this._value.length), this._isRawInput ? e - t : 0;
  }
  extractInput(t, e, s) {
    return t === void 0 && (t = 0), e === void 0 && (e = this._value.length), s === void 0 && (s = {}), s.raw && this._isRawInput && this._value.slice(t, e) || "";
  }
  get isComplete() {
    return !0;
  }
  get isFilled() {
    return !!this._value;
  }
  _appendChar(t, e) {
    if (e === void 0 && (e = {}), this.isFilled) return new p();
    const s = this.eager === !0 || this.eager === "append", n = this.char === t && (this.isUnmasking || e.input || e.raw) && (!e.raw || !s) && !e.tail, u = new p({
      inserted: this.char,
      rawInserted: n ? this.char : ""
    });
    return this._value = this.char, this._isRawInput = n && (e.raw || e.input), u;
  }
  _appendEager() {
    return this._appendChar(this.char, {
      tail: !0
    });
  }
  _appendPlaceholder() {
    const t = new p();
    return this.isFilled || (this._value = t.inserted = this.char), t;
  }
  extractTail() {
    return new E("");
  }
  appendTail(t) {
    return F(t) && (t = new E(String(t))), t.appendTo(this);
  }
  append(t, e, s) {
    const i = this._appendChar(t[0], e);
    return s != null && (i.tailShift += this.appendTail(s).tailShift), i;
  }
  doCommit() {
  }
  get state() {
    return {
      _value: this._value,
      _rawInputValue: this.rawInputValue
    };
  }
  set state(t) {
    this._value = t._value, this._isRawInput = !!t._rawInputValue;
  }
  pad(t) {
    return this._appendPlaceholder();
  }
}
class y {
  /** */
  /** */
  /** */
  /** */
  /** */
  /** */
  /** */
  /** */
  constructor(t) {
    const {
      parent: e,
      isOptional: s,
      placeholderChar: i,
      displayChar: n,
      lazy: u,
      eager: r,
      ...h
    } = t;
    this.masked = A(h), Object.assign(this, {
      parent: e,
      isOptional: s,
      placeholderChar: i,
      displayChar: n,
      lazy: u,
      eager: r
    });
  }
  reset() {
    this.isFilled = !1, this.masked.reset();
  }
  remove(t, e) {
    return t === void 0 && (t = 0), e === void 0 && (e = this.value.length), t === 0 && e >= 1 ? (this.isFilled = !1, this.masked.remove(t, e)) : new p();
  }
  get value() {
    return this.masked.value || (this.isFilled && !this.isOptional ? this.placeholderChar : "");
  }
  get unmaskedValue() {
    return this.masked.unmaskedValue;
  }
  get rawInputValue() {
    return this.masked.rawInputValue;
  }
  get displayValue() {
    return this.masked.value && this.displayChar || this.value;
  }
  get isComplete() {
    return !!this.masked.value || this.isOptional;
  }
  _appendChar(t, e) {
    if (e === void 0 && (e = {}), this.isFilled) return new p();
    const s = this.masked.state;
    let i = this.masked._appendChar(t, this.currentMaskFlags(e));
    return i.inserted && this.doValidate(e) === !1 && (i = new p(), this.masked.state = s), !i.inserted && !this.isOptional && !this.lazy && !e.input && (i.inserted = this.placeholderChar), i.skip = !i.inserted && !this.isOptional, this.isFilled = !!i.inserted, i;
  }
  append(t, e, s) {
    return this.masked.append(t, this.currentMaskFlags(e), s);
  }
  _appendPlaceholder() {
    return this.isFilled || this.isOptional ? new p() : (this.isFilled = !0, new p({
      inserted: this.placeholderChar
    }));
  }
  _appendEager() {
    return new p();
  }
  extractTail(t, e) {
    return this.masked.extractTail(t, e);
  }
  appendTail(t) {
    return this.masked.appendTail(t);
  }
  extractInput(t, e, s) {
    return t === void 0 && (t = 0), e === void 0 && (e = this.value.length), this.masked.extractInput(t, e, s);
  }
  nearestInputPos(t, e) {
    e === void 0 && (e = l.NONE);
    const s = 0, i = this.value.length, n = Math.min(Math.max(t, s), i);
    switch (e) {
      case l.LEFT:
      case l.FORCE_LEFT:
        return this.isComplete ? n : s;
      case l.RIGHT:
      case l.FORCE_RIGHT:
        return this.isComplete ? n : i;
      case l.NONE:
      default:
        return n;
    }
  }
  totalInputPositions(t, e) {
    return t === void 0 && (t = 0), e === void 0 && (e = this.value.length), this.value.slice(t, e).length;
  }
  doValidate(t) {
    return this.masked.doValidate(this.currentMaskFlags(t)) && (!this.parent || this.parent.doValidate(this.currentMaskFlags(t)));
  }
  doCommit() {
    this.masked.doCommit();
  }
  get state() {
    return {
      _value: this.value,
      _rawInputValue: this.rawInputValue,
      masked: this.masked.state,
      isFilled: this.isFilled
    };
  }
  set state(t) {
    this.masked.state = t.masked, this.isFilled = t.isFilled;
  }
  currentMaskFlags(t) {
    var e;
    return {
      ...t,
      _beforeTailState: (t == null || (e = t._beforeTailState) == null ? void 0 : e.masked) || (t == null ? void 0 : t._beforeTailState)
    };
  }
  pad(t) {
    return new p();
  }
}
y.DEFAULT_DEFINITIONS = {
  0: /\d/,
  a: /[\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/,
  // http://stackoverflow.com/a/22075070
  "*": /./
};
class it extends k {
  /** */
  /** Enable characters overwriting */
  /** */
  /** */
  /** */
  updateOptions(t) {
    super.updateOptions(t);
  }
  _update(t) {
    const e = t.mask;
    e && (t.validate = (s) => s.search(e) >= 0), super._update(t);
  }
}
d.MaskedRegExp = it;
class g extends k {
  /** */
  /** */
  /** Single char for empty input */
  /** Single char for filled input */
  /** Show placeholder only when needed */
  /** Enable characters overwriting */
  /** */
  /** */
  /** */
  constructor(t) {
    super({
      ...g.DEFAULTS,
      ...t,
      definitions: Object.assign({}, y.DEFAULT_DEFINITIONS, t == null ? void 0 : t.definitions)
    });
  }
  updateOptions(t) {
    super.updateOptions(t);
  }
  _update(t) {
    t.definitions = Object.assign({}, this.definitions, t.definitions), super._update(t), this._rebuildMask();
  }
  _rebuildMask() {
    const t = this.definitions;
    this._blocks = [], this.exposeBlock = void 0, this._stops = [], this._maskedBlocks = {};
    const e = this.mask;
    if (!e || !t) return;
    let s = !1, i = !1;
    for (let n = 0; n < e.length; ++n) {
      if (this.blocks) {
        const o = e.slice(n), c = Object.keys(this.blocks).filter((_) => o.indexOf(_) === 0);
        c.sort((_, S) => S.length - _.length);
        const f = c[0];
        if (f) {
          const {
            expose: _,
            repeat: S,
            ...X
          } = B(this.blocks[f]), U = {
            lazy: this.lazy,
            eager: this.eager,
            placeholderChar: this.placeholderChar,
            displayChar: this.displayChar,
            overwrite: this.overwrite,
            autofix: this.autofix,
            ...X,
            repeat: S,
            parent: this
          }, T = S != null ? new d.RepeatBlock(
            U
            /* TODO */
          ) : A(U);
          T && (this._blocks.push(T), _ && (this.exposeBlock = T), this._maskedBlocks[f] || (this._maskedBlocks[f] = []), this._maskedBlocks[f].push(this._blocks.length - 1)), n += f.length - 1;
          continue;
        }
      }
      let u = e[n], r = u in t;
      if (u === g.STOP_CHAR) {
        this._stops.push(this._blocks.length);
        continue;
      }
      if (u === "{" || u === "}") {
        s = !s;
        continue;
      }
      if (u === "[" || u === "]") {
        i = !i;
        continue;
      }
      if (u === g.ESCAPE_CHAR) {
        if (++n, u = e[n], !u) break;
        r = !1;
      }
      const h = r ? new y({
        isOptional: i,
        lazy: this.lazy,
        eager: this.eager,
        placeholderChar: this.placeholderChar,
        displayChar: this.displayChar,
        ...B(t[u]),
        parent: this
      }) : new j({
        char: u,
        eager: this.eager,
        isUnmasking: s
      });
      this._blocks.push(h);
    }
  }
  get state() {
    return {
      ...super.state,
      _blocks: this._blocks.map((t) => t.state)
    };
  }
  set state(t) {
    if (!t) {
      this.reset();
      return;
    }
    const {
      _blocks: e,
      ...s
    } = t;
    this._blocks.forEach((i, n) => i.state = e[n]), super.state = s;
  }
  reset() {
    super.reset(), this._blocks.forEach((t) => t.reset());
  }
  get isComplete() {
    return this.exposeBlock ? this.exposeBlock.isComplete : this._blocks.every((t) => t.isComplete);
  }
  get isFilled() {
    return this._blocks.every((t) => t.isFilled);
  }
  get isFixed() {
    return this._blocks.every((t) => t.isFixed);
  }
  get isOptional() {
    return this._blocks.every((t) => t.isOptional);
  }
  doCommit() {
    this._blocks.forEach((t) => t.doCommit()), super.doCommit();
  }
  get unmaskedValue() {
    return this.exposeBlock ? this.exposeBlock.unmaskedValue : this._blocks.reduce((t, e) => t += e.unmaskedValue, "");
  }
  set unmaskedValue(t) {
    if (this.exposeBlock) {
      const e = this.extractTail(this._blockStartPos(this._blocks.indexOf(this.exposeBlock)) + this.exposeBlock.displayValue.length);
      this.exposeBlock.unmaskedValue = t, this.appendTail(e), this.doCommit();
    } else super.unmaskedValue = t;
  }
  get value() {
    return this.exposeBlock ? this.exposeBlock.value : (
      // TODO return _value when not in change?
      this._blocks.reduce((t, e) => t += e.value, "")
    );
  }
  set value(t) {
    if (this.exposeBlock) {
      const e = this.extractTail(this._blockStartPos(this._blocks.indexOf(this.exposeBlock)) + this.exposeBlock.displayValue.length);
      this.exposeBlock.value = t, this.appendTail(e), this.doCommit();
    } else super.value = t;
  }
  get typedValue() {
    return this.exposeBlock ? this.exposeBlock.typedValue : super.typedValue;
  }
  set typedValue(t) {
    if (this.exposeBlock) {
      const e = this.extractTail(this._blockStartPos(this._blocks.indexOf(this.exposeBlock)) + this.exposeBlock.displayValue.length);
      this.exposeBlock.typedValue = t, this.appendTail(e), this.doCommit();
    } else super.typedValue = t;
  }
  get displayValue() {
    return this._blocks.reduce((t, e) => t += e.displayValue, "");
  }
  appendTail(t) {
    return super.appendTail(t).aggregate(this._appendPlaceholder());
  }
  _appendEager() {
    var t;
    const e = new p();
    let s = (t = this._mapPosToBlock(this.displayValue.length)) == null ? void 0 : t.index;
    if (s == null) return e;
    this._blocks[s].isFilled && ++s;
    for (let i = s; i < this._blocks.length; ++i) {
      const n = this._blocks[i]._appendEager();
      if (!n.inserted) break;
      e.aggregate(n);
    }
    return e;
  }
  _appendCharRaw(t, e) {
    e === void 0 && (e = {});
    const s = this._mapPosToBlock(this.displayValue.length), i = new p();
    if (!s) return i;
    for (let u = s.index, r; r = this._blocks[u]; ++u) {
      var n;
      const h = r._appendChar(t, {
        ...e,
        _beforeTailState: (n = e._beforeTailState) == null || (n = n._blocks) == null ? void 0 : n[u]
      });
      if (i.aggregate(h), h.consumed) break;
    }
    return i;
  }
  extractTail(t, e) {
    t === void 0 && (t = 0), e === void 0 && (e = this.displayValue.length);
    const s = new v();
    return t === e || this._forEachBlocksInRange(t, e, (i, n, u, r) => {
      const h = i.extractTail(u, r);
      h.stop = this._findStopBefore(n), h.from = this._blockStartPos(n), h instanceof v && (h.blockIndex = n), s.extend(h);
    }), s;
  }
  extractInput(t, e, s) {
    if (t === void 0 && (t = 0), e === void 0 && (e = this.displayValue.length), s === void 0 && (s = {}), t === e) return "";
    let i = "";
    return this._forEachBlocksInRange(t, e, (n, u, r, h) => {
      i += n.extractInput(r, h, s);
    }), i;
  }
  _findStopBefore(t) {
    let e;
    for (let s = 0; s < this._stops.length; ++s) {
      const i = this._stops[s];
      if (i <= t) e = i;
      else break;
    }
    return e;
  }
  /** Appends placeholder depending on laziness */
  _appendPlaceholder(t) {
    const e = new p();
    if (this.lazy && t == null) return e;
    const s = this._mapPosToBlock(this.displayValue.length);
    if (!s) return e;
    const i = s.index, n = t ?? this._blocks.length;
    return this._blocks.slice(i, n).forEach((u) => {
      if (!u.lazy || t != null) {
        var r;
        e.aggregate(u._appendPlaceholder((r = u._blocks) == null ? void 0 : r.length));
      }
    }), e;
  }
  /** Finds block in pos */
  _mapPosToBlock(t) {
    let e = "";
    for (let s = 0; s < this._blocks.length; ++s) {
      const i = this._blocks[s], n = e.length;
      if (e += i.displayValue, t <= e.length)
        return {
          index: s,
          offset: t - n
        };
    }
  }
  _blockStartPos(t) {
    return this._blocks.slice(0, t).reduce((e, s) => e += s.displayValue.length, 0);
  }
  _forEachBlocksInRange(t, e, s) {
    e === void 0 && (e = this.displayValue.length);
    const i = this._mapPosToBlock(t);
    if (i) {
      const n = this._mapPosToBlock(e), u = n && i.index === n.index, r = i.offset, h = n && u ? n.offset : this._blocks[i.index].displayValue.length;
      if (s(this._blocks[i.index], i.index, r, h), n && !u) {
        for (let o = i.index + 1; o < n.index; ++o)
          s(this._blocks[o], o, 0, this._blocks[o].displayValue.length);
        s(this._blocks[n.index], n.index, 0, n.offset);
      }
    }
  }
  remove(t, e) {
    t === void 0 && (t = 0), e === void 0 && (e = this.displayValue.length);
    const s = super.remove(t, e);
    return this._forEachBlocksInRange(t, e, (i, n, u, r) => {
      s.aggregate(i.remove(u, r));
    }), s;
  }
  nearestInputPos(t, e) {
    if (e === void 0 && (e = l.NONE), !this._blocks.length) return 0;
    const s = new st(this, t);
    if (e === l.NONE)
      return s.pushRightBeforeInput() || (s.popState(), s.pushLeftBeforeInput()) ? s.pos : this.displayValue.length;
    if (e === l.LEFT || e === l.FORCE_LEFT) {
      if (e === l.LEFT) {
        if (s.pushRightBeforeFilled(), s.ok && s.pos === t) return t;
        s.popState();
      }
      if (s.pushLeftBeforeInput(), s.pushLeftBeforeRequired(), s.pushLeftBeforeFilled(), e === l.LEFT) {
        if (s.pushRightBeforeInput(), s.pushRightBeforeRequired(), s.ok && s.pos <= t || (s.popState(), s.ok && s.pos <= t)) return s.pos;
        s.popState();
      }
      return s.ok ? s.pos : e === l.FORCE_LEFT ? 0 : (s.popState(), s.ok || (s.popState(), s.ok) ? s.pos : 0);
    }
    return e === l.RIGHT || e === l.FORCE_RIGHT ? (s.pushRightBeforeInput(), s.pushRightBeforeRequired(), s.pushRightBeforeFilled() ? s.pos : e === l.FORCE_RIGHT ? this.displayValue.length : (s.popState(), s.ok || (s.popState(), s.ok) ? s.pos : this.nearestInputPos(t, l.LEFT))) : t;
  }
  totalInputPositions(t, e) {
    t === void 0 && (t = 0), e === void 0 && (e = this.displayValue.length);
    let s = 0;
    return this._forEachBlocksInRange(t, e, (i, n, u, r) => {
      s += i.totalInputPositions(u, r);
    }), s;
  }
  /** Get block by name */
  maskedBlock(t) {
    return this.maskedBlocks(t)[0];
  }
  /** Get all blocks by name */
  maskedBlocks(t) {
    const e = this._maskedBlocks[t];
    return e ? e.map((s) => this._blocks[s]) : [];
  }
  pad(t) {
    const e = new p();
    return this._forEachBlocksInRange(0, this.displayValue.length, (s) => e.aggregate(s.pad(t))), e;
  }
}
g.DEFAULTS = {
  ...k.DEFAULTS,
  lazy: !0,
  placeholderChar: "_"
};
g.STOP_CHAR = "`";
g.ESCAPE_CHAR = "\\";
g.InputDefinition = y;
g.FixedDefinition = j;
d.MaskedPattern = g;
class I extends g {
  /**
    Optionally sets max length of pattern.
    Used when pattern length is longer then `to` param length. Pads zeros at start in this case.
  */
  /** Min bound */
  /** Max bound */
  get _matchFrom() {
    return this.maxLength - String(this.from).length;
  }
  constructor(t) {
    super(t);
  }
  updateOptions(t) {
    super.updateOptions(t);
  }
  _update(t) {
    const {
      to: e = this.to || 0,
      from: s = this.from || 0,
      maxLength: i = this.maxLength || 0,
      autofix: n = this.autofix,
      ...u
    } = t;
    this.to = e, this.from = s, this.maxLength = Math.max(String(e).length, i), this.autofix = n;
    const r = String(this.from).padStart(this.maxLength, "0"), h = String(this.to).padStart(this.maxLength, "0");
    let o = 0;
    for (; o < h.length && h[o] === r[o]; ) ++o;
    u.mask = h.slice(0, o).replace(/0/g, "\\0") + "0".repeat(this.maxLength - o), super._update(u);
  }
  get isComplete() {
    return super.isComplete && !!this.value;
  }
  boundaries(t) {
    let e = "", s = "";
    const [, i, n] = t.match(/^(\D*)(\d*)(\D*)/) || [];
    return n && (e = "0".repeat(i.length) + n, s = "9".repeat(i.length) + n), e = e.padEnd(this.maxLength, "0"), s = s.padEnd(this.maxLength, "9"), [e, s];
  }
  doPrepareChar(t, e) {
    e === void 0 && (e = {});
    let s;
    return [t, s] = super.doPrepareChar(t.replace(/\D/g, ""), e), t || (s.skip = !this.isComplete), [t, s];
  }
  _appendCharRaw(t, e) {
    if (e === void 0 && (e = {}), !this.autofix || this.value.length + 1 > this.maxLength) return super._appendCharRaw(t, e);
    const s = String(this.from).padStart(this.maxLength, "0"), i = String(this.to).padStart(this.maxLength, "0"), [n, u] = this.boundaries(this.value + t);
    return Number(u) < this.from ? super._appendCharRaw(s[this.value.length], e) : Number(n) > this.to ? !e.tail && this.autofix === "pad" && this.value.length + 1 < this.maxLength ? super._appendCharRaw(s[this.value.length], e).aggregate(this._appendCharRaw(t, e)) : super._appendCharRaw(i[this.value.length], e) : super._appendCharRaw(t, e);
  }
  doValidate(t) {
    const e = this.value;
    if (e.search(/[^0]/) === -1 && e.length <= this._matchFrom) return !0;
    const [i, n] = this.boundaries(e);
    return this.from <= Number(n) && Number(i) <= this.to && super.doValidate(t);
  }
  pad(t) {
    const e = new p();
    if (this.value.length === this.maxLength) return e;
    const s = this.value, i = this.maxLength - this.value.length;
    if (i) {
      this.reset();
      for (let n = 0; n < i; ++n)
        e.aggregate(super._appendCharRaw("0", t));
      s.split("").forEach((n) => this._appendCharRaw(n));
    }
    return e;
  }
}
d.MaskedRange = I;
const nt = "d{.}`m{.}`Y";
class C extends g {
  static extractPatternOptions(t) {
    const {
      mask: e,
      pattern: s,
      ...i
    } = t;
    return {
      ...i,
      mask: F(e) ? e : s
    };
  }
  /** Pattern mask for date according to {@link MaskedDate#format} */
  /** Start date */
  /** End date */
  /** Format typed value to string */
  /** Parse string to get typed value */
  constructor(t) {
    super(C.extractPatternOptions({
      ...C.DEFAULTS,
      ...t
    }));
  }
  updateOptions(t) {
    super.updateOptions(t);
  }
  _update(t) {
    const {
      mask: e,
      pattern: s,
      blocks: i,
      ...n
    } = {
      ...C.DEFAULTS,
      ...t
    }, u = Object.assign({}, C.GET_DEFAULT_BLOCKS());
    t.min && (u.Y.from = t.min.getFullYear()), t.max && (u.Y.to = t.max.getFullYear()), t.min && t.max && u.Y.from === u.Y.to && (u.m.from = t.min.getMonth() + 1, u.m.to = t.max.getMonth() + 1, u.m.from === u.m.to && (u.d.from = t.min.getDate(), u.d.to = t.max.getDate())), Object.assign(u, this.blocks, i), super._update({
      ...n,
      mask: F(e) ? e : s,
      blocks: u
    });
  }
  doValidate(t) {
    const e = this.date;
    return super.doValidate(t) && (!this.isComplete || this.isDateExist(this.value) && e != null && (this.min == null || this.min <= e) && (this.max == null || e <= this.max));
  }
  /** Checks if date is exists */
  isDateExist(t) {
    return this.format(this.parse(t, this), this).indexOf(t) >= 0;
  }
  /** Parsed Date */
  get date() {
    return this.typedValue;
  }
  set date(t) {
    this.typedValue = t;
  }
  get typedValue() {
    return this.isComplete ? super.typedValue : null;
  }
  set typedValue(t) {
    super.typedValue = t;
  }
  maskEquals(t) {
    return t === Date || super.maskEquals(t);
  }
  optionsIsChanged(t) {
    return super.optionsIsChanged(C.extractPatternOptions(t));
  }
}
C.GET_DEFAULT_BLOCKS = () => ({
  d: {
    mask: I,
    from: 1,
    to: 31,
    maxLength: 2
  },
  m: {
    mask: I,
    from: 1,
    to: 12,
    maxLength: 2
  },
  Y: {
    mask: I,
    from: 1900,
    to: 9999
  }
});
C.DEFAULTS = {
  ...g.DEFAULTS,
  mask: Date,
  pattern: nt,
  format: (a, t) => {
    if (!a) return "";
    const e = String(a.getDate()).padStart(2, "0"), s = String(a.getMonth() + 1).padStart(2, "0"), i = a.getFullYear();
    return [e, s, i].join(".");
  },
  parse: (a, t) => {
    const [e, s, i] = a.split(".").map(Number);
    return new Date(i, s - 1, e);
  }
};
d.MaskedDate = C;
class b extends k {
  constructor(t) {
    super({
      ...b.DEFAULTS,
      ...t
    }), this.currentMask = void 0;
  }
  updateOptions(t) {
    super.updateOptions(t);
  }
  _update(t) {
    super._update(t), "mask" in t && (this.exposeMask = void 0, this.compiledMasks = Array.isArray(t.mask) ? t.mask.map((e) => {
      const {
        expose: s,
        ...i
      } = B(e), n = A({
        overwrite: this._overwrite,
        eager: this._eager,
        skipInvalid: this._skipInvalid,
        ...i
      });
      return s && (this.exposeMask = n), n;
    }) : []);
  }
  _appendCharRaw(t, e) {
    e === void 0 && (e = {});
    const s = this._applyDispatch(t, e);
    return this.currentMask && s.aggregate(this.currentMask._appendChar(t, this.currentMaskFlags(e))), s;
  }
  _applyDispatch(t, e, s) {
    t === void 0 && (t = ""), e === void 0 && (e = {}), s === void 0 && (s = "");
    const i = e.tail && e._beforeTailState != null ? e._beforeTailState._value : this.value, n = this.rawInputValue, u = e.tail && e._beforeTailState != null ? e._beforeTailState._rawInputValue : n, r = n.slice(u.length), h = this.currentMask, o = new p(), c = h == null ? void 0 : h.state;
    return this.currentMask = this.doDispatch(t, {
      ...e
    }, s), this.currentMask && (this.currentMask !== h ? (this.currentMask.reset(), u && (this.currentMask.append(u, {
      raw: !0
    }), o.tailShift = this.currentMask.value.length - i.length), r && (o.tailShift += this.currentMask.append(r, {
      raw: !0,
      tail: !0
    }).tailShift)) : c && (this.currentMask.state = c)), o;
  }
  _appendPlaceholder() {
    const t = this._applyDispatch();
    return this.currentMask && t.aggregate(this.currentMask._appendPlaceholder()), t;
  }
  _appendEager() {
    const t = this._applyDispatch();
    return this.currentMask && t.aggregate(this.currentMask._appendEager()), t;
  }
  appendTail(t) {
    const e = new p();
    return t && e.aggregate(this._applyDispatch("", {}, t)), e.aggregate(this.currentMask ? this.currentMask.appendTail(t) : super.appendTail(t));
  }
  currentMaskFlags(t) {
    var e, s;
    return {
      ...t,
      _beforeTailState: ((e = t._beforeTailState) == null ? void 0 : e.currentMaskRef) === this.currentMask && ((s = t._beforeTailState) == null ? void 0 : s.currentMask) || t._beforeTailState
    };
  }
  doDispatch(t, e, s) {
    return e === void 0 && (e = {}), s === void 0 && (s = ""), this.dispatch(t, this, e, s);
  }
  doValidate(t) {
    return super.doValidate(t) && (!this.currentMask || this.currentMask.doValidate(this.currentMaskFlags(t)));
  }
  doPrepare(t, e) {
    e === void 0 && (e = {});
    let [s, i] = super.doPrepare(t, e);
    if (this.currentMask) {
      let n;
      [s, n] = super.doPrepare(s, this.currentMaskFlags(e)), i = i.aggregate(n);
    }
    return [s, i];
  }
  doPrepareChar(t, e) {
    e === void 0 && (e = {});
    let [s, i] = super.doPrepareChar(t, e);
    if (this.currentMask) {
      let n;
      [s, n] = super.doPrepareChar(s, this.currentMaskFlags(e)), i = i.aggregate(n);
    }
    return [s, i];
  }
  reset() {
    var t;
    (t = this.currentMask) == null || t.reset(), this.compiledMasks.forEach((e) => e.reset());
  }
  get value() {
    return this.exposeMask ? this.exposeMask.value : this.currentMask ? this.currentMask.value : "";
  }
  set value(t) {
    this.exposeMask ? (this.exposeMask.value = t, this.currentMask = this.exposeMask, this._applyDispatch()) : super.value = t;
  }
  get unmaskedValue() {
    return this.exposeMask ? this.exposeMask.unmaskedValue : this.currentMask ? this.currentMask.unmaskedValue : "";
  }
  set unmaskedValue(t) {
    this.exposeMask ? (this.exposeMask.unmaskedValue = t, this.currentMask = this.exposeMask, this._applyDispatch()) : super.unmaskedValue = t;
  }
  get typedValue() {
    return this.exposeMask ? this.exposeMask.typedValue : this.currentMask ? this.currentMask.typedValue : "";
  }
  set typedValue(t) {
    if (this.exposeMask) {
      this.exposeMask.typedValue = t, this.currentMask = this.exposeMask, this._applyDispatch();
      return;
    }
    let e = String(t);
    this.currentMask && (this.currentMask.typedValue = t, e = this.currentMask.unmaskedValue), this.unmaskedValue = e;
  }
  get displayValue() {
    return this.currentMask ? this.currentMask.displayValue : "";
  }
  get isComplete() {
    var t;
    return !!((t = this.currentMask) != null && t.isComplete);
  }
  get isFilled() {
    var t;
    return !!((t = this.currentMask) != null && t.isFilled);
  }
  remove(t, e) {
    const s = new p();
    return this.currentMask && s.aggregate(this.currentMask.remove(t, e)).aggregate(this._applyDispatch()), s;
  }
  get state() {
    var t;
    return {
      ...super.state,
      _rawInputValue: this.rawInputValue,
      compiledMasks: this.compiledMasks.map((e) => e.state),
      currentMaskRef: this.currentMask,
      currentMask: (t = this.currentMask) == null ? void 0 : t.state
    };
  }
  set state(t) {
    const {
      compiledMasks: e,
      currentMaskRef: s,
      currentMask: i,
      ...n
    } = t;
    e && this.compiledMasks.forEach((u, r) => u.state = e[r]), s != null && (this.currentMask = s, this.currentMask.state = i), super.state = n;
  }
  extractInput(t, e, s) {
    return this.currentMask ? this.currentMask.extractInput(t, e, s) : "";
  }
  extractTail(t, e) {
    return this.currentMask ? this.currentMask.extractTail(t, e) : super.extractTail(t, e);
  }
  doCommit() {
    this.currentMask && this.currentMask.doCommit(), super.doCommit();
  }
  nearestInputPos(t, e) {
    return this.currentMask ? this.currentMask.nearestInputPos(t, e) : super.nearestInputPos(t, e);
  }
  get overwrite() {
    return this.currentMask ? this.currentMask.overwrite : this._overwrite;
  }
  set overwrite(t) {
    this._overwrite = t;
  }
  get eager() {
    return this.currentMask ? this.currentMask.eager : this._eager;
  }
  set eager(t) {
    this._eager = t;
  }
  get skipInvalid() {
    return this.currentMask ? this.currentMask.skipInvalid : this._skipInvalid;
  }
  set skipInvalid(t) {
    this._skipInvalid = t;
  }
  get autofix() {
    return this.currentMask ? this.currentMask.autofix : this._autofix;
  }
  set autofix(t) {
    this._autofix = t;
  }
  maskEquals(t) {
    return Array.isArray(t) ? this.compiledMasks.every((e, s) => {
      if (!t[s]) return;
      const {
        mask: i,
        ...n
      } = t[s];
      return D(e, n) && e.maskEquals(i);
    }) : super.maskEquals(t);
  }
  typedValueEquals(t) {
    var e;
    return !!((e = this.currentMask) != null && e.typedValueEquals(t));
  }
}
b.DEFAULTS = {
  ...k.DEFAULTS,
  dispatch: (a, t, e, s) => {
    if (!t.compiledMasks.length) return;
    const i = t.rawInputValue, n = t.compiledMasks.map((u, r) => {
      const h = t.currentMask === u, o = h ? u.displayValue.length : u.nearestInputPos(u.displayValue.length, l.FORCE_LEFT);
      return u.rawInputValue !== i ? (u.reset(), u.append(i, {
        raw: !0
      })) : h || u.remove(o), u.append(a, t.currentMaskFlags(e)), u.appendTail(s), {
        index: r,
        weight: u.rawInputValue.length,
        totalInputPositions: u.totalInputPositions(0, Math.max(o, u.nearestInputPos(u.displayValue.length, l.FORCE_LEFT)))
      };
    });
    return n.sort((u, r) => r.weight - u.weight || r.totalInputPositions - u.totalInputPositions), t.compiledMasks[n[0].index];
  }
};
d.MaskedDynamic = b;
class M extends g {
  constructor(t) {
    super({
      ...M.DEFAULTS,
      ...t
    });
  }
  updateOptions(t) {
    super.updateOptions(t);
  }
  _update(t) {
    const {
      enum: e,
      ...s
    } = t;
    if (e) {
      const i = e.map((r) => r.length), n = Math.min(...i), u = Math.max(...i) - n;
      s.mask = "*".repeat(n), u && (s.mask += "[" + "*".repeat(u) + "]"), this.enum = e;
    }
    super._update(s);
  }
  _appendCharRaw(t, e) {
    e === void 0 && (e = {});
    const s = Math.min(this.nearestInputPos(0, l.FORCE_RIGHT), this.value.length), i = this.enum.filter((n) => this.matchValue(n, this.unmaskedValue + t, s));
    if (i.length) {
      i.length === 1 && this._forEachBlocksInRange(0, this.value.length, (u, r) => {
        const h = i[0][r];
        r >= this.value.length || h === u.value || (u.reset(), u._appendChar(h, e));
      });
      const n = super._appendCharRaw(i[0][this.value.length], e);
      return i.length === 1 && i[0].slice(this.unmaskedValue.length).split("").forEach((u) => n.aggregate(super._appendCharRaw(u))), n;
    }
    return new p({
      skip: !this.isComplete
    });
  }
  extractTail(t, e) {
    return t === void 0 && (t = 0), e === void 0 && (e = this.displayValue.length), new E("", t);
  }
  remove(t, e) {
    if (t === void 0 && (t = 0), e === void 0 && (e = this.displayValue.length), t === e) return new p();
    const s = Math.min(super.nearestInputPos(0, l.FORCE_RIGHT), this.value.length);
    let i;
    for (i = t; i >= 0 && !(this.enum.filter((r) => this.matchValue(r, this.value.slice(s, i), s)).length > 1); --i)
      ;
    const n = super.remove(i, e);
    return n.tailShift += i - t, n;
  }
  get isComplete() {
    return this.enum.indexOf(this.value) >= 0;
  }
}
M.DEFAULTS = {
  ...g.DEFAULTS,
  matchValue: (a, t, e) => a.indexOf(t, e) === e
};
d.MaskedEnum = M;
class ut extends k {
  /** */
  /** Enable characters overwriting */
  /** */
  /** */
  /** */
  updateOptions(t) {
    super.updateOptions(t);
  }
  _update(t) {
    super._update({
      ...t,
      validate: t.mask
    });
  }
}
d.MaskedFunction = ut;
var q;
class m extends k {
  /** Single char */
  /** Single char */
  /** Array of single chars */
  /** */
  /** */
  /** Digits after point */
  /** Flag to remove leading and trailing zeros in the end of editing */
  /** Flag to pad trailing zeros after point in the end of editing */
  /** Enable characters overwriting */
  /** */
  /** */
  /** */
  /** Format typed value to string */
  /** Parse string to get typed value */
  constructor(t) {
    super({
      ...m.DEFAULTS,
      ...t
    });
  }
  updateOptions(t) {
    super.updateOptions(t);
  }
  _update(t) {
    super._update(t), this._updateRegExps();
  }
  _updateRegExps() {
    const t = "^" + (this.allowNegative ? "[+|\\-]?" : ""), e = "\\d*", s = (this.scale ? "(" + R(this.radix) + "\\d{0," + this.scale + "})?" : "") + "$";
    this._numberRegExp = new RegExp(t + e + s), this._mapToRadixRegExp = new RegExp("[" + this.mapToRadix.map(R).join("") + "]", "g"), this._thousandsSeparatorRegExp = new RegExp(R(this.thousandsSeparator), "g");
  }
  _removeThousandsSeparators(t) {
    return t.replace(this._thousandsSeparatorRegExp, "");
  }
  _insertThousandsSeparators(t) {
    const e = t.split(this.radix);
    return e[0] = e[0].replace(/\B(?=(\d{3})+(?!\d))/g, this.thousandsSeparator), e.join(this.radix);
  }
  doPrepareChar(t, e) {
    e === void 0 && (e = {});
    const [s, i] = super.doPrepareChar(this._removeThousandsSeparators(this.scale && this.mapToRadix.length && /*
      radix should be mapped when
      1) input is done from keyboard = flags.input && flags.raw
      2) unmasked value is set = !flags.input && !flags.raw
      and should not be mapped when
      1) value is set = flags.input && !flags.raw
      2) raw value is set = !flags.input && flags.raw
    */
    (e.input && e.raw || !e.input && !e.raw) ? t.replace(this._mapToRadixRegExp, this.radix) : t), e);
    return t && !s && (i.skip = !0), s && !this.allowPositive && !this.value && s !== "-" && i.aggregate(this._appendChar("-")), [s, i];
  }
  _separatorsCount(t, e) {
    e === void 0 && (e = !1);
    let s = 0;
    for (let i = 0; i < t; ++i)
      this._value.indexOf(this.thousandsSeparator, i) === i && (++s, e && (t += this.thousandsSeparator.length));
    return s;
  }
  _separatorsCountFromSlice(t) {
    return t === void 0 && (t = this._value), this._separatorsCount(this._removeThousandsSeparators(t).length, !0);
  }
  extractInput(t, e, s) {
    return t === void 0 && (t = 0), e === void 0 && (e = this.displayValue.length), [t, e] = this._adjustRangeWithSeparators(t, e), this._removeThousandsSeparators(super.extractInput(t, e, s));
  }
  _appendCharRaw(t, e) {
    e === void 0 && (e = {});
    const s = e.tail && e._beforeTailState ? e._beforeTailState._value : this._value, i = this._separatorsCountFromSlice(s);
    this._value = this._removeThousandsSeparators(this.value);
    const n = this._value;
    this._value += t;
    const u = this.number;
    let r = !isNaN(u), h = !1;
    if (r) {
      let _;
      this.min != null && this.min < 0 && this.number < this.min && (_ = this.min), this.max != null && this.max > 0 && this.number > this.max && (_ = this.max), _ != null && (this.autofix ? (this._value = this.format(_, this).replace(m.UNMASKED_RADIX, this.radix), h || (h = n === this._value && !e.tail)) : r = !1), r && (r = !!this._value.match(this._numberRegExp));
    }
    let o;
    r ? o = new p({
      inserted: this._value.slice(n.length),
      rawInserted: h ? "" : t,
      skip: h
    }) : (this._value = n, o = new p()), this._value = this._insertThousandsSeparators(this._value);
    const c = e.tail && e._beforeTailState ? e._beforeTailState._value : this._value, f = this._separatorsCountFromSlice(c);
    return o.tailShift += (f - i) * this.thousandsSeparator.length, o;
  }
  _findSeparatorAround(t) {
    if (this.thousandsSeparator) {
      const e = t - this.thousandsSeparator.length + 1, s = this.value.indexOf(this.thousandsSeparator, e);
      if (s <= t) return s;
    }
    return -1;
  }
  _adjustRangeWithSeparators(t, e) {
    const s = this._findSeparatorAround(t);
    s >= 0 && (t = s);
    const i = this._findSeparatorAround(e);
    return i >= 0 && (e = i + this.thousandsSeparator.length), [t, e];
  }
  remove(t, e) {
    t === void 0 && (t = 0), e === void 0 && (e = this.displayValue.length), [t, e] = this._adjustRangeWithSeparators(t, e);
    const s = this.value.slice(0, t), i = this.value.slice(e), n = this._separatorsCount(s.length);
    this._value = this._insertThousandsSeparators(this._removeThousandsSeparators(s + i));
    const u = this._separatorsCountFromSlice(s);
    return new p({
      tailShift: (u - n) * this.thousandsSeparator.length
    });
  }
  nearestInputPos(t, e) {
    if (!this.thousandsSeparator) return t;
    switch (e) {
      case l.NONE:
      case l.LEFT:
      case l.FORCE_LEFT: {
        const s = this._findSeparatorAround(t - 1);
        if (s >= 0) {
          const i = s + this.thousandsSeparator.length;
          if (t < i || this.value.length <= i || e === l.FORCE_LEFT)
            return s;
        }
        break;
      }
      case l.RIGHT:
      case l.FORCE_RIGHT: {
        const s = this._findSeparatorAround(t);
        if (s >= 0)
          return s + this.thousandsSeparator.length;
      }
    }
    return t;
  }
  doCommit() {
    if (this.value) {
      const t = this.number;
      let e = t;
      this.min != null && (e = Math.max(e, this.min)), this.max != null && (e = Math.min(e, this.max)), e !== t && (this.unmaskedValue = this.format(e, this));
      let s = this.value;
      this.normalizeZeros && (s = this._normalizeZeros(s)), this.padFractionalZeros && this.scale > 0 && (s = this._padFractionalZeros(s)), this._value = s;
    }
    super.doCommit();
  }
  _normalizeZeros(t) {
    const e = this._removeThousandsSeparators(t).split(this.radix);
    return e[0] = e[0].replace(/^(\D*)(0*)(\d*)/, (s, i, n, u) => i + u), t.length && !/\d$/.test(e[0]) && (e[0] = e[0] + "0"), e.length > 1 && (e[1] = e[1].replace(/0*$/, ""), e[1].length || (e.length = 1)), this._insertThousandsSeparators(e.join(this.radix));
  }
  _padFractionalZeros(t) {
    if (!t) return t;
    const e = t.split(this.radix);
    return e.length < 2 && e.push(""), e[1] = e[1].padEnd(this.scale, "0"), e.join(this.radix);
  }
  doSkipInvalid(t, e, s) {
    e === void 0 && (e = {});
    const i = this.scale === 0 && t !== this.thousandsSeparator && (t === this.radix || t === m.UNMASKED_RADIX || this.mapToRadix.includes(t));
    return super.doSkipInvalid(t, e, s) && !i;
  }
  get unmaskedValue() {
    return this._removeThousandsSeparators(this._normalizeZeros(this.value)).replace(this.radix, m.UNMASKED_RADIX);
  }
  set unmaskedValue(t) {
    super.unmaskedValue = t;
  }
  get typedValue() {
    return this.parse(this.unmaskedValue, this);
  }
  set typedValue(t) {
    this.rawInputValue = this.format(t, this).replace(m.UNMASKED_RADIX, this.radix);
  }
  /** Parsed Number */
  get number() {
    return this.typedValue;
  }
  set number(t) {
    this.typedValue = t;
  }
  get allowNegative() {
    return this.min != null && this.min < 0 || this.max != null && this.max < 0;
  }
  get allowPositive() {
    return this.min != null && this.min > 0 || this.max != null && this.max > 0;
  }
  typedValueEquals(t) {
    return (super.typedValueEquals(t) || m.EMPTY_VALUES.includes(t) && m.EMPTY_VALUES.includes(this.typedValue)) && !(t === 0 && this.value === "");
  }
}
q = m;
m.UNMASKED_RADIX = ".";
m.EMPTY_VALUES = [...k.EMPTY_VALUES, 0];
m.DEFAULTS = {
  ...k.DEFAULTS,
  mask: Number,
  radix: ",",
  thousandsSeparator: "",
  mapToRadix: [q.UNMASKED_RADIX],
  min: Number.MIN_SAFE_INTEGER,
  max: Number.MAX_SAFE_INTEGER,
  scale: 2,
  normalizeZeros: !0,
  padFractionalZeros: !1,
  parse: Number,
  format: (a) => a.toLocaleString("en-US", {
    useGrouping: !1,
    maximumFractionDigits: 20
  })
};
d.MaskedNumber = m;
const L = {
  MASKED: "value",
  UNMASKED: "unmaskedValue",
  TYPED: "typedValue"
};
function Y(a, t, e) {
  t === void 0 && (t = L.MASKED), e === void 0 && (e = L.MASKED);
  const s = A(a);
  return (i) => s.runIsolated((n) => (n[t] = i, n[e]));
}
function at(a, t, e, s) {
  return Y(t, e, s)(a);
}
d.PIPE_TYPE = L;
d.createPipe = Y;
d.pipe = at;
class rt extends g {
  get repeatFrom() {
    var t;
    return (t = Array.isArray(this.repeat) ? this.repeat[0] : this.repeat === 1 / 0 ? 0 : this.repeat) != null ? t : 0;
  }
  get repeatTo() {
    var t;
    return (t = Array.isArray(this.repeat) ? this.repeat[1] : this.repeat) != null ? t : 1 / 0;
  }
  constructor(t) {
    super(t);
  }
  updateOptions(t) {
    super.updateOptions(t);
  }
  _update(t) {
    var e, s, i;
    const {
      repeat: n,
      ...u
    } = B(t);
    this._blockOpts = Object.assign({}, this._blockOpts, u);
    const r = A(this._blockOpts);
    this.repeat = (e = (s = n ?? r.repeat) != null ? s : this.repeat) != null ? e : 1 / 0, super._update({
      mask: "m".repeat(Math.max(this.repeatTo === 1 / 0 && ((i = this._blocks) == null ? void 0 : i.length) || 0, this.repeatFrom)),
      blocks: {
        m: r
      },
      eager: r.eager,
      overwrite: r.overwrite,
      skipInvalid: r.skipInvalid,
      lazy: r.lazy,
      placeholderChar: r.placeholderChar,
      displayChar: r.displayChar
    });
  }
  _allocateBlock(t) {
    if (t < this._blocks.length) return this._blocks[t];
    if (this.repeatTo === 1 / 0 || this._blocks.length < this.repeatTo)
      return this._blocks.push(A(this._blockOpts)), this.mask += "m", this._blocks[this._blocks.length - 1];
  }
  _appendCharRaw(t, e) {
    e === void 0 && (e = {});
    const s = new p();
    for (
      let h = (i = (n = this._mapPosToBlock(this.displayValue.length)) == null ? void 0 : n.index) != null ? i : Math.max(this._blocks.length - 1, 0), o, c;
      // try to get a block or
      // try to allocate a new block if not allocated already
      o = (u = this._blocks[h]) != null ? u : c = !c && this._allocateBlock(h);
      ++h
    ) {
      var i, n, u, r;
      const f = o._appendChar(t, {
        ...e,
        _beforeTailState: (r = e._beforeTailState) == null || (r = r._blocks) == null ? void 0 : r[h]
      });
      if (f.skip && c) {
        this._blocks.pop(), this.mask = this.mask.slice(1);
        break;
      }
      if (s.aggregate(f), f.consumed) break;
    }
    return s;
  }
  _trimEmptyTail(t, e) {
    var s, i;
    t === void 0 && (t = 0);
    const n = Math.max(((s = this._mapPosToBlock(t)) == null ? void 0 : s.index) || 0, this.repeatFrom, 0);
    let u;
    e != null && (u = (i = this._mapPosToBlock(e)) == null ? void 0 : i.index), u == null && (u = this._blocks.length - 1);
    let r = 0;
    for (let h = u; n <= h && !this._blocks[h].unmaskedValue; --h, ++r)
      ;
    r && (this._blocks.splice(u - r + 1, r), this.mask = this.mask.slice(r));
  }
  reset() {
    super.reset(), this._trimEmptyTail();
  }
  remove(t, e) {
    t === void 0 && (t = 0), e === void 0 && (e = this.displayValue.length);
    const s = super.remove(t, e);
    return this._trimEmptyTail(t, e), s;
  }
  totalInputPositions(t, e) {
    return t === void 0 && (t = 0), e == null && this.repeatTo === 1 / 0 ? 1 / 0 : super.totalInputPositions(t, e);
  }
  get state() {
    return super.state;
  }
  set state(t) {
    this._blocks.length = t._blocks.length, this.mask = this.mask.slice(0, this._blocks.length), super.state = t;
  }
}
d.RepeatBlock = rt;
try {
  globalThis.IMask = d;
} catch {
}
var $ = (a) => {
  throw TypeError(a);
}, Z = (a, t, e) => t.has(a) || $("Cannot " + e), O = (a, t, e) => (Z(a, t, "read from private field"), e ? e.call(a) : t.get(a)), ht = (a, t, e) => t.has(a) ? $("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(a) : t.set(a, e), lt = (a, t, e, s) => (Z(a, t, "write to private field"), t.set(a, e), e), x;
class ot extends HTMLInputElement {
  constructor() {
    super(...arguments), ht(this, x);
  }
  connectedCallback() {
    lt(this, x, d(this, {
      mask: this.getAttribute("pattern")
    }));
  }
  disconnectedCallback() {
    O(this, x).destroy();
  }
  attributeChangedCallback(t, e, s) {
    this[`${t}Changed`] && this[`${t}Changed`](e, s);
  }
  patternChanged(t, e) {
    O(this, x) && (O(this, x).mask = e);
  }
}
x = /* @__PURE__ */ new WeakMap();
customElements.define("mir-masked-input", ot);
export {
  ot as MirMaskedInput
};
