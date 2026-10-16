// rehype-table-wrap — hüllt jede Markdown-Tabelle in einen Scroll-Container.
//
// Warum: eine <table width:100%> mit unumbrechbarem Inhalt (4+ Spalten) kann
// breiter als ihr Container werden und schiebt dann die GANZE Seite in den
// horizontalen Overflow — auf 390px sieht man nur noch den halben Text.
// Der Wrapper lässt nur die Tabelle selbst scrollen, das Layout bleibt heil.
//
// Zusätzlich bekommt der Wrapper role/aria-label/tabindex: die breite Tabelle
// war auf Mobile abgeschnitten und ohne Tastatur-/Screenreader-Zugang
// (SEO-Audit 17.10.2026, Rolle "visual").
export default function rehypeTableWrap() {
  return (tree) => {
    const walk = (node) => {
      if (!node || !Array.isArray(node.children)) return;
      node.children = node.children.map((child) => {
        if (child.type === 'element' && child.tagName === 'table') {
          return {
            type: 'element',
            tagName: 'div',
            properties: {
              className: ['table-scroll'],
              role: 'region',
              tabIndex: 0,
              'aria-label': 'Table — scroll horizontally to see all columns',
            },
            children: [child],
          };
        }
        walk(child);
        return child;
      });
    };
    walk(tree);
  };
}
