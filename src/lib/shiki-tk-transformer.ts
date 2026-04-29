import type { ShikiTransformer, ThemeRegistrationRaw } from 'shiki';
import type { Element } from 'hast';

// Sentinel hex colors used only to identify token categories. The styles-v2.css
// file maps each tk-* class to the real visible color via CSS custom properties.
const TK = {
  KW: '#000001',
  FN: '#000002',
  STR: '#000003',
  NUM: '#000004',
  COM: '#000005',
  TYP: '#000006',
} as const;

const COLOR_TO_CLASS: Record<string, string> = {
  [TK.KW]: 'tk-kw',
  [TK.FN]: 'tk-fn',
  [TK.STR]: 'tk-str',
  [TK.NUM]: 'tk-num',
  [TK.COM]: 'tk-com',
  [TK.TYP]: 'tk-typ',
};

export const tkShikiTheme: ThemeRegistrationRaw = {
  name: 'tk',
  type: 'light',
  settings: [
    { settings: { foreground: '#000000', background: '#ffffff' } },
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: TK.COM } },
    {
      scope: ['string', 'string.quoted', 'string.template', 'punctuation.definition.string'],
      settings: { foreground: TK.STR },
    },
    { scope: ['constant.numeric'], settings: { foreground: TK.NUM } },
    {
      scope: [
        'keyword',
        'keyword.control',
        'keyword.operator.new',
        'storage',
        'storage.type',
        'storage.modifier',
        'variable.language',
        'constant.language',
        'keyword.other',
      ],
      settings: { foreground: TK.KW },
    },
    {
      scope: [
        'entity.name.function',
        'support.function',
        'meta.function-call entity.name.function',
        'meta.function-call.generic',
      ],
      settings: { foreground: TK.FN },
    },
    {
      scope: [
        'entity.name.type',
        'entity.name.class',
        'support.type',
        'support.class',
        'storage.type.primitive',
      ],
      settings: { foreground: TK.TYP },
    },
  ],
};

const HEX_REGEX = /color:\s*(#[0-9a-fA-F]{6})/;
const TITLE_REGEX = /title="([^"]+)"/;

function classFromStyle(style: string): string {
  const match = style.match(HEX_REGEX);
  if (!match || match[1] === undefined) return 'tk-pun';
  const hex = match[1].toLowerCase();
  return COLOR_TO_CLASS[hex] ?? 'tk-pun';
}

function metaTitle(meta: unknown): string | null {
  if (!meta || typeof meta !== 'object') return null;
  const raw = (meta as { __raw?: unknown }).__raw;
  if (typeof raw !== 'string') return null;
  const m = raw.match(TITLE_REGEX);
  return m && m[1] ? m[1] : null;
}

export function tkTransformer(): ShikiTransformer {
  return {
    name: 'tk-classes',

    span(node) {
      const props = node.properties;
      const style = typeof props.style === 'string' ? props.style : '';
      const cls = classFromStyle(style);
      const existing = typeof props.class === 'string' ? props.class : '';
      props.class = existing ? `${existing} ${cls}` : cls;
      delete props.style;
    },

    pre(node) {
      delete node.properties.style;
      // strip the auto-added "astro-code css-variables" classes; the design
      // uses the .code-block wrapper for visual styling, not the bare <pre>.
      delete node.properties.class;
      delete node.properties.tabindex;

      const title = metaTitle(this.options.meta);
      if (!title) return;

      const wrapper: Element = {
        type: 'element',
        tagName: 'div',
        properties: { class: 'code-block' },
        children: [
          {
            type: 'element',
            tagName: 'div',
            properties: { class: 'code-head' },
            children: [{ type: 'text', value: title }],
          },
          { ...node },
        ],
      };
      return wrapper;
    },

    code(node) {
      delete node.properties.style;
    },
  };
}
