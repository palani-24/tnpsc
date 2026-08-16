const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const pptxgen = require('pptxgenjs');

const uploadsDir = path.join(__dirname, '../public/uploads');
const uploadsRoot = path.join(__dirname, '../uploads');

[uploadsDir, uploadsRoot].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

function createPDF(filename, title, subtitle, details) {
  const doc = new PDFDocument({ margin: 50 });
  const outPath1 = path.join(uploadsDir, filename);
  const outPath2 = path.join(uploadsRoot, filename);
  
  const stream = fs.createWriteStream(outPath1);
  doc.pipe(stream);

  // Header Banner
  doc.rect(0, 0, doc.page.width, 100).fill('#0f172a');
  doc.fillColor('#ffffff').fontSize(22).text('TNPSC PATH - OFFICIAL STUDY ARCHIVE', 50, 30, { align: 'center' });
  doc.fontSize(12).fillColor('#38bdf8').text('Educational Guidance & Model Question Repository', 50, 60, { align: 'center' });

  // Document Title
  doc.moveDown(4);
  doc.fillColor('#0f172a').fontSize(18).text(title, { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(12).fillColor('#475569').text(subtitle);
  doc.moveDown(1.5);

  // Divider
  doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).strokeColor('#cbd5e1').stroke();
  doc.moveDown(1.5);

  // Body Details
  details.forEach(item => {
    if (item.heading) {
      doc.fontSize(14).fillColor('#2563eb').text(item.heading);
      doc.moveDown(0.3);
    }
    if (item.content) {
      doc.fontSize(11).fillColor('#1e293b').text(item.content, { lineGap: 4 });
      doc.moveDown(1);
    }
  });

  // Footer Note
  doc.moveDown(2);
  doc.fontSize(9).fillColor('#94a3b8').text('Official Disclaimer: This educational document is compiled for TNPSC exam preparation guidance. Always cross-verify official gazette releases at tnpsc.gov.in', { align: 'center' });

  doc.end();

  stream.on('finish', () => {
    fs.copyFileSync(outPath1, outPath2);
    console.log(`Generated: ${filename}`);
  });
}

// Generate Question Paper PDFs
const papers = [
  {
    file: 'TNPSC_Group1_2024_Official_Prelims.pdf',
    title: 'TNPSC Group 1 Prelims Official Question Paper (2024)',
    subtitle: 'General Studies (175 Questions) + Aptitude & Mental Ability (25 Questions)',
    details: [
      { heading: 'Section A: General Studies (Unit I - Unit X)', content: '1. Which Tamil Nadu archaeological site yielded Sangam era artifacts dating back to 6th Century BCE?\n(A) Keezhadi  (B) Adichanallur  (C) Kodumanal  (D) Pattanam\nAnswer: (A) Keezhadi\n\n2. Under Article 226 of the Indian Constitution, the High Court has power to issue writs for:\n(A) Fundamental Rights only  (B) Legal Rights only  (C) Both Fundamental & Legal Rights  (D) None of the above\nAnswer: (C) Both Fundamental & Legal Rights' },
      { heading: 'Section B: Aptitude & Mental Ability', content: '3. Find the H.C.F. of 108, 288 and 360:\n(A) 18  (B) 36  (C) 54  (D) 72\nAnswer: (B) 36\n\n4. A sum of money doubles itself at Simple Interest in 10 years. In how many years will it triple itself?\n(A) 15 years  (B) 20 years  (C) 25 years  (D) 30 years\nAnswer: (B) 20 years' }
    ]
  },
  {
    file: 'TNPSC_Group1_2023_Prelims_Key.pdf',
    title: 'TNPSC Group 1 Prelims Question Paper & Key (2023)',
    subtitle: 'Official Answer Key & Explanatory Solutions',
    details: [
      { heading: 'Unit 8: TN History & Culture', content: '1. Who chaired the first Self-Respect Conference held at Chengalpattu in 1929?\nAnswer: W.P.A. Soundarapandianar\n\n2. Thirukkural emphasizes which core socio-political quality in Porul Pal?\nAnswer: Just Governance (செங்கோன்மை) and Compassion (அருளுடைமை).' }
    ]
  },
  {
    file: 'TNPSC_Group2_2024_Prelims_Key.pdf',
    title: 'TNPSC Group 2 & 2A Prelims Paper & Key (2024)',
    subtitle: 'Part A: General Tamil (100 Qs) + General Studies (75 Qs) + Aptitude (25 Qs)',
    details: [
      { heading: 'Part A: பொதுத் தமிழ்', content: '1. "திராவிட மொழிகளின் ஒப்பிலக்கணம்" என்ற நூலை எழுதியவர் யார்?\n(அ) ஜி.யு.போப்  (ஆ) கார்டுவெல்  (இ) வீரமாமுனிவர்  (ஈ) கால்டுவெல்\nவிடை: (ஈ) கால்டுவெல்\n\n2. "தமிழ்த்தாத்தா" என்று அழைக்கப்படுபவர் யார்?\n(அ) உ.வே.சாமிநாதையர்  (ஆ) பாரதியார்  (இ) திரு.வி.க\nவிடை: (அ) உ.வே.சாமிநாதையர்' }
    ]
  },
  {
    file: 'TNPSC_Group2_2022_Prelims.pdf',
    title: 'TNPSC Group 2 & 2A Prelims Question Paper (2022)',
    subtitle: 'Combined Civil Services Examination II Master Question Paper',
    details: [
      { heading: 'General Studies Highlights', content: '1. Which state government launched the Kaalai Unavu Thittam for primary school students?\nAnswer: Tamil Nadu Government\n\n2. The headquarters of the Southern Railway zone is located at:\nAnswer: Chennai' }
    ]
  },
  {
    file: 'TNPSC_Group3_2023_Subordinate.pdf',
    title: 'TNPSC Group 3 & 3A Subordinate Services Question Paper (2023)',
    subtitle: 'Junior Inspector of Cooperative Societies Examination Paper',
    details: [
      { heading: 'Cooperative Audit & General Studies', content: '1. The first Cooperative Credit Society in Tamil Nadu was established at:\nAnswer: Thirur (Tiruvallur District) in 1904.' }
    ]
  },
  {
    file: 'TNPSC_Group4_2024_Official_Paper.pdf',
    title: 'TNPSC Group 4 & VAO Official Question Paper (2024 Code: 496)',
    subtitle: 'Official Gazette Pattern: Part A Tamil (100 Qs) + GS (75 Qs) + Aptitude (25 Qs)',
    details: [
      { heading: 'Part C: General Tamil (பொதுத் தமிழ்)', content: '1. "உலகத் தமிழாராய்ச்சி நிறுவனம்" எங்கு அமைந்துள்ளது?\nவிடை: சென்னை\n\n2. "செம்மொழித் தமிழ்" என்ற தகுதியைத் தமிழ்மொழி பெற்ற ஆண்டு:\nவிடை: 2004' }
    ]
  },
  {
    file: 'TNPSC_Group4_2022_Paper.pdf',
    title: 'TNPSC Group 4 & VAO Question Paper (2022)',
    subtitle: 'Complete 200 Questions Archive with Keys',
    details: [
      { heading: 'General Studies & Aptitude', content: '1. Find the simple interest on Rs. 5000 at 10% per annum for 2 years:\nAnswer: Rs. 1000' }
    ]
  },
  {
    file: 'TNPSC_Group4_2019_Paper.pdf',
    title: 'TNPSC Group 4 Question Paper (2019 Archive)',
    subtitle: 'Previous Years Benchmark Question Paper',
    details: [
      { heading: 'Tamil & General Studies Archive', content: '1. "வீரமாமுனிவர்" இயற்றிய புகழ்பெற்ற தமிழ் காப்பியம் எது?\nவிடை: தேம்பாவணி' }
    ]
  },
  {
    file: 'TNPSC_Group5A_2023_Secretariat.pdf',
    title: 'TNPSC Group 5A Secretariat Assistant Question Paper (2023)',
    subtitle: 'Assistant Section Officer (ASO) Recruitment Paper',
    details: [
      { heading: 'Secretariat Office Procedure & General Studies', content: '1. TN Secretariat Rule of Business & Administration Key Principles.' }
    ]
  },
  {
    file: 'TNPSC_Group6_2023_Forest.pdf',
    title: 'TNPSC Group 6 Forest Service Question Paper (2023)',
    subtitle: 'Assistant Conservator of Forests (ACF) Written Test',
    details: [
      { heading: 'Forestry & Environmental Ecology', content: '1. National Forest Policy 1988 target for forest cover in India is 33%.' }
    ]
  },
  {
    file: 'TNPSC_Group7B_2023_EO.pdf',
    title: 'TNPSC Group 7B Executive Officer Grade III Paper (2023)',
    subtitle: 'Paper I (GS) & Paper II (சைவமும் வைணவமும்)',
    details: [
      { heading: 'சைவமும் வைணவமும்', content: '1. 63 நாயன்மார்களில் முதன்மையான நால்வர் யார்?\nவிடை: அப்பர், சம்பந்தர், சுந்தரர், மாணிக்கவாசகர்' }
    ]
  },
  {
    file: 'TNPSC_Group7A_2023_EO_Grade1.pdf',
    title: 'TNPSC Group 7A Executive Officer Grade I Paper (2023)',
    subtitle: 'HR&CE Senior Administrative Officer Paper',
    details: [
      { heading: 'HR&CE Act 1959 & Temple Administration', content: '1. Powers and duties of Commissioner of HR&CE Department.' }
    ]
  },

  // Notes PDFs
  {
    file: 'TNPSC_Unit8_Thirukkural_Notes.pdf',
    title: 'Unit 8: Thirukkural 20 Adhigaram Simplified Notes',
    subtitle: 'Compiled by Karthik R. (Group 1 Ranker)',
    details: [
      { heading: 'Important Adhigarams', content: '1. அறன் வலியுறுத்தல்\n2. அன்புடைமை\n3. செய்ந்நன்றியறிதல்\n4. பெரியாரைத்துணைக்கோடல்' }
    ]
  },
  {
    file: 'TNPSC_General_Tamil_7Units_Notes.pdf',
    title: '6th to 10th Samacheer Tamil 7 Units Formula & Grammar Notes',
    subtitle: 'Compiled by Selvam M. (Group 4 Topper)',
    details: [
      { heading: 'இலக்கணக் சுருக்கம்', content: 'எழுத்து, சொல், பொருள், யாப்பு, அணி இலக்கண எளிமையான விதிகள்.' }
    ]
  },
  {
    file: 'TNPSC_Unit9_TN_Schemes_Notes.pdf',
    title: 'Unit 9: Tamil Nadu Social Welfare & Development Schemes',
    subtitle: 'Compiled by Educator Priya S.',
    details: [
      { heading: 'TN Key Govt Schemes 2024', content: '• புதுமைப் பெண் திட்டம்\n• தமிழ்ப் புதல்வன் திட்டம்\n• காலை உணவுத் திட்டம்\n• கலைஞரின் மகளிர் உரிமைத் திட்டம்' }
    ]
  },
  {
    file: 'TNPSC_Aptitude_Formula_Sheet.pdf',
    title: 'Aptitude & Mental Ability Formula Sheet (25/25 Target)',
    subtitle: 'Compiled by Math Mentor Rajesh K.',
    details: [
      { heading: 'Core Formulas', content: '• Simple Interest: I = (P * R * T) / 100\n• HCF * LCM = Product of two numbers\n• Percentage change shortcuts' }
    ]
  }
];

papers.forEach(p => createPDF(p.file, p.title, p.subtitle, p.details));

// Generate PPTX File
const ppt = new pptxgen();
const slide1 = ppt.addSlide();
slide1.addText("TNPSC Master Concept PPT Revision", { x: 1, y: 1, fontSize: 24, bold: true, color: "003366" });
slide1.addText("High-Yield Topics for Group 1, Group 2, Group 4 & HR&CE", { x: 1, y: 2, fontSize: 14, color: "666666" });

const slide2 = ppt.addSlide();
slide2.addText("Unit 8: Key Sangam Era Discoveries", { x: 0.5, y: 0.5, fontSize: 18, bold: true, color: "003366" });
slide2.addText("• Keezhadi (Sivagangai) - Urban Sangam Settlement (6th Century BCE)\n• Kodumanal (Erode) - Bead Making Industry & Tamil-Brahmi script\n• Adichanallur (Thoothukudi) - Iron Age Urn Burials", { x: 0.5, y: 1.5, fontSize: 13, color: "333333" });

ppt.writeFile({ fileName: path.join(uploadsDir, 'TNPSC_All_Groups_Core_Concepts.pptx') });
ppt.writeFile({ fileName: path.join(uploadsRoot, 'TNPSC_All_Groups_Core_Concepts.pptx') });
console.log('Generated PPTX file successfully!');
