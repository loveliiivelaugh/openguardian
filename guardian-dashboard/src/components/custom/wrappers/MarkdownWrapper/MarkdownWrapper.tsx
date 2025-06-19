// ****
// *    Install Dependencies
// ```
// @ts
// pnpm add react-markdown react-syntax-highlighter rehype-katex remark-math react-lazy-load-image-component
// pnpm add --save-dev @types/react-syntax-highlighter @types/react-lazy-load-image-component
// ```
// *
// ****
import Markdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import { LazyLoadImage } from 'react-lazy-load-image-component'
// import { TextGenerateEffect } from '../theme/TextGenerateEffect'
// import { TypewriterEffect } from '../theme/TypeWriterEffect'


interface MarkdownWrapperProps {
    children: string
    isLastElement?: boolean
}
const MarkdownWrapper = ({ children, isLastElement = false }: MarkdownWrapperProps) => {
    console.log("MarkdownWrapper: ", isLastElement)
    return (
        <Markdown
            children={children}
            remarkPlugins={[remarkMath]} 
            rehypePlugins={[rehypeKatex]}
            components={{
                code(props: any) {
                    const {children, className, node, ...rest} = props
                    const match = /language-(\w+)/.exec(className || '')
                    return match ? (
                    <SyntaxHighlighter
                        {...rest}
                        PreTag="div"
                        children={String(children).replace(/\n$/, '')}
                        language={match[1]}
                        style={dark}
                    />
                    ) : (
                    <code {...rest} className={className}>
                        {children}
                    </code>
                    )
                },
                img: (props: any) => <LazyLoadImage {...props} effect="blur" />,
                // ...isLastElement && {
                //     p: (props) => <TextGenerateEffect words={props.children} />
                // }
                // p: (props) => <TypewriterEffect words={props.children.split(' ')} />,
            }}
        />
    )
}

export default MarkdownWrapper