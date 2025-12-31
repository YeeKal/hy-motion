import sharp from "sharp";

const DEEPINFRA_API_URL = "https://api.deepinfra.com/v1/openai/chat/completions";
const DEEPINFRA_TOKEN = process.env.DEEPINFRA_TOKEN;
const MODEL = "deepseek-ai/DeepSeek-OCR";

export type OCRRequest = {
  input_source: {
    type: "url" | "base64";
    value: string;
  };
  task_type: string;
  prompt: string | null;
  model_size: string;
  output_options: {
    include_bounding_boxes: boolean;
    include_visualization: boolean;
  };
};

const PROMPT_TEMPLATES: { [key: string]: string } = {
  doc_to_markdown: "<image>\n<|grounding|>Convert the document to markdown.",
  general_ocr: "<image>\n<|grounding|>OCR this image.",
  simple_ocr: "<image>\nFree OCR.",
  figure_parse: "<image>\nParse the figure.",
  image_description: "<image>\nDescribe this image in detail.",
};

export async function processOCR(body: OCRRequest) {
  if (!DEEPINFRA_TOKEN) {
    throw new Error("DEEPINFRA_TOKEN is not set in environment variables.");
  }

  // Construct prompt_text
  let prompt_text: string;
  if (body.task_type === "custom") {
    if (!body.prompt) {
      throw new Error("Prompt is required for custom task_type.");
    }
    prompt_text = body.prompt;
  } else if (body.task_type === "text_localization") {
    if (!body.prompt) {
      throw new Error("Prompt is required for text_localization task_type.");
    }
    prompt_text = `<image>\nLocate <|ref|>${body.prompt}</|/ref|> in the image.`;
  } else {
    prompt_text = PROMPT_TEMPLATES[body.task_type];
    if (!prompt_text) {
      throw new Error("Invalid task_type.");
    }
  }

  // Construct image_url
  let image_url: string;
  if (body.input_source.type === "url") {
    image_url = body.input_source.value;
  } else if (body.input_source.type === "base64") {
    // Assume JPEG for base64, but it can be adjusted if needed
    // image_url = `data:image/jpeg;base64,${body.input_source.value}`;
    image_url = `${body.input_source.value}`;
  } else {
    throw new Error("Invalid input_source type.");
  }

  // Prepare messages
  const messages = [
    {
      role: "user",
      content: [
        {
          type: "image_url",
          image_url: { url: image_url },
        },
        {
          type: "text",
          text: prompt_text,
        },
      ],
    },
  ];

  // Call the API
  console.log(messages[0].content[1].text)
  const response = await fetch(DEEPINFRA_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DEEPINFRA_TOKEN}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`DeepInfra API error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const text_content = data.choices[0].message.content;

  //  log usage: 
  console.log("[OCR Billing] tokens:", {
      usage: data.usage,
    });

  // Load image buffer for postprocessing
  let buffer: Buffer;
  if (body.input_source.type === "url") {
    const imgResponse = await fetch(body.input_source.value);
    if (!imgResponse.ok) {
      throw new Error("Failed to fetch image from URL.");
    }
    const arrayBuffer = await imgResponse.arrayBuffer();
    buffer = Buffer.from(arrayBuffer);
  } else {
    buffer = Buffer.from(body.input_source.value.split(",")[1], "base64");
  }

  // Get image dimensions
  const metadata = await sharp(buffer).metadata();
  const w = metadata.width!;
  const h = metadata.height!;

  // Extract bounding boxes
  const boxes_data: { text: string; box: number[] }[] = [];
  const pattern = new RegExp(
  '<\\|det\\|>\\[\\[(\\d+),\\s*(\\d+),\\s*(\\d+),\\s*(\\d+)\\]\\]<\\|\\/det\\|>',
  'g'
);
  let match;
  while ((match = pattern.exec(text_content))) {
    const coords = match.slice(1).map(Number);
    boxes_data.push({
      text: "N/A",
      box: [
        Math.round((coords[0] / 1000) * w),
        Math.round((coords[1] / 1000) * h),
        Math.round((coords[2] / 1000) * w),
        Math.round((coords[3] / 1000) * h),
      ],
    });
  }

  // Prepare output
  const output: any = { text_content };

  const { include_bounding_boxes = true, include_visualization = true } =
    body.output_options || {};

  if (include_bounding_boxes) {
    output.bounding_boxes = boxes_data;
  }

  if (include_visualization && boxes_data.length > 0) {
    // Create SVG for overlays
    let svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">`;
    for (const item of boxes_data) {
      const [x1, y1, x2, y2] = item.box;
      svg += `<rect x="${x1}" y="${y1}" width="${x2 - x1}" height="${y2 - y1}" fill="none" stroke="red" stroke-width="3"/>`;
    }
    svg += "</svg>";

    const svgBuffer = Buffer.from(svg);

    // Composite SVG onto image and get JPEG base64
    const viz_buffer = await sharp(buffer)
      .composite([{ input: svgBuffer, gravity: "northwest", blend: "over" }])
      .jpeg()
      .toBuffer();

    output.visualization_b64 = `data:image/jpeg;base64,${viz_buffer.toString("base64")}`;
  }

  return { status: "COMPLETED", output };
}

