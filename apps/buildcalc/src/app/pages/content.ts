import { Component, inject } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { GUIDES, Guide } from '../data/guides';
import { MaterialArtComponent } from '../shared/material-art.component';

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
      { title: 'What the calculators do', paragraphs: ['BuildCalc currently includes calculators for gravel, paint, tile, concrete, square footage, and mulch. Calculations run in your browser and do not require an account. Your measurements are not sent to a BuildCalc application server.', 'Each calculator shows its calculation method, an example, and important limitations. The calculation functions are covered by automated tests; the tests check expected results and input validation, but cannot account for every product or job-site condition.'] },
      { title: 'How to use an estimate', paragraphs: ['Treat results as a starting point for planning. Product coverage, material density, packaging, layout, cutting, site preparation, and waste vary. Check manufacturer instructions and confirm quantities with your supplier before ordering.', 'BuildCalc does not provide structural design, building-code advice, a supplier quote, or professional construction advice. For safety or structural decisions, consult a qualified professional.'] },
      { title: 'Feedback', paragraphs: ['If you find an error, have a question, or want to suggest a calculator, email hello@zyankov.eu. Include the calculator name and enough detail to reproduce the issue; please do not include sensitive information.'] },
    ],
  },
  contact: {
    title: 'Contact BuildCalc', kicker: 'GET IN TOUCH',
    intro: 'Have a question or suggestion? Get in touch with the BuildCalc team.',
    sections: [],
  },
  privacy: {
    title: 'Privacy policy', kicker: 'YOUR PRIVACY',
    intro: 'This policy describes information processed when you use BuildCalc at zyankov.eu/calculators.',
    sections: [
      { title: 'Who is responsible', paragraphs: ['The site is created and maintained by Zlatko Yankov in Bulgaria. For privacy questions or requests, email hello@zyankov.eu.'] },
      { title: 'Calculator inputs and preferences', paragraphs: ['Measurements and options are processed in your browser by the calculator code. They are not sent to a BuildCalc application server and are not stored by BuildCalc. The site uses browser local storage to remember your light/dark theme and selected measurement system. These preferences remain in your browser and can be removed using your browser settings.'] },
      { title: 'Cookies, analytics, and third parties', paragraphs: ['BuildCalc is part of Zyankov.eu and shows ads from Google AdSense. Google may use cookies or similar technologies to serve and measure ads; visitors in the EEA, the UK and Switzerland are asked for consent first and can change their choice with Privacy settings in the footer. Advertising, analytics and cookies are described in full in the Zyankov.eu privacy policy at zyankov.eu/privacy/. The site may be served by hosting infrastructure that processes request information such as IP address, requested pages, browser details, and request times for delivery and security; its retention is controlled by the hosting provider.'] },
      { title: 'Contact and your choices', paragraphs: ['The contact page opens a mailto link in your email application; BuildCalc does not have a message form or receive a message until you choose to send an email. Your email provider processes the message after you send it. You can clear local preferences in your browser. Depending on applicable law, you may also have rights to request access, correction, deletion, restriction, or objection to certain processing.'] },
      { title: 'Updates', paragraphs: ['This policy will be updated if BuildCalc’s data practices or third-party services change. The review date is November 3, 2026.'] },
    ],
  },
  terms: {
    title: 'Terms of use', kicker: 'USING BUILDCALC',
    intro: 'These terms apply to your use of the BuildCalc website and its calculators, guides, and information pages.',
    sections: [
      { title: 'Planning estimates only', paragraphs: ['BuildCalc provides general arithmetic estimates based on the values and assumptions you enter. Results are not a supplier quote, guarantee, engineering design, building-code determination, or professional advice. Material coverage, density, packaging, site conditions, and workmanship can change actual requirements.', 'Check measurements and product specifications, and confirm order quantities with your supplier. Consult a qualified professional for structural, safety, or code-related decisions. You are responsible for deciding whether an estimate is appropriate for your project.'] },
      { title: 'Use of the site', paragraphs: ['Use BuildCalc lawfully and do not interfere with its operation or attempt unauthorized access. The site is provided without an account; do not submit sensitive personal information through the email link.'] },
      { title: 'Availability and changes', paragraphs: ['Calculators and supporting information may change, and uninterrupted availability or error-free results are not guaranteed. Nothing in these terms excludes rights or remedies that cannot be limited under applicable law.'] },
      { title: 'Contact', paragraphs: ['Questions about these terms can be sent to hello@zyankov.eu. Last updated: October 23, 2026.'] },
    ],
  },
  disclaimer: {
    title: 'Disclaimer', kicker: 'IMPORTANT INFORMATION',
    intro: 'BuildCalc calculators provide estimates for general planning only.',
    sections: [
      { title: 'Not professional or structural advice', paragraphs: ['Results depend on user-entered measurements and assumptions. Material density, coverage, site conditions, cutting, waste, and product packaging vary. Verify results with product documentation, suppliers, and qualified professionals.', 'Concrete volume estimates do not establish structural adequacy or construction compliance. Nothing on this site replaces engineering, local codes, safety instructions, or professional advice.'] },
      { title: 'No guaranteed outcome', paragraphs: ['BuildCalc does not guarantee that an estimate will match the quantity required or the price charged. Confirm quantities, delivery terms, and project requirements before making decisions or purchases.'] },
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
  protected readonly isGuideIndex = this.pageKey === 'guides';
  protected readonly guide: Guide | undefined = GUIDES.find((item) => item.slug === this.pageKey);
  protected readonly page: PageContent = this.guide
    ? { title: this.guide.title, kicker: this.guide.kicker, intro: this.guide.intro, sections: this.guide.sections }
    : this.isGuideIndex
      ? { title: 'Material guides', kicker: 'PROJECT KNOW-HOW', intro: 'Understand the assumptions behind common material estimates and learn what to confirm before placing an order.', sections: [] }
      : PAGES[this.pageKey] ?? PAGES['disclaimer'];
  protected readonly bannerImage = `url(images/${this.guide?.kind ?? 'hero'}.webp)`;
  protected readonly contact = this.pageKey === 'contact';
}
