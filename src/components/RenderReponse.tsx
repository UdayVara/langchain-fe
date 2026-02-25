import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";


function RenderReponse({response}: {response: string}) {
  return (
    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
      {response}
    </ReactMarkdown>
  )
}

export default RenderReponse