import markdown from 'eslint-plugin-markdown'

export default [
    {
        files: ['**/*.md'],
        plugins: {
            markdown
        },
        processor: 'markdown/markdown'
    },
    {
        files: ['**/*.md/**'],
        languageOptions: {
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
        rules: {
            ...markdown.configs.recommended.overrides[0].rules
        }
    }
]
