// File: assets/js/bibtex-parse.js
//
// WARNING: This is a very minimal example and not robust.
// For real-world usage, copy the actual library code from
// IonicaBizau/bibtex-parse or ORCID/bibtexParseJs.

export function parseBibFile(bibtexString) {
    // Split entries by '@', skip the first empty if it starts with '@'
    let rawEntries = bibtexString.split('@');
    rawEntries = rawEntries.filter(e => e.trim().length > 0);
  
    const entries = rawEntries.map(raw => {
      // e.g., "misc{key,\n title=..."
      // 1) entry type
      const typeMatch = raw.match(/^\s*([a-zA-Z]+)\s*\{/);
      const type = typeMatch ? typeMatch[1].toLowerCase() : 'misc';
  
      // 2) key
      const keyMatch = raw.match(/\{\s*([^,]+),/);
      const key = keyMatch ? keyMatch[1] : '';
  
      // 3) fields: naive capture key = value
      const fieldLines = raw.split('\n');
      const fields = {};
      for (let i = 0; i < fieldLines.length; i++) {
        const line = fieldLines[i].trim();
        // e.g.: title={BNEM: ...},
        const fieldMatch = line.match(/^([a-zA-Z]+)\s*=\s*\{?([^}]+)\}?,?\s*$/);
        if (fieldMatch) {
          const fieldName = fieldMatch[1].toLowerCase();
          // remove trailing commas, braces if any
          let fieldValue = fieldMatch[2].trim();
          fields[fieldName] = fieldValue;
        }
      }
  
      // Combine everything
      return {
        type,
        key,
        ...fields
      };
    });
  
    return entries;
  }
  