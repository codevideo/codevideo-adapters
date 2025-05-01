export function getLanguageFromExtension(extension: string): string | null {
    const ext = extension.startsWith('.') ? extension.slice(1).toLowerCase() : extension.toLowerCase();

    const extensionMap: { [key: string]: string } = {
        // Web
        'html': 'HTML',
        'htm': 'HTML',
        'css': 'CSS',
        'scss': 'Sass',
        'sass': 'Sass',
        'less': 'Less',

        // JavaScript & TypeScript
        'js': 'JavaScript',
        'mjs': 'JavaScript (ES Module)',
        'cjs': 'JavaScript (CommonJS)',
        'ts': 'TypeScript',
        'tsx': 'TypeScript React',
        'jsx': 'JavaScript React',

        // JSON, YAML, TOML
        'json': 'JSON',
        'jsonc': 'JSON with Comments',
        'yaml': 'YAML',
        'yml': 'YAML',
        'toml': 'TOML',

        // Python
        'py': 'Python',
        'pyw': 'Python (Windowed)',
        'pyi': 'Python Interface',

        // Java and related
        'java': 'Java',
        'class': 'Java Bytecode',
        'jar': 'Java Archive',
        'groovy': 'Groovy',
        'kt': 'Kotlin',
        'kts': 'Kotlin Script',

        // C-family
        'c': 'C',
        'h': 'C Header',
        'cpp': 'C++',
        'cxx': 'C++',
        'cc': 'C++',
        'c++': 'C++',
        'hpp': 'C++ Header',
        'hxx': 'C++ Header',
        'cs': 'C#',
        'csx': 'C# Script',
        'go': 'Go',
        'rs': 'Rust',
        'swift': 'Swift',
        'm': 'Objective-C',
        'mm': 'Objective-C++',

        // Shell / CLI
        'sh': 'Shell',
        'bash': 'Bash',
        'zsh': 'Zsh',
        'fish': 'Fish',
        'bat': 'Batch',
        'cmd': 'Batch',
        'ps1': 'PowerShell',
        'psm1': 'PowerShell Module',

        // PHP & related
        'php': 'PHP',
        'phtml': 'PHP HTML',
        'php3': 'PHP 3',
        'php4': 'PHP 4',
        'php5': 'PHP 5',

        // Ruby
        'rb': 'Ruby',
        'erb': 'Embedded Ruby',
        'rake': 'Ruby Rake',

        // Perl
        'pl': 'Perl',
        'pm': 'Perl Module',

        // Lua
        'lua': 'Lua',

        // R
        'r': 'R',
        'rmd': 'R Markdown',

        // Julia
        'jl': 'Julia',

        // Haskell
        'hs': 'Haskell',
        'lhs': 'Literate Haskell',

        // Lisp family
        'lisp': 'Lisp',
        'cl': 'Common Lisp',
        'el': 'Emacs Lisp',
        'scm': 'Scheme',
        'rkt': 'Racket',

        // SQL & DB
        'sql': 'SQL',
        'sqlite': 'SQLite',
        'db': 'Database',

        // Config / Build systems
        'ini': 'INI',
        'cfg': 'Config',
        'conf': 'Config',
        'env': 'Environment Config',
        'makefile': 'Makefile',
        'mk': 'Makefile',
        'dockerfile': 'Dockerfile',
        'dockerignore': 'Docker Ignore',
        'gitignore': 'Git Ignore',
        'gitattributes': 'Git Attributes',

        // Markdown, Text
        'md': 'Markdown',
        'markdown': 'Markdown',
        'txt': 'Plain Text',
        'rst': 'reStructuredText',
        'adoc': 'AsciiDoc',

        // Assembly
        'asm': 'Assembly',
        's': 'Assembly',

        // Misc languages
        'dart': 'Dart',
        'scala': 'Scala',
        'sc': 'Scala Script',
        'clj': 'Clojure',
        'cljs': 'ClojureScript',
        'edn': 'Extensible Data Notation',
        'fs': 'F#',
        'fsx': 'F# Script',
        'ml': 'OCaml',
        'mli': 'OCaml Interface',

        // Visual languages
        'vb': 'Visual Basic',
        'vbs': 'VBScript',

        // Web templating
        'ejs': 'Embedded JavaScript',
        'mustache': 'Mustache',
        'hbs': 'Handlebars',
        'pug': 'Pug (Jade)',

        // Data & serialization
        'csv': 'CSV',
        'tsv': 'TSV',
        'xml': 'XML',

        // Others
        'tex': 'LaTeX',
        'cls': 'LaTeX Class',
        'sty': 'LaTeX Style',
        'bib': 'BibTeX',
        'asmx': 'ASP.NET',
        'aspx': 'ASP.NET',
        'vue': 'Vue',
        'svelte': 'Svelte',
        'solidity': 'Solidity',
        'sol': 'Solidity',
    };

    return extensionMap[ext] || null;
}
