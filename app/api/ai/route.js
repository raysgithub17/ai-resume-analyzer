import { NextResponse } from "next/server"
import { InferenceClient } from "@huggingface/inference"

function getInferenceClient() {
  const token = process.env.HF_ACCESS_TOKEN
  if (!token) {
    throw new Error("HF_ACCESS_TOKEN is not configured")
  }
  return new InferenceClient(token)
}

async function generateATS(hf, resumeText, jd) {
  const prompt = `You are an ATS Resume Analyzer. Analyze the resume against the job description.

Return ONLY valid JSON (no markdown, no extra text) with this exact structure:
{
  "score": <number 0-100>,
  "matchLabel": "<Good Match|Fair Match|Needs Work>",
  "summary": "<2-3 sentence overall summary>",
  "matchedSkills": ["<skill>", ...],
  "missingSkills": ["<skill>", ...],
  "improvements": ["<improvement>", ...],
  "suggestions": ["<suggestion>", ...]
}

Resume:
${resumeText}

Job Description:
${jd}`

  const response = await hf.chatCompletion({
    model: "meta-llama/Llama-3.1-8B-Instruct",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 800,
    temperature: 0.4,
  })

  const raw = response.choices[0].message.content
  const jsonMatch = raw.match(/\{[\s\S]*\}/)

  if (!jsonMatch) {
    throw new Error("AI returned an invalid response format")
  }

  return JSON.parse(jsonMatch[0])
}

export async function POST(req) {
  try {
    const { resumeText, jobDescription } = await req.json()

    if (!resumeText || !jobDescription) {
      return NextResponse.json({
        success: false,
        error: "Resume text and job description are required",
      }, { status: 400 })
    }

    const result = await generateATS(
      getInferenceClient(),
      resumeText,
      jobDescription
    )

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error("Error generating ATS analysis:", error)

    return NextResponse.json({
      success: false,
      error: error.message ?? "AI analysis failed",
    }, { status: 500 })
  }
}
