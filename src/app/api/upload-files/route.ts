import { NextResponse } from 'next/server';
// import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  const formData = await req.formData();
  const files = formData.getAll('files') as File[];

  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const buffer = await file.arrayBuffer();
        const filename = `${Date.now()}_${file.name}`;
        const filepath = path.join(uploadDir, filename);
        
        await fs.promises.writeFile(filepath, Buffer.from(buffer));
        
        return {
          type: file.type.startsWith('image/') ? 'image' : 'file',
          url: `/uploads/${filename}`,
          name: file.name,
          size: file.size,
          mimeType: file.type
        };
      })
    );

    return NextResponse.json(uploadedFiles);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Erreur lors du téléversement des fichiers' },
      { status: 500 }
    );
  }
}