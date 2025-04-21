import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic'; // nécessaire pour les uploads

export async function POST(req: Request) {
  const formData = await req.formData();
  const files = formData.getAll('files') as File[];

  try {
    // Créer le dossier s'il n'existe pas
    const uploadDir = path.join(process.cwd(), 'public', 'shipments');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const buffer = await file.arrayBuffer();
        const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
        const ext = path.extname(file.name);
        const filename = `${file.name.replace(ext, '')}_${uniqueSuffix}${ext}`;
        const filepath = path.join(uploadDir, filename);
        
        await fs.promises.writeFile(filepath, Buffer.from(buffer));
        
        return {
          url: `/shipments/${filename}`,
          name: filename
        };
      })
    );

    return NextResponse.json({ success: true, files: uploadedFiles });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Erreur lors du téléversement des fichiers' },
      { status: 500 }
    );
  }
}