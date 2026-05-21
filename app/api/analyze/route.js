import { NextResponse } from "next/server"
import { getData } from "pdf-parse/worker"
import { PDFParse } from "pdf-parse"

PDFParse.setWorker(getData())

export async function POST(req) {
  let parser

  try {
    const formData = await req.formData()

    const file = formData.get("resume")

    if (!file) {
      return NextResponse.json({
        success: false,
        error: "No resume file provided",
      }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    parser = new PDFParse({ data: buffer })
    const { text: resumeText } = await parser.getText()

    return NextResponse.json({
      success: true,
      text: resumeText,
    })
  } catch (error) {
    console.log(error)

    return NextResponse.json({
      success: false,
      error: error.message,
    })
  } finally {
    await parser?.destroy()
  }
}
