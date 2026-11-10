'use client'

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown } from 'lucide-react'

export type SelectOption<V extends string> = V | { value: V; label: string }

interface Props<V extends string> {
  value: V
  onChange: (value: V) => void
  options: readonly SelectOption<V>[]
  /** Lets a <label htmlFor> point at the trigger. */
  id?: string
  'aria-label'?: string
  placeholder?: string
  disabled?: boolean
  /** Extra classes for the trigger, e.g. size tweaks like "!py-2.5". */
  className?: string
}

const norm = <V extends string>(o: SelectOption<V>) => (typeof o === 'string' ? { value: o, label: o } : o)

/**
 * Custom dropdown that replaces the native <select>. Implements the WAI-ARIA
 * "select-only combobox" pattern: focus stays on the trigger, options are
 * referenced via aria-activedescendant. The list is portalled to <body> with
 * fixed positioning so scrolling containers (modals) can't clip it.
 */
export default function Select<V extends string>({ value, onChange, options, id, placeholder = 'Select…', disabled, className = '', ...rest }: Props<V>) {
  const opts = options.map(norm)
  const autoId = useId()
  const triggerId = id ?? `sel-${autoId}`
  const listId = `${triggerId}-list`
  const btnRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const [active, setActive] = useState(0)
  const [pos, setPos] = useState<{ left: number; width: number; top?: number; bottom?: number; maxH: number }>()
  const typed = useRef({ text: '', at: 0 })
  const selectedIndex = opts.findIndex((o) => o.value === value)
  const selected = opts[selectedIndex]

  const place = useCallback(() => {
    const r = btnRef.current?.getBoundingClientRect()
    if (!r) return
    const below = window.innerHeight - r.bottom - 8
    const above = r.top - 8
    const flip = below < 220 && above > below
    setPos({
      left: r.left,
      width: r.width,
      ...(flip ? { bottom: window.innerHeight - r.top + 6 } : { top: r.bottom + 6 }),
      maxH: Math.min(280, (flip ? above : below) - 6),
    })
  }, [])

  const openList = () => {
    if (disabled) return
    setActive(selectedIndex >= 0 ? selectedIndex : 0)
    place()
    setOpen(true)
  }
  const close = (refocus = true) => {
    setOpen(false)
    if (refocus) btnRef.current?.focus()
  }
  const choose = (i: number) => {
    const o = opts[i]
    if (o && o.value !== value) onChange(o.value)
    close()
  }

  // Keep the list attached to the trigger while the page or a modal scrolls.
  useLayoutEffect(() => {
    if (!open) return
    place()
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    return () => {
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place, true)
    }
  }, [open, place])

  // Close on outside click.
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node
      if (!btnRef.current?.contains(t) && !listRef.current?.contains(t)) close(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  // Scroll the active option into view.
  useEffect(() => {
    if (open) listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [active, open])

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    const last = opts.length - 1
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault()
        openList()
      }
      return
    }
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); setActive((a) => Math.min(last, a + 1)); return
      case 'ArrowUp': e.preventDefault(); setActive((a) => Math.max(0, a - 1)); return
      case 'Home': e.preventDefault(); setActive(0); return
      case 'End': e.preventDefault(); setActive(last); return
      case 'Enter':
      case ' ': e.preventDefault(); choose(active); return
      case 'Escape': e.preventDefault(); close(); return
      case 'Tab': setOpen(false); return
    }
    // Type-ahead: jump to the first option starting with the typed letters.
    if (e.key.length === 1 && /\S/.test(e.key)) {
      const now = Date.now()
      typed.current = { text: (now - typed.current.at < 700 ? typed.current.text : '') + e.key.toLowerCase(), at: now }
      const i = opts.findIndex((o) => o.label.toLowerCase().startsWith(typed.current.text))
      if (i >= 0) setActive(i)
    }
  }

  return (
    <>
      <button
        ref={btnRef}
        id={triggerId}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        aria-label={rest['aria-label']}
        disabled={disabled}
        onClick={() => (open ? close() : openList())}
        onKeyDown={onKeyDown}
        className={`field flex items-center justify-between gap-2 text-left disabled:cursor-not-allowed disabled:bg-mist/60 disabled:text-muted ${open ? 'border-brand ring-4 ring-brand/10' : ''} ${className}`}
      >
        <span className={`truncate ${selected ? '' : 'text-muted/70'}`}>{selected?.label ?? placeholder}</span>
        <ChevronDown className={`size-4 shrink-0 text-muted transition-transform duration-200 ${open ? 'rotate-180 text-brand' : ''}`} />
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && pos && (
              <motion.ul
                ref={listRef}
                id={listId}
                role="listbox"
                aria-labelledby={triggerId}
                tabIndex={-1}
                initial={{ opacity: 0, y: pos.top !== undefined ? -6 : 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: pos.top !== undefined ? -6 : 6, scale: 0.98 }}
                transition={{ duration: 0.14 }}
                style={{ position: 'fixed', left: pos.left, top: pos.top, bottom: pos.bottom, minWidth: pos.width, maxHeight: pos.maxH }}
                className="z-[100] overflow-y-auto rounded-xl border border-line bg-white p-1 shadow-2xl shadow-ink/15 [scrollbar-width:thin]"
              >
                {opts.map((o, i) => {
                  const isSel = o.value === value
                  return (
                    <li
                      key={o.value}
                      id={`${listId}-${i}`}
                      data-index={i}
                      role="option"
                      aria-selected={isSel}
                      onMouseEnter={() => setActive(i)}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => choose(i)}
                      className={`flex cursor-pointer items-center justify-between gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-colors ${i === active ? 'bg-mist text-brand' : 'text-ink'} ${isSel ? 'font-semibold' : ''}`}
                    >
                      {o.label}
                      {isSel && <Check className="size-4 shrink-0 text-brand" />}
                    </li>
                  )
                })}
              </motion.ul>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  )
}
