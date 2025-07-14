import axios from "axios";
import * as fs from 'fs';
import * as path from 'path';
import { OpenAI } from 'openai';
import crypto from 'crypto';

type AudioToTextProp = {
  audioUrl: string
}

export async function audioToText({ audioUrl }: AudioToTextProp): Promise<string> {
  const audioId = crypto.randomUUID();
  const tmpDir = path.resolve(__dirname, '..', 'tmp');
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }
  const outputPath = path.join(tmpDir, `${audioId}.wav`);

  const response = await axios.get(audioUrl, { responseType: 'stream' });

  const writer = fs.createWriteStream(outputPath);
  response.data.pipe(writer);
  await new Promise<void>((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });

  const openai = new OpenAI()
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(outputPath),
    model: 'whisper-1',
    language: 'es'
  });
  fs.unlinkSync(outputPath);

  return transcription.text;
}