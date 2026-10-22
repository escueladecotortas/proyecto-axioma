// Archivo: src/lib/dossier/pdfCompiler.ts
export class SimplePdfDocument {
  private pages: string[] = [];
  private currentPageContent: string[] = [];

  addPage(): void {
    if (this.currentPageContent.length > 0) {
      this.pages.push(this.currentPageContent.join('\n'));
      this.currentPageContent = [];
    }
  }

  drawRect(x: number, y: number, w: number, h: number, r: number, g: number, b: number, fill = true): void {
    const colorCmd = fill ? `${r} ${g} ${b} rg` : `${r} ${g} ${b} RG`;
    const op = fill ? 're f' : 're S';
    this.currentPageContent.push(`q ${colorCmd} ${x} ${y} ${w} ${h} ${op} Q`);
  }

  drawLine(x1: number, y1: number, x2: number, y2: number, r: number, g: number, b: number, width = 1): void {
    this.currentPageContent.push(`q ${width} w ${r} ${g} ${b} RG ${x1} ${y1} m ${x2} ${y2} l S Q`);
  }

  drawText(text: string, x: number, y: number, size = 10, bold = false, r = 0, g = 0, b = 0): void {
    const font = bold ? '/F2' : '/F1';
    const escaped = text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
    this.currentPageContent.push(
      `BT ${font} ${size} Tf ${r} ${g} ${b} rg 1 0 0 1 ${x} ${y} Tm (${escaped}) Tj ET`
    );
  }

  buildBlob(): Blob {
    if (this.currentPageContent.length > 0) {
      this.pages.push(this.currentPageContent.join('\n'));
      this.currentPageContent = [];
    }

    const objects: string[] = [];
    const count = this.pages.length;

    // 1: Catalog
    objects.push(`1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj`);

    // 2: Pages
    const kids = Array.from({ length: count }, (_, i) => `${3 + i * 2} 0 R`).join(' ');
    objects.push(`2 0 obj\n<< /Type /Pages /Kids [${kids}] /Count ${count} >>\nendobj`);

    // Page & Content Objects
    this.pages.forEach((content, i) => {
      const pageObjNum = 3 + i * 2;
      const contentObjNum = 4 + i * 2;
      const streamBytes = new TextEncoder().encode(content).length;

      objects.push(
        `${pageObjNum} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] ` +
        `/Resources << /Font << /F1 ${3 + count * 2} 0 R /F2 ${4 + count * 2} 0 R >> >> ` +
        `/Contents ${contentObjNum} 0 R >>\nendobj`
      );

      objects.push(
        `${contentObjNum} 0 obj\n<< /Length ${streamBytes} >>\nstream\n${content}\nendstream\nendobj`
      );
    });

    // Fonts: Helvetica and Helvetica-Bold
    const f1Obj = 3 + count * 2;
    const f2Obj = 4 + count * 2;
    objects.push(`${f1Obj} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj`);
    objects.push(`${f2Obj} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj`);

    let output = '%PDF-1.4\n';
    const offsets: number[] = [0];

    objects.forEach((obj) => {
      offsets.push(output.length);
      output += `${obj}\n`;
    });

    const startXref = output.length;
    output += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    for (let i = 1; i <= objects.length; i++) {
      output += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
    }

    output += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${startXref}\n%%EOF`;

    return new Blob([output], { type: 'application/pdf' });
  }
}
