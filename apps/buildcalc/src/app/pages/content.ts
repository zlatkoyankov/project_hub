import { Component, inject } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { GUIDES, Guide } from '../data/guides';
import { MaterialArtComponent } from '../shared/material-art.component';
import { SOURCES_CHECKED } from '../data/calculators';

interface ContentSection {
  title: string;
  paragraphs: string[];
}

interface PageContent {
  title: string;
  kicker: string;
  intro: string;
  sections: ContentSection[];
}

const PAGES: Record<string, PageContent> = {
  about: {
    title: 'About BuildCalc', kicker: 'PLAN SMARTER',
    intro: 'BuildCalc is an independent project by Zlatko Yankov, based in Bulgaria, that helps people make an initial materials plan for common home improvement and construction jobs.',
    sections: [
      { title: 'What the calculators do', paragraphs: ['BuildCalc has calculators for gravel, paint, tile, concrete, square footage, mulch, laminate flooring, drywall, tile adhesive and grout, wallpaper, screed and plaster, insulation boards, and bricks and blocks. Calculations run in your browser and do not require an account. Your measurements are not sent to a BuildCalc application server.', 'Each calculator shows its calculation method, an example, and important limitations. The calculation functions are covered by automated tests; the tests check expected results and input validation, but cannot account for every product or job-site condition.'] },
      { title: 'Where the numbers come from', paragraphs: ['Every default rate, such as paint coverage, gravel density, adhesive consumption or the number of bricks per square meter, comes from a manufacturer’s datasheet, a standard, a university extension service or a reputable trade source. Each calculator that uses such a rate links its sources under the result, together with the date they were last checked, and shows the formula it uses.', 'Change any default to the number on your product’s label or your supplier’s quote and the result follows it.'] },
      { title: 'How to use an estimate', paragraphs: ['Treat results as a starting point for planning. Product coverage, material density, packaging, layout, cutting, site preparation, and waste vary. Check manufacturer instructions and confirm quantities with your supplier before ordering.', 'BuildCalc does not provide structural design, building-code advice, a supplier quote, or professional construction advice. For safety or structural decisions, consult a qualified professional.'] },
      { title: 'Feedback', paragraphs: ['If you find an error, have a question, or want to suggest a calculator, email hello@zyankov.eu. Include the calculator name and enough detail to reproduce the issue; please do not include sensitive information.'] },
    ],
  },
};

@Component({
  standalone: true,
  imports: [RouterLink, MaterialArtComponent],
  templateUrl: './content.html',
})
export class ContentPage {
  private readonly route = inject(ActivatedRoute);
  protected readonly pageKey = this.route.snapshot.paramMap.get('slug') ?? this.route.snapshot.data['contentKey'] as string;
  protected readonly guides = GUIDES;
  protected readonly sourcesChecked = SOURCES_CHECKED;
  protected readonly isGuideIndex = this.pageKey === 'guides';
  protected readonly guide: Guide | undefined = GUIDES.find((item) => item.slug === this.pageKey);
  protected readonly page: PageContent = this.guide
    ? { title: this.guide.title, kicker: this.guide.kicker, intro: this.guide.intro, sections: this.guide.sections }
    : this.isGuideIndex
      ? { title: 'Material guides', kicker: 'PROJECT KNOW-HOW', intro: 'Understand the assumptions behind common material estimates and learn what to confirm before placing an order.', sections: [] }
      : PAGES[this.pageKey] ?? PAGES['about'];
  protected readonly bannerImage = `url(images/${this.guide?.kind ?? 'hero'}.webp)`;
}
