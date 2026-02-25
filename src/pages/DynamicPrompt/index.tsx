import { useState } from "react";
import RenderReponse from "../../components/RenderReponse";

export default function DynamicPrompt() {
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState("");
    const [formData, setFormData] = useState({
        paper: "",
        explanationStyle: "",
        explanationLength: "",
    });
    const handleGenerate = async () => {
        if(!formData.paper || !formData.explanationStyle || !formData.explanationLength){
            alert("Please fill all the fields");
            return;
        }
        setLoading(true);
        try {
            const response = await fetch("http://localhost:8000/dynamic-prompt", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...formData }),
            });

            const data = await response.json();
            const responseContent = data?.response;

            setSummary(responseContent);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
  return (
    <>
      <div className="max-w-7xl mx-auto py-10">
        <h1 className="text-3xl font-semibold">
          Dynamic Prompt{" "}
          <span className="text-gray-800">(Research Paper Summarizer)</span>
        </h1>

        <div className="mt-5 flex flex-row gap-5 justify-between">
          <select  onChange={(e) => setFormData({ ...formData, paper: e.target.value })} name="" id="" className="w-full  py-2 rounded focus:outline-none bg-gray-100 px-2">
            <option value="" disabled>Select Paper</option>
            {[
              "Attention Is All You Need",
              "BERT: Pre-training of Deep Bidirectional Transformers",
              "GPT-3: Language Models are Few-Shot Learners",
              "Diffusion Models Beat GANs on Image Synthesis",
            ].map((paper) => (
              <option key={paper} value={paper}>
                {paper}
              </option>
            ))}
          </select>
          <select onChange={(e) => setFormData({ ...formData, explanationStyle: e.target.value })} name="Explanation Style" id="" className="w-full  py-2 rounded focus:outline-none bg-gray-100 px-2">
            <option value="" disabled>Select Explanation Style</option>
            {[
              "Beginner-Friendly",
              "Technical",
              "Code-Oriented",
              "Mathematical",
            ].map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
          <select onChange={(e) => setFormData({ ...formData, explanationLength: e.target.value })}
            name="Select Explanation Length"
            id="Select Explanation Length" className="w-full  py-2 rounded focus:outline-none bg-gray-100 px-2"
          >
            <option value="" disabled>Select Explanation Length</option>
            {[
              "Short (1-2 paragraphs)",
              "Medium (3-5 paragraphs)",
              "Long (detailed explanation)",
            ].map((length) => (
              <option key={length} value={length}>
                {length}
              </option>
            ))}
          </select>
        </div>

        <button className="mt-5 px-5 py-2 rounded bg-gray-900 text-white" onClick={handleGenerate} disabled={loading}>{loading ? "Generating..." : "Generate"}</button>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold">Summary</h2>
          <p className="mt-2 bg-gray-100 p-5 rounded">{summary ? <RenderReponse response={summary} /> : "..."}</p>
        </div>
      </div>
    </>
  );
}
